import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
};

const GA4_MEASUREMENT_ID = 'G-FJ5SDNJCE1';
const META_PIXEL_ID = '898424022537875';
const META_API_VERSION = 'v21.0';

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyHmac(rawBody: string, header: string | null, secret: string): Promise<boolean> {
  if (!header) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  return timingSafeEqual(toBase64(new Uint8Array(sig)), header);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const rawBody = await req.text();

  // 1. HMAC verification
  const webhookSecret = Deno.env.get('SHOPIFY_WEBHOOK_SECRET');
  if (!webhookSecret) {
    console.error('Missing SHOPIFY_WEBHOOK_SECRET');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const hmacHeader = req.headers.get('X-Shopify-Hmac-Sha256');
  const valid = await verifyHmac(rawBody, hmacHeader, webhookSecret);
  if (!valid) {
    console.error('Invalid Shopify HMAC signature');
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 2. Parse payload
  let order: any;
  try {
    order = JSON.parse(rawBody);
  } catch (e) {
    console.error('Invalid JSON payload:', e);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const orderId = String(order?.id ?? order?.order_id ?? '');
  if (!orderId) {
    console.error('Payload missing order id');
    return new Response(JSON.stringify({ error: 'Missing order id' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const orderTotal = parseFloat(order?.total_price ?? order?.current_total_price ?? '0') || 0;
  const currency = order?.currency ?? order?.presentment_currency ?? 'ILS';
  const email: string | undefined =
    order?.email || order?.contact_email || order?.customer?.email || undefined;
  const lineItems: any[] = Array.isArray(order?.line_items) ? order.line_items : [];

  console.log(`Processing order ${orderId}, total ${orderTotal} ${currency}, ${lineItems.length} line items`);

  // 3. Write purchase rows to analytics_events (idempotent)
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: existing, error: checkError } = await supabase
      .from('analytics_events')
      .select('id')
      .eq('event_type', 'purchase')
      .eq('order_id', orderId)
      .limit(1);

    if (checkError) throw checkError;

    if (existing && existing.length > 0) {
      console.log(`Order ${orderId} already tracked, skipping inserts`);
    } else {
      const rows = (lineItems.length > 0 ? lineItems : [null]).map((item) => ({
        event_type: 'purchase',
        page_path: '/thank-you',
        order_id: orderId,
        order_total: orderTotal,
        currency,
        product_id: item ? String(item.product_id ?? '') : undefined,
        product_title: item ? item.title ?? item.name ?? undefined : undefined,
        price: item ? parseFloat(item.price ?? '0') || 0 : orderTotal,
        quantity: item ? item.quantity ?? 1 : 1,
        user_email: email,
        session_id: `shopify_webhook_${orderId}`,
      }));

      const { error: insertError } = await supabase.from('analytics_events').insert(rows);
      if (insertError) throw insertError;
      console.log(`Inserted ${rows.length} purchase events for order ${orderId}`);
    }
  } catch (e) {
    console.error('Failed writing analytics_events:', e);
  }

  // 4. GA4 Measurement Protocol
  try {
    const ga4Secret = Deno.env.get('GA4_API_SECRET');
    if (!ga4Secret) {
      console.log('GA4_API_SECRET not set, skipping GA4 server-side purchase event');
    } else {
      const ga4Res = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${ga4Secret}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: `shopify.${orderId}`,
            events: [
              {
                name: 'purchase',
                params: {
                  transaction_id: orderId,
                  value: orderTotal,
                  currency,
                  items: lineItems.map((item) => ({
                    item_id: String(item.product_id ?? ''),
                    item_name: item.title ?? item.name ?? '',
                    price: parseFloat(item.price ?? '0') || 0,
                    quantity: item.quantity ?? 1,
                  })),
                },
              },
            ],
          }),
        },
      );
      console.log(`GA4 MP response status: ${ga4Res.status}`);
    }
  } catch (e) {
    console.error('GA4 Measurement Protocol failed:', e);
  }

  // 5. Meta Conversions API
  try {
    const metaToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');
    if (!metaToken) {
      console.log('META_CAPI_ACCESS_TOKEN not set, skipping Meta CAPI purchase event');
    } else {
      const userData: Record<string, unknown> = {};
      if (email) userData.em = [await sha256Hex(email.trim().toLowerCase())];
      const phone = order?.phone || order?.customer?.phone;
      if (phone) userData.ph = [await sha256Hex(String(phone).replace(/\D/g, ''))];

      const metaRes = await fetch(
        `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${metaToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [
              {
                event_name: 'Purchase',
                event_time: Math.floor(
                  (order?.created_at ? new Date(order.created_at).getTime() : Date.now()) / 1000,
                ),
                event_id: `order_${orderId}`,
                action_source: 'website',
                event_source_url: 'https://fullbody.co.il/thank-you',
                user_data: userData,
                custom_data: {
                  currency,
                  value: orderTotal,
                  order_id: orderId,
                  content_type: 'product',
                  contents: lineItems.map((item) => ({
                    id: String(item.product_id ?? ''),
                    quantity: item.quantity ?? 1,
                    item_price: parseFloat(item.price ?? '0') || 0,
                  })),
                },
              },
            ],
          }),
        },
      );
      const metaBody = await metaRes.text();
      console.log(`Meta CAPI response [${metaRes.status}]: ${metaBody}`);
    }
  } catch (e) {
    console.error('Meta Conversions API failed:', e);
  }

  // 6. Always 200 after signature + parsing succeeded
  return new Response(JSON.stringify({ received: true, order_id: orderId }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

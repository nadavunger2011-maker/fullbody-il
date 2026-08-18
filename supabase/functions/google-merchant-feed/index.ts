import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  SHOPIFY_STOREFRONT_URL,
  STORE_URL,
  brandFor,
  isHerbalife,
  productUrl,
} from "../_shared/product-links.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          tags
          images(first: 5) {
            edges { node { url altText } }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                sku
                barcode
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                image { url }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

interface Variant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  image: { url: string } | null;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: Variant }> };
}

function escapeXml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanDescription(text: string, fallback: string): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  return (clean || fallback).slice(0, 4900);
}

function generateProductXml(node: ProductNode): string {
  const productId = node.id.split('/').pop() || node.handle;
  const link = productUrl(node.handle);
  const brand = brandFor(node.handle, node.vendor);
  const herbalife = isHerbalife(node.handle);
  const mainImage = node.images.edges[0]?.node.url || '';
  const extraImages = node.images.edges.slice(1, 5).map((i) => i.node.url);
  const description = cleanDescription(node.description, node.title);
  const variants = node.variants.edges.map((e) => e.node);
  const multiVariant = variants.length > 1;

  return variants
    .map((variant) => {
      const variantId = variant.id.split('/').pop() || productId;
      const price = parseFloat(variant.price.amount).toFixed(2);
      const currency = variant.price.currencyCode || 'ILS';
      const compareAt = variant.compareAtPrice
        ? parseFloat(variant.compareAtPrice.amount)
        : null;
      const hasSale = compareAt !== null && compareAt > parseFloat(price);
      const availability = variant.availableForSale ? 'in_stock' : 'out_of_stock';
      const image = variant.image?.url || mainImage;
      const title = multiVariant && variant.title && variant.title !== 'Default Title'
        ? `${node.title} - ${variant.title}`
        : node.title;
      const itemLink = multiVariant ? `${link}?variant=${variantId}` : link;
      const options = variant.selectedOptions
        .filter((o) => o.value && o.value !== 'Default Title')
        .map((o) => {
          const name = o.name.toLowerCase();
          if (name.includes('size') || name.includes('גודל') || name.includes('גרם')) {
            return `<g:size>${escapeXml(o.value)}</g:size>`;
          }
          if (name.includes('color') || name.includes('צבע') || name.includes('טעם') || name.includes('flavor')) {
            return `<g:color>${escapeXml(o.value)}</g:color>`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n      ');

      return `
    <item>
      <g:id>${escapeXml(variantId)}</g:id>
      ${multiVariant ? `<g:item_group_id>${escapeXml(productId)}</g:item_group_id>` : ''}
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(itemLink)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      ${extraImages.map((img) => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${availability}</g:availability>
      <g:price>${hasSale ? compareAt!.toFixed(2) : price} ${currency}</g:price>
      ${hasSale ? `<g:sale_price>${price} ${currency}</g:sale_price>` : ''}
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:adult>no</g:adult>
      ${variant.barcode ? `<g:gtin>${escapeXml(variant.barcode)}</g:gtin>` : ''}
      ${variant.sku ? `<g:mpn>${escapeXml(variant.sku)}</g:mpn>` : ''}
      ${!variant.barcode && !variant.sku ? `<g:identifier_exists>no</g:identifier_exists>` : ''}
      ${node.productType ? `<g:product_type>${escapeXml(node.productType)}</g:product_type>` : ''}
      <g:google_product_category>Health &amp; Beauty &gt; Health Care &gt; Fitness &amp; Nutrition &gt; Nutritional Supplements</g:google_product_category>
      <g:custom_label_0>${herbalife ? 'herbalife' : 'nava'}</g:custom_label_0>
      ${node.tags.length ? `<g:custom_label_1>${escapeXml(node.tags.slice(0, 3).join(', '))}</g:custom_label_1>` : ''}
    </item>`;
    })
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get('SHOPIFY_STOREFRONT_ACCESS_TOKEN');

    if (!SHOPIFY_STOREFRONT_TOKEN) {
      console.error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variable');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const nodes: ProductNode[] = [];
    let after: string | null = null;
    let hasNextPage = true;
    let page = 0;

    while (hasNextPage && page < 10) {
      const response = await fetch(SHOPIFY_STOREFRONT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: STOREFRONT_QUERY,
          variables: { first: 100, after },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Shopify API error [${response.status}]: ${errorText}`);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        console.error('GraphQL errors:', JSON.stringify(data.errors));
        throw new Error(`GraphQL error: ${data.errors.map((e: any) => e.message).join(', ')}`);
      }

      const products = data.data?.products;
      nodes.push(...(products?.edges || []).map((e: { node: ProductNode }) => e.node));
      hasNextPage = Boolean(products?.pageInfo?.hasNextPage);
      after = products?.pageInfo?.endCursor ?? null;
      page += 1;
    }

    const herbalifeCount = nodes.filter((n) => isHerbalife(n.handle)).length;
    console.log(
      `Merchant feed: ${nodes.length} products (${herbalifeCount} Herbalife / ${nodes.length - herbalifeCount} Nava)`
    );

    const productItems = nodes.map(generateProductXml).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>FullBody - תוספי תזונה</title>
    <link>${STORE_URL}</link>
    <description>קטלוג מוצרי תוספי תזונה מ-FullBody (הרבלייף ונאווה)</description>
    ${productItems}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800',
      },
    });
  } catch (error) {
    console.error('Error generating feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

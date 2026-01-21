import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = 'fullbody-il.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '24f43d6d6b1e9e40c173ab07430458b3';
const STORE_URL = 'https://fullbody.co.il';

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                sku
                availableForSale
                weight
                weightUnit
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    vendor: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          sku: string;
          availableForSale: boolean;
          weight: number;
          weightUnit: string;
        };
      }>;
    };
  };
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

function generateProductXml(product: ShopifyProduct): string {
  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  
  const price = parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2);
  const currency = node.priceRange.minVariantPrice.currencyCode;
  const availability = variant?.availableForSale ? 'in_stock' : 'out_of_stock';
  const productId = node.id.split('/').pop();
  
  return `
    <item>
      <g:id>${escapeXml(productId || node.handle)}</g:id>
      <g:title>${escapeXml(node.title)}</g:title>
      <g:description>${escapeXml(node.description || node.title)}</g:description>
      <g:link>${STORE_URL}/product/${escapeXml(node.handle)}</g:link>
      <g:image_link>${escapeXml(image?.url || '')}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} ${currency}</g:price>
      <g:brand>${escapeXml(node.vendor || 'FullBody')}</g:brand>
      <g:condition>new</g:condition>
      ${node.productType ? `<g:product_type>${escapeXml(node.productType)}</g:product_type>` : ''}
      ${variant?.sku ? `<g:mpn>${escapeXml(variant.sku)}</g:mpn>` : ''}
    </item>`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching products from Shopify for Google Merchant Feed...');
    
    const response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
      },
      body: JSON.stringify({
        query: STOREFRONT_QUERY,
        variables: { first: 250 }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    const products: ShopifyProduct[] = data.data?.products?.edges || [];
    console.log(`Found ${products.length} products`);

    const productItems = products.map(generateProductXml).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>FullBody - תוספי תזונה</title>
    <link>${STORE_URL}</link>
    <description>מוצרי תוספי תזונה מ-FullBody</description>
    ${productItems}
  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error generating feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
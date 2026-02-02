import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_STORE_DOMAIN = 'fullbody-il.myshopify.com';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
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
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                sku
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  sku: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    vendor: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
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
        node: ShopifyVariant;
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
  const productId = node.id.split('/').pop();
  const images = node.images.edges.map(img => img.node.url);
  const mainImage = images[0] || '';
  const additionalImages = images.slice(1);
  
  // Generate items for each variant
  const variantItems = node.variants.edges.map(variantEdge => {
    const variant = variantEdge.node;
    const variantId = variant.id.split('/').pop();
    const price = parseFloat(variant.price.amount).toFixed(2);
    const compareAtPrice = variant.compareAtPrice 
      ? parseFloat(variant.compareAtPrice.amount).toFixed(2) 
      : null;
    const currency = variant.price.currencyCode;
    const availability = variant.availableForSale ? 'in stock' : 'out of stock';
    
    // Build variant-specific title
    const variantTitle = variant.title !== 'Default Title' 
      ? `${node.title} - ${variant.title}` 
      : node.title;
    
    // Build variant options for Flashy
    const options = variant.selectedOptions
      .filter(opt => opt.value !== 'Default Title')
      .map(opt => `<${opt.name.toLowerCase()}>${escapeXml(opt.value)}</${opt.name.toLowerCase()}>`)
      .join('\n        ');

    return `
    <item>
      <id>${escapeXml(variantId || productId || node.handle)}</id>
      <parent_id>${escapeXml(productId || node.handle)}</parent_id>
      <title>${escapeXml(variantTitle)}</title>
      <description>${escapeXml(node.description || node.title)}</description>
      <link>${STORE_URL}/product/${escapeXml(node.handle)}</link>
      <image_link>${escapeXml(mainImage)}</image_link>
      ${additionalImages.map((img, i) => `<additional_image_link_${i + 1}>${escapeXml(img)}</additional_image_link_${i + 1}>`).join('\n      ')}
      <availability>${availability}</availability>
      <price>${price} ${currency}</price>
      ${compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) ? `<sale_price>${price} ${currency}</sale_price>
      <regular_price>${compareAtPrice} ${currency}</regular_price>` : ''}
      <brand>${escapeXml(node.vendor || 'FullBody')}</brand>
      <sku>${escapeXml(variant.sku || variantId || '')}</sku>
      <condition>new</condition>
      ${node.productType ? `<category>${escapeXml(node.productType)}</category>` : ''}
      ${node.tags.length > 0 ? `<tags>${escapeXml(node.tags.join(', '))}</tags>` : ''}
      ${options ? `${options}` : ''}
    </item>`;
  });

  return variantItems.join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log('Fetching products from Shopify for Flashy Catalog Feed...');
    
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
    console.log(`Found ${products.length} products for Flashy catalog`);

    const productItems = products.map(generateProductXml).join('');

    // Flashy XML format
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>FullBody - תוספי תזונה</title>
    <link>${STORE_URL}</link>
    <description>קטלוג מוצרי תוספי תזונה מ-FullBody</description>
    <language>he</language>
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
    console.error('Error generating Flashy feed:', error);
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

// Flashy SDK TypeScript definitions
declare global {
  interface Window {
    flashy: FlashyFunction;
    FlashyObject: string;
  }
}

type FlashyFunction = {
  (command: 'init', accountId: string): void;
  (command: 'identify', data: FlashyIdentifyData): void;
  (command: 'setCustomer', data: FlashyCustomerData): void;
  (command: 'UpdateCart', data: FlashyCartData): void;
  (command: 'Purchase', data: FlashyPurchaseData): void;
  (command: 'track', eventName: string, data?: Record<string, unknown>): void;
  q?: unknown[];
};

interface FlashyIdentifyData {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  list_id?: string;
  [key: string]: unknown;
}

interface FlashyCustomerData {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: unknown;
}

interface FlashyCartItem {
  product_id: string;
  variant_id: string;
  title: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface FlashyCartData {
  cart_id?: string;
  items: FlashyCartItem[];
  total: number;
  currency?: string;
}

interface FlashyPurchaseData {
  order_id: string;
  items: FlashyCartItem[];
  total: number;
  currency?: string;
  email?: string;
}

declare const flashy: FlashyFunction;

export {};

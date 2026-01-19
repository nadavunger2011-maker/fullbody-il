// Flashy SDK TypeScript definitions
declare global {
  interface Window {
    flashy: FlashyFunction;
    FlashyObject: string;
  }
}

interface FlashyContacts {
  create: (data: FlashyContactData, listId?: number) => void;
  update: (data: Record<string, unknown>) => void;
  anonymous: () => boolean;
  createOrUpdate: (data: FlashyContactData & { lists?: Record<number, boolean> }) => void;
}

type FlashyFunction = {
  (command: 'init', accountId: string): void;
  (command: 'PageView'): void;
  (command: 'ViewContent', data: FlashyViewContentData): void;
  (command: 'setCustomer', data: FlashyCustomerData): void;
  (command: 'UpdateCart', data: FlashyCartData): void;
  (command: 'AddToCart', data: FlashyCartData): void;
  (command: 'Purchase', data: FlashyPurchaseData): void;
  (command: 'PurchaseUpdated', data: FlashyPurchaseUpdatedData): void;
  (command: 'CustomEvent', data: { event_name: string }): void;
  (command: string, data?: Record<string, unknown>): void;
  contacts: FlashyContacts;
  q?: unknown[];
};

interface FlashyContactData {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: unknown;
}

interface FlashyCustomerData {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: unknown;
}

interface FlashyViewContentData {
  content_ids: string[];
}

interface FlashyCartData {
  content_ids: string[];
  value: number;
  currency: string;
}

interface FlashyPurchaseData {
  content_ids: string[];
  value: number;
  currency: string;
  order_id: string;
}

interface FlashyPurchaseUpdatedData {
  status: string;
  order_id: string;
  content_ids?: string[];
  value?: number;
  currency?: string;
}

declare const flashy: FlashyFunction;

export {};

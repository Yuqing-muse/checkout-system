export interface Product {
  sku: string;
  name: string;
  /** Price in cents (e.g. $10.95 → 1095) */
  price: number;
}

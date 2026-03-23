import { Product } from "./models/product";

export const CATALOGUE: Record<string, Product> = {
  ipd: { sku: "ipd", name: "Super iPad", price: 54999 },
  mbp: { sku: "mbp", name: "MacBook Pro", price: 139999 },
  atv: { sku: "atv", name: "Apple TV", price: 10950 },
  vga: { sku: "vga", name: "VGA adapter", price: 3000 },
};

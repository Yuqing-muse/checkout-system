import { Product } from "../models/product";

export interface PricingRule {
  apply(items: string[], catalogue: Record<string, Product>): number;
}

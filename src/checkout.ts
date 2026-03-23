import { PricingRule } from "./rules";
import { Product } from "./models/product";
import { CATALOGUE } from "./catalogue";
import { UnknownSkuError } from "./errors";
import { assert } from "./assert";

/**
 * Checkout allows items to be scanned one at a time and calculates
 * the total price after applying all pricing rules.
 */
export class Checkout {
  private items: string[] = [];

  constructor(
    private readonly pricingRules: PricingRule[],
    private readonly catalogue: Record<string, Product> = CATALOGUE
  ) {}

  scan(item: string): void {
    assert(!!this.catalogue[item], new UnknownSkuError(item));
    this.items.push(item);
  }

  total(): number {
    let baseTotal = 0;
    let adjustments = 0;

    // Calculate the base price of items in total
    this.items.forEach((sku) => {
      const product = CATALOGUE[sku];
      if (product) {
        baseTotal += product.price;
      }
    });

    // Apply each discounted rule
    this.pricingRules.forEach((rule) => {
      adjustments += rule.apply(this.items, this.catalogue);
    });

    return (baseTotal + adjustments) / 100;
  }
}

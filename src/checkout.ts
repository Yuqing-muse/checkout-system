import { PricingRule } from "./rules";
import { CATALOGUE } from "./catalogue";

/**
 * Checkout allows items to be scanned one at a time and calculates
 * the total price after applying all discount rules.
 */
export class Checkout {
  private items: string[] = [];

  constructor(private readonly pricingRules: PricingRule[]) {}

  scan(item: string): void {
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
      adjustments += rule.apply(this.items);
    });

    return (baseTotal + adjustments) / 100;
  }
}

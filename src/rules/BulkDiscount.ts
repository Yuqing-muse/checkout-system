import { PricingRule } from "./PricingRule";
import { Product } from "../models/product";
import { UnknownSkuError, InvalidRuleConfigError } from "../errors";
import { assert } from "../assert";

/**
 * Bulk discount rule: when more than `threshold` units of a SKU are purchased,
 * the unit price drops to `discountedPrice` for all units.
 *
 * @param sku             - SKU that the rule applies to
 * @param threshold       - Minimum quantity to exceed (strictly greater than)
 * @param discountedPrice - Discounted unit price in cents
 */
export class BulkDiscount implements PricingRule {
  constructor(
    private readonly sku: string,
    private readonly threshold: number,
    private readonly discountedPrice: number
  ) {
    assert(threshold > 0, new InvalidRuleConfigError(`threshold must be greater than 0, got ${threshold}`));
    assert(discountedPrice >= 0, new InvalidRuleConfigError(`discountedPrice cannot be negative, got ${discountedPrice}`));
  }

  apply(items: string[], catalogue: Record<string, Product>): number {
    assert(!!catalogue[this.sku], new UnknownSkuError(this.sku));

    const basePrice = catalogue[this.sku].price;

    assert(
      this.discountedPrice < basePrice,
      new InvalidRuleConfigError(`discountedPrice (${this.discountedPrice}) must be less than base price (${basePrice})`)
    );

    const count = items.filter((item) => item === this.sku).length;

    // No discount applied when quantity not exceeds threshold
    if (count <= this.threshold) return 0;

    return -(basePrice - this.discountedPrice) * count;
  }
}

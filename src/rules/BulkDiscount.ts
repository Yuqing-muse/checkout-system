import { PricingRule } from "./PricingRule";
import { CATALOGUE } from "../catalogue";
import { UnknownSkuError, InvalidRuleConfigError } from "../errors";
import { assert } from "../assert";

/**
 * Bulk discount rule: when more than `threshold` units of a SKU are purchased,
 * the unit price drops to `discountedPrice` for all units.
 *
 * @param sku             - SKU that the rule applies to
 * @param threshold       - Minimum quantity to exceed
 * @param discountedPrice - Discounted unit price in cents
 */
export class BulkDiscount implements PricingRule {

  constructor(
    private readonly sku: string,
    private readonly threshold: number,
    private readonly discountedPrice: number
  ) {
    assert(!!CATALOGUE[sku], new UnknownSkuError(sku));
    assert(threshold > 0, new InvalidRuleConfigError(`threshold must be greater than 0, got ${threshold}`));
    assert(discountedPrice >= 0, new InvalidRuleConfigError(`discountedPrice cannot be negative, got ${discountedPrice}`));
    assert(discountedPrice < CATALOGUE[sku].price, new InvalidRuleConfigError(`discountedPrice (${discountedPrice}) must be less than base price (${CATALOGUE[sku].price})`));
  }

  apply(items: string[]): number {
    const count = items.filter((item) => item === this.sku).length;

    // No discount applied when quantity not exceeds threshold
    if (count <= this.threshold) return 0;

    const basePrice = CATALOGUE[this.sku].price;

    return -(basePrice - this.discountedPrice) * count;
  }
}

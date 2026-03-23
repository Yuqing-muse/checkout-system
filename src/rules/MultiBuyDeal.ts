import { PricingRule } from "./PricingRule";
import { CATALOGUE } from "../catalogue";
import { UnknownSkuError, InvalidRuleConfigError } from "../errors";
import { assert } from "../assert";

/**
 * Multi-buy deal rule
 *
 * @param sku       - The SKU this rule applies to
 * @param buyCount  - Number of units to trigger the deal
 * @param payCount  - Number of units charged
 *
 * Example: 3-for-2 on Apple TVs → new MultiBuyDeal("atv", 3, 2)
 */
export class MultiBuyDeal implements PricingRule {

  constructor(
    private readonly sku: string,
    private readonly buyCount: number,
    private readonly payCount: number
  ) {
    assert(!!CATALOGUE[sku], new UnknownSkuError(sku));
    assert(buyCount > 1, new InvalidRuleConfigError(`buyCount must be greater than 1, got ${buyCount}`));
    assert(payCount > 0, new InvalidRuleConfigError(`payCount must be greater than 0, got ${payCount}`));
    assert(payCount < buyCount, new InvalidRuleConfigError(`payCount (${payCount}) must be less than buyCount (${buyCount})`));
  }

  apply(items: string[]): number {
    const totalCount = items.filter((item) => item === this.sku).length;
    const price = CATALOGUE[this.sku].price;

    // Calculate how many units are charged at full price
    const fullPriceCount =
      (Math.floor(totalCount / this.buyCount) * this.payCount) +
      (totalCount % this.buyCount);

    const discount = (totalCount - fullPriceCount) * price;

    return discount > 0 ? -discount : 0;
  }
}

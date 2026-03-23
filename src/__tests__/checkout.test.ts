import { Checkout } from "../checkout";
import { MultiBuyDeal, BulkDiscount, PricingRule } from "../rules";

const pricingRules: PricingRule[] = [
  new MultiBuyDeal("atv", 3, 2),
  new BulkDiscount("ipd", 4, 49999),
];

function checkout(...items: string[]): number {
  const co = new Checkout(pricingRules);

  items.forEach((item) => co.scan(item));
  return co.total();
}

describe("Checkout", () => {
  it("empty cart totals zero", () => {
    expect(new Checkout(pricingRules).total()).toBe(0);
  });

  it("no rules applied", () => {
    expect(checkout("mbp", "vga")).toBe(1429.99);
  });

  it("should apply buy 3 get 2 deal", () => {
    expect(checkout("atv", "atv", "atv")).toBe(219.0);
  });

  it("should bulk iPad discount over 4 units", () => {
    expect(checkout("ipd", "ipd", "ipd", "ipd", "ipd")).toBe(2499.95);
  });

  it("no bulk iPad discount at exactly 4 units", () => {
    expect(checkout("ipd", "ipd", "ipd", "ipd")).toBe(2199.96);
  });

  it("should buy 3 get 2 deal with other items", () => {
    expect(checkout("atv", "atv", "atv", "vga", "vga")).toBe(249.0);
  });

  it("should apply multiple rules in one cart", () => {
    expect(checkout("atv", "atv", "atv", "ipd", "ipd", "ipd", "ipd", "ipd")).toBe(2718.95);
  });

  it("scan order should not affect total", () => {
    const total1 = checkout("atv", "ipd", "atv", "atv");
    const total2 = checkout("ipd", "atv", "atv", "atv");
    const total3 = checkout("atv", "atv", "ipd", "atv");

    expect(total1).toBe(total2);
    expect(total2).toBe(total3);
  });
});

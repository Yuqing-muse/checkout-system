import { MultiBuyDeal, BulkDiscount } from "../rules";
import { UnknownSkuError, InvalidRuleConfigError } from "../errors";

describe("MultiBuyDeal constructor guards", () => {
  it("should throw UnknownSkuError on unknown item", () => {
    expect(() => new MultiBuyDeal("unknown", 3, 2)).toThrow(UnknownSkuError);
  });

  it("should throw InvalidRuleConfigError when buyCount is 1", () => {
    expect(() => new MultiBuyDeal("atv", 1, 1)).toThrow(InvalidRuleConfigError);
  });

  it("should throw InvalidRuleConfigError when payCount >= buyCount", () => {
    expect(() => new MultiBuyDeal("atv", 3, 3)).toThrow(InvalidRuleConfigError);
  });

  it("should throw InvalidRuleConfigError when payCount is 0", () => {
    expect(() => new MultiBuyDeal("atv", 3, 0)).toThrow(InvalidRuleConfigError);
  });
});

describe("MultiBuyDeal", () => {
  const rule = new MultiBuyDeal("atv", 3, 2);

  it("should discount exact group of 3", () => {
    expect(rule.apply(["atv", "atv", "atv"])).toBe(-10950);
  });

  it("should discount one group when buying 4", () => {
    expect(rule.apply(["atv", "atv", "atv", "atv"])).toBe(-10950);
  });

  it("should discount two groups when buying 6", () => {
    expect(rule.apply(["atv", "atv", "atv", "atv", "atv", "atv"])).toBe(-10950 * 2);
  });

  it("no discount below group size", () => {
    expect(rule.apply(["atv", "atv"])).toBe(0);
  });

  it("should ignore other items", () => {
    expect(rule.apply(["vga", "vga", "vga"])).toBe(0);
  });
});

describe("BulkDiscount constructor guards", () => {
  it("should throw UnknownSkuError on unknown item", () => {
    expect(() => new BulkDiscount("unknown", 4, 49999)).toThrow(UnknownSkuError);
  });

  it("should throw InvalidRuleConfigError when threshold is 0", () => {
    expect(() => new BulkDiscount("ipd", 0, 49999)).toThrow(InvalidRuleConfigError);
  });

  it("should throw InvalidRuleConfigError when discountedPrice is negative", () => {
    expect(() => new BulkDiscount("ipd", 4, -1)).toThrow(InvalidRuleConfigError);
  });

  it("should throw InvalidRuleConfigError when discountedPrice >= base price", () => {
    expect(() => new BulkDiscount("ipd", 4, 54999)).toThrow(InvalidRuleConfigError);
  });
});

describe("BulkDiscount", () => {
  const rule = new BulkDiscount("ipd", 4, 49999);

  it("should discount when quantity exceeds threshold", () => {
    expect(rule.apply(["ipd", "ipd", "ipd", "ipd", "ipd"])).toBe(-25000);
  });

  it("no discount at exactly the threshold", () => {
    expect(rule.apply(["ipd", "ipd", "ipd", "ipd"])).toBe(0);
  });

  it("no discount below threshold", () => {
    expect(rule.apply(["ipd", "ipd"])).toBe(0);
  });

  it("should ignore other SKUs", () => {
    expect(rule.apply(["vga", "vga", "vga", "vga", "vga"])).toBe(0);
  });
});

import { MultiBuyDeal, BulkDiscount } from "../rules";
import { CATALOGUE } from "../catalogue";
import { UnknownSkuError, InvalidRuleConfigError } from "../errors";

describe("MultiBuyDeal constructor guards", () => {
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

describe("MultiBuyDeal apply guards", () => {
  it("should throw UnknownSkuError when SKU is not in catalogue", () => {
    const rule = new MultiBuyDeal("atv", 3, 2);
    const emptyCatalogue = {};
    expect(() => rule.apply(["atv", "atv", "atv"], emptyCatalogue)).toThrow(UnknownSkuError);
  });
});

describe("MultiBuyDeal", () => {
  const rule = new MultiBuyDeal("atv", 3, 2);

  it("should discount exact group of 3", () => {
    expect(rule.apply(["atv", "atv", "atv"], CATALOGUE)).toBe(-10950);
  });

  it("should discount one group when buying 4", () => {
    expect(rule.apply(["atv", "atv", "atv", "atv"], CATALOGUE)).toBe(-10950);
  });

  it("should discount two groups when buying 6", () => {
    expect(rule.apply(["atv", "atv", "atv", "atv", "atv", "atv"], CATALOGUE)).toBe(-10950 * 2);
  });

  it("no discount below group size", () => {
    expect(rule.apply(["atv", "atv"], CATALOGUE)).toBe(0);
  });

  it("should ignore other items", () => {
    expect(rule.apply(["vga", "vga", "vga"], CATALOGUE)).toBe(0);
  });
});

describe("BulkDiscount constructor guards", () => {
  it("should throw InvalidRuleConfigError when threshold is 0", () => {
    expect(() => new BulkDiscount("ipd", 0, 49999)).toThrow(InvalidRuleConfigError);
  });

  it("should throw InvalidRuleConfigError when discountedPrice is negative", () => {
    expect(() => new BulkDiscount("ipd", 4, -1)).toThrow(InvalidRuleConfigError);
  });
});

describe("BulkDiscount apply guards", () => {
  it("should throw UnknownSkuError when SKU is not in catalogue", () => {
    const rule = new BulkDiscount("ipd", 4, 49999);
    const emptyCatalogue = {};
    expect(() => rule.apply(["ipd", "ipd", "ipd", "ipd", "ipd"], emptyCatalogue)).toThrow(UnknownSkuError);
  });

  it("should throw InvalidRuleConfigError when discountedPrice >= base price in catalogue", () => {
    const rule = new BulkDiscount("ipd", 4, 49999);
    const cheapCatalogue = { ipd: { sku: "ipd", name: "Super iPad", price: 49999 } };
    expect(() => rule.apply(["ipd", "ipd", "ipd", "ipd", "ipd"], cheapCatalogue)).toThrow(InvalidRuleConfigError);
  });
});

describe("BulkDiscount", () => {
  const rule = new BulkDiscount("ipd", 4, 49999);

  it("should discount when quantity exceeds threshold", () => {
    expect(rule.apply(["ipd", "ipd", "ipd", "ipd", "ipd"], CATALOGUE)).toBe(-25000);
  });

  it("no discount at exactly the threshold", () => {
    expect(rule.apply(["ipd", "ipd", "ipd", "ipd"], CATALOGUE)).toBe(0);
  });

  it("no discount below threshold", () => {
    expect(rule.apply(["ipd", "ipd"], CATALOGUE)).toBe(0);
  });

  it("should ignore other SKUs", () => {
    expect(rule.apply(["vga", "vga", "vga", "vga", "vga"], CATALOGUE)).toBe(0);
  });
});

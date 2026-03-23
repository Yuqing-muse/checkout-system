import { MultiBuyDeal, BulkDiscount } from "../rules";

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

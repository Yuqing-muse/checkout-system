export class UnknownSkuError extends Error {
  constructor(sku: string) {
    super(`Unknown SKU: "${sku}"`);
    this.name = "UnknownSkuError";
  }
}

export class InvalidRuleConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRuleConfigError";
  }
}

export interface PricingRule {
  apply(items: string[]): number;
}

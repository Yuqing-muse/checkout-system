# Checkout System

A TypeScript implementation of a flexible checkout system for Zeller's computer store.

## Assumptions

- Scanning an unknown item throws `UnknownSkuError` (fail-fast rather than silently producing a wrong total)
- Pricing rules are applied in the order they are provided to `Checkout`
- The bulk discount applies when quantity is **strictly greater than** 4
- All prices are stored internally as **integer cents** to avoid floating-point arithmetic errors; `total()` returns a dollar amount (divided by 100)
- Rules are stateless and independent — each `apply()` call receives the full item list

## Features

- Scan items in any order
- Inject pricing rules at construction — no hardcoding
- Inject a custom product catalogue at construction — defaults to the built-in catalogue
- Two built-in rule types: multi-buy deals and bulk discounts
- Open to new rule types in the future — implement `PricingRule` and pass it in
- Prices stored as integer cents to avoid floating-point errors

## Product Catalogue

| SKU | Name        | Price    |
|-----|-------------|----------|
| ipd | Super iPad  | $549.99  |
| mbp | MacBook Pro | $1399.99 |
| atv | Apple TV    | $109.50  |
| vga | VGA adapter | $30.00   |

## Pricing Rules

| Rule             | Description                                                        |
|------------------|--------------------------------------------------------------------|
| `MultiBuyDeal`   | Buy N of a SKU, pay for M (e.g. 3-for-2 on Apple TVs)             |
| `BulkDiscount`   | Buy more than a threshold quantity, get a reduced unit price       |

## Project Structure

```
src/
  models/
    product.ts               — Product interface (price in cents)
  rules/
    PricingRule.ts           — PricingRule interface
    MultiBuyDeal.ts          — N-for-M bundle deal rule
    BulkDiscount.ts          — Bulk threshold discount rule
    index.ts                 — Barrel export
  __tests__/
    rules.test.ts            — Unit tests for pricing rules
    checkout.test.ts         — Integration tests for Checkout
  catalogue.ts               — Product catalogue (4 SKUs)
  checkout.ts                — Checkout class
  index.ts                   — Public entry point
```

## Edge Cases

| Scenario | Behaviour |
|---|---|
| Empty cart | `total()` returns `0` |
| Scan order variation | Total is identical regardless of scan order |
| Exactly at bulk threshold (4 iPads) | Full price applies; discount only kicks in at 5+ |
| Non-multiple quantity for multi-buy (4 Apple TVs) | One group of 3-for-2, one at full price |
| Multiple rules active | All rules applied independently and summed |
| SKU with no matching rule | Charged at base catalogue price |

## Error Handling

Two typed error classes are exported from `src/errors.ts`:

| Error | Thrown when |
|---|---|
| `UnknownSkuError` | `co.scan(item)` is called with a SKU not in the catalogue |
| `InvalidRuleConfigError` | A rule is constructed with invalid parameters |

**`UnknownSkuError`** — thrown by `Checkout.scan()`;

**`InvalidRuleConfigError`** — thrown by rule constructors:

| Rule | Guard |
|---|---|
| `MultiBuyDeal` | Unknown SKU |
| `MultiBuyDeal` | `buyCount <= 1` |
| `MultiBuyDeal` | `payCount <= 0` |
| `MultiBuyDeal` | `payCount >= buyCount` |
| `BulkDiscount` | Unknown SKU |
| `BulkDiscount` | `threshold <= 0` |
| `BulkDiscount` | `discountedPrice < 0` |
| `BulkDiscount` | `discountedPrice >= base price` |


## Test Coverage

**Unit tests** (`rules.test.ts`)
- `MultiBuyDeal`: exact multiple, non-multiple quantity, below threshold, other SKUs unaffected, error handling
- `BulkDiscount`: above threshold, at threshold, below threshold, other SKUs unaffected, error handling

**Integration tests** (`checkout.test.ts`)

## How to Run

**Install dependencies**
```bash
npm install
```

**Run tests**
```bash
npm test
```

**Build**
```bash
npm run build
```

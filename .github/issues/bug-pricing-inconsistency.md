# [BUG] Product Card Pricing Inconsistency

## Bug Description

Product cards show inconsistent pricing between B2B and B2C users, and admin users don't see both price types as intended.

## Platform Affected

- [x] Web
- [x] Mobile

## Steps to Reproduce

1. Log in as a B2B user
2. Navigate to products page
3. Note the pricing displayed
4. Switch to B2C user and compare
5. Log in as admin user
6. Check if both prices are visible

## Expected Behavior

- B2B users should see wholesale pricing with "Wholesale" label
- B2C users should see retail pricing with "Retail" label
- Admin users should see both prices clearly labeled

## Actual Behavior

- Pricing labels sometimes don't appear
- Admin view may not show both prices correctly
- Price formatting inconsistent across platforms

## Root Cause Analysis

- ProductCard component pricing logic needs review
- User type detection may have edge cases
- Price formatting utility functions inconsistent

## Fix Requirements

- [ ] Standardize pricing display logic
- [ ] Ensure admin users see both prices
- [ ] Add proper price formatting utilities
- [ ] Update mobile and web components consistently
- [ ] Add unit tests for pricing logic

## Priority

**Medium**

## Estimated Effort

**Small** (1-2 days)

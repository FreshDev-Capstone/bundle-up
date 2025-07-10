**Title:** [FEATURE] Implement Shopping Cart Functionality

**Labels:** `enhancement`, `web`, `mobile`, `high-priority`

## Feature Description

Implement a complete shopping cart system that allows users to add, remove, and modify product quantities before checkout.

## User Story

As a customer, I want to add products to my cart and manage quantities so that I can review my order before purchasing.

## Platform

- [x] Web
- [x] Mobile
- [x] Backend
- [x] Shared

## Acceptance Criteria

- [ ] Users can add products to cart from product listing
- [ ] Users can view cart with all added items
- [ ] Users can update quantities in cart
- [ ] Users can remove items from cart
- [ ] Cart persists across sessions (for logged-in users)
- [ ] Cart shows real-time pricing (B2B/B2C)
- [ ] Cart calculates totals including tax
- [ ] Cart is accessible from navigation
- [ ] Empty cart state is handled gracefully

## Technical Requirements

- [ ] Create cart database tables (carts, cart_items)
- [ ] Implement cart API endpoints (GET, POST, PUT, DELETE)
- [ ] Create cart context/state management
- [ ] Build cart UI components (CartScreen, CartItem, etc.)
- [ ] Add cart icon with item count to navigation
- [ ] Implement cart persistence for authenticated users
- [ ] Add cart validation and error handling

## Additional Context

Cart should support both B2B and B2C pricing models. For B2B users, consider bulk pricing discounts.

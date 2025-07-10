# [FEATURE] Cart Management API Endpoints

## Feature Description

Implement RESTful API endpoints for cart management including add, remove, update, and retrieve operations.

## User Story

As a frontend developer, I want cart API endpoints so that I can manage user shopping carts.

## Platform

- [x] Backend

## API Endpoints to Implement

```
GET    /api/cart              - Get current user's cart
POST   /api/cart/items        - Add item to cart
PUT    /api/cart/items/:id    - Update cart item quantity
DELETE /api/cart/items/:id    - Remove item from cart
DELETE /api/cart              - Clear entire cart
```

## Technical Requirements

- Authenticate requests with JWT tokens
- Validate product exists and is available
- Handle B2B vs B2C pricing automatically
- Return updated cart totals with each operation
- Implement proper error handling
- Add request validation middleware

## Acceptance Criteria

- [ ] All CRUD operations work correctly
- [ ] Proper authentication and authorization
- [ ] B2B users see wholesale pricing, B2C see retail
- [ ] Cart totals calculated correctly (subtotal, tax, total)
- [ ] Comprehensive error messages
- [ ] API documentation updated
- [ ] Unit tests written and passing

## Priority

**High**

## Estimated Effort

**Medium** (3-5 days)

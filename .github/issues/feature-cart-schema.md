# [FEATURE] Shopping Cart Database Schema

## Feature Description

Create database tables and migrations for persistent shopping cart functionality.

## User Story

As a developer, I want a proper database schema for carts so that user cart data persists across sessions.

## Platform

- [x] Backend
- [x] Database

## Technical Requirements

- Create `carts` table with user relationship
- Create `cart_items` table with product relationship
- Add foreign key constraints
- Include quantity, price snapshot, and timestamps
- Support soft deletes for cart history

## Database Schema

```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status ENUM('active', 'abandoned', 'converted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_snapshot DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Acceptance Criteria

- [ ] Migration files created and tested
- [ ] Foreign key relationships established
- [ ] Indexes added for performance
- [ ] Can handle multiple active carts per user
- [ ] Price snapshot preserves pricing at time of add to cart

## Priority

**High**

## Estimated Effort

**Small** (1-2 days)

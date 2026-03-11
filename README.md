# Bundle Up 🥚

**Bundle Up** is a production-style egg ecommerce platform built on a Turborepo monorepo.

- **SFI** — B2C retail experience (consumers)
- **NFI** — B2B wholesale experience (business customers)
- **Admin** — Back-office management

Powered by [Sunshine Farms](https://www.sunshinefarmsinc.com).

---

## Tech Stack

| Layer              | Technology                     |
| ------------------ | ------------------------------ |
| Monorepo           | Turborepo + npm workspaces     |
| Language           | TypeScript everywhere          |
| Web frontend       | Vite + React + Tailwind CSS    |
| Mobile             | Expo + React Native            |
| State management   | Zustand                        |
| API                | Express                        |
| Database           | PostgreSQL                     |
| Query / migrations | Knex                           |
| Validation         | Zod                            |
| Auth               | JWT (RS/HS256)                 |
| API client         | Shared `@bundle-up/api-client` |

---

## Features

### Web (Vite + React)

- **Three experiences in one app:** SFI (B2C retail), NFI (B2B wholesale), and Admin.
- **Role-based pricing:** retail per-carton pricing for customers and case pricing for business users.
- **Product browsing:** home category entry points, product catalog, and product detail pages.
- **Quick view modal:** open a product from the catalog without leaving the page, including variant selection (by count) where applicable.
- **Cart:** add items, adjust quantities (+/–), and remove items.
- **Checkout:** save/select addresses and place orders from the cart.
- **Orders:** order history and order details.
- **Catalog filters:** search, category, in-stock only, and size filtering.
- **Admin tools:** sign-in, product availability toggles, and order status management.

### Mobile (Expo + React Native)

- **Home + categories:** category shortcuts and quick actions (Cart, Orders, Profile).
- **Product catalog:** browse products (optionally by category) and view product details.
- **Role-aware pricing display:** business users see case pricing; customers see per-carton pricing.
- **Cart + checkout:** update quantities, remove items, save/select delivery addresses, and place orders.
- **Orders:** view order history and order details.
- **Profile:** edit account info, manage saved addresses, change password, and reorder from a previous order.

---

## Repository Structure

```
bundle-up/
├── apps/
│   ├── api/          # Express REST API
│   ├── web/          # Vite + React web app (SFI, NFI, Admin)
│   └── mobile/       # Expo + React Native mobile app
├── packages/
│   ├── shared-types/ # TypeScript interfaces shared across all apps
│   ├── validation/   # Zod schemas (shared between API + clients)
│   ├── api-client/   # Typed API client (fetch-based)
│   ├── utils/        # Shared utility functions
│   ├── ui/           # Shared React component library (web)
│   ├── config-typescript/  # Shared tsconfig bases
│   └── config-eslint/      # Shared ESLint config
├── tsconfig.base.json
├── turbo.json
├── .env.example
└── package.json
```

---

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10
- PostgreSQL >= 14

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

### 3. Create the database

```bash
createdb bundleup_dev
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Seed the database

```bash
npm run db:seed
```

### 6. Start development

```bash
npm run dev
```

This starts:

- API at `http://localhost:3001`
- Web at `http://localhost:3000`
- Mobile (Expo) — run `npm run dev --filter=@bundle-up/mobile`

---

## Available Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start all apps in dev mode          |
| `npm run build`       | Build all apps and packages         |
| `npm run lint`        | Lint all workspaces                 |
| `npm run typecheck`   | TypeScript typecheck all workspaces |
| `npm run test`        | Run all tests                       |
| `npm run db:migrate`  | Run pending database migrations     |
| `npm run db:seed`     | Run seed data                       |
| `npm run db:rollback` | Roll back latest migration          |
| `npm run format`      | Format all files with Prettier      |

---

## API Routes

### Auth (`/api/auth`)

| Method | Route                     | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/auth/login`             | Login (works for all roles) |
| POST   | `/auth/register/customer` | Register B2C account        |
| POST   | `/auth/register/business` | Register B2B account        |
| GET    | `/auth/me`                | Get current user            |

### Products (`/api/products`)

| Method | Route                        | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| GET    | `/products`                  | List products (paginated, filterable) |
| GET    | `/products/:idOrSlug`        | Get product detail                    |
| GET    | `/products/admin/all`        | Admin: all products with inventory    |
| PATCH  | `/products/:id/availability` | Admin: toggle availability            |

### Cart (`/api/cart`)

| Method | Route                 | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| GET    | `/cart`               | ✅   | Get user cart        |
| POST   | `/cart/items`         | ✅   | Add item to cart     |
| PATCH  | `/cart/items/:itemId` | ✅   | Update item quantity |
| DELETE | `/cart/items/:itemId` | ✅   | Remove item          |
| DELETE | `/cart`               | ✅   | Clear cart           |

### Orders (`/api/orders`)

| Method | Route                | Auth  | Description                       |
| ------ | -------------------- | ----- | --------------------------------- |
| GET    | `/orders`            | ✅    | List user orders (admin sees all) |
| GET    | `/orders/:id`        | ✅    | Get order with invoice detail     |
| POST   | `/orders`            | ✅    | Create order from cart            |
| PATCH  | `/orders/:id/status` | Admin | Update order status               |

### Addresses (`/api/addresses`)

| Method | Route            | Auth |
| ------ | ---------------- | ---- |
| GET    | `/addresses`     | ✅   |
| POST   | `/addresses`     | ✅   |
| PUT    | `/addresses/:id` | ✅   |
| DELETE | `/addresses/:id` | ✅   |

---

## Web Routes

### SFI (B2C — `/`)

| Route             | Page                             |
| ----------------- | -------------------------------- |
| `/`               | Home                             |
| `/products`       | Product catalog (retail pricing) |
| `/products/:slug` | Product detail                   |
| `/login`          | Sign in                          |
| `/register`       | Create account                   |
| `/cart`           | Cart                             |
| `/orders`         | Order history                    |

### NFI (B2B — `/nfi`)

| Route                 | Page                             |
| --------------------- | -------------------------------- |
| `/nfi`                | B2B Home                         |
| `/nfi/products`       | Wholesale catalog (case pricing) |
| `/nfi/products/:slug` | Product detail                   |
| `/nfi/login`          | Business sign in                 |
| `/nfi/register`       | Apply for business account       |
| `/nfi/cart`           | Cart                             |
| `/nfi/orders`         | Order history                    |

### Admin (`/admin`)

| Route             | Page               |
| ----------------- | ------------------ |
| `/admin`          | Dashboard          |
| `/admin/products` | Product management |
| `/admin/orders`   | Order management   |
| `/admin/login`    | Admin sign in      |

---

## Auth & RBAC

**Login is not artificially restricted by entry point.**

A business customer can sign in at `/login` (SFI) and will be routed to `/nfi`.
A consumer can sign in at `/nfi/login` (NFI) and will be routed to `/`.
Admin users are routed to `/admin` regardless of entry point.

**Roles:** `customer` | `business` | `admin`

**Pricing by role:**

- `customer` → `b2c_unit_price` (retail per carton)
- `business` → `b2b_case_price` (wholesale per case)

---

## Database Schema

```
users
  id, email, password_hash, role, is_active, created_at, updated_at

user_profiles
  id, user_id → users, first_name, last_name, phone, created_at, updated_at

business_accounts
  id, user_id → users, company_name, tax_id, billing_email, is_approved, created_at, updated_at

addresses
  id, user_id → users, label, street_line1, street_line2, city, state, zip, country, is_default, created_at, updated_at

categories
  id, name, slug, description, sort_order, is_active, created_at, updated_at

products
  id, sku, legacy_product_id, name, slug, description, category_id → categories,
  product_type, product_color, product_count, product_size, farming_method,
  packaging_unit, case_pack,
  b2c_unit_price (retail per carton),
  b2b_case_price (wholesale per case),
  primary_image, is_available, is_active, created_at, updated_at

inventory
  id, product_id → products, inventory_by_carton, inventory_by_case, updated_at

carts
  id, user_id → users (nullable), session_id (nullable), created_at, updated_at

cart_items
  id, cart_id → carts, product_id → products, quantity, unit_price, created_at, updated_at

orders
  id, user_id → users, order_number, status, payment_status, subtotal, tax, shipping, total,
  shipping_address_id → addresses, billing_address_id → addresses, notes, created_at, updated_at

order_items
  id, order_id → orders, product_id → products, quantity, unit_price, line_total, created_at
```

---

## Product Seed Notes

The product catalog seed (`apps/api/src/seeds/data/productCatalog.ts`) preserves the exact assortment and pricing from the original dataset. Unusual pricing combinations are flagged with `⚠️ REVIEW` comments in the source.

Known flags:

- Product 103 (White Large 12ct): priced **higher** than Product 102 (White Extra Large 12ct) — preserved
- Product 104 (White Medium 12ct): priced higher than Large — preserved
- Product 106 (White Large 6ct): 6-count priced higher than 18-count and 30-count — preserved

---

## Environment Variables

See `.env.example` for a full reference. Key variables:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/bundleup_dev
JWT_SECRET=your-secret-here
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

---

## Adding Cloud Storage for Images

All image paths are currently local static assets. To swap for cloud storage (e.g., S3, Cloudflare R2):

1. Update `apps/api/src/seeds/data/imageMap.ts` — replace local paths with CDN URLs
2. Re-run seeds: `npm run db:seed`
3. The rest of the system automatically picks up the new paths

---

## Seed Credentials (Development Only)

| Role     | Email                   | Password      |
| -------- | ----------------------- | ------------- |
| Admin    | `admin@bundleup.com`    | `password123` |
| Customer | `customer@example.com`  | `password123` |
| Business | `buyer@freshmarket.com` | `password123` |

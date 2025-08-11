# Development Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Expo CLI (for mobile development)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install

# Install web dependencies
cd ../web
npm install
```

### 2. Database Setup

```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# PG_HOST=localhost
# PG_PORT=5432
# PG_DB=bundleup
# PG_USER=postgres
# PG_PASS=your_password

# Run database setup
node setup-db.js

# Or run migrations
npm run migrate
npm run seed
```

### 3. Start Development Servers

#### Backend (API Server)

```bash
cd backend
npm run dev
# Server runs on http://localhost:3001
```

#### Mobile App

```bash
cd mobile
npm start
# Opens Expo DevTools
# Scan QR code with Expo Go app
```

#### Web App

```bash
cd web
npm run dev
# Runs on http://localhost:5173
```

## Testing the Checkout Functionality

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

### 2. Start the Mobile App

```bash
cd mobile
npm start
```

### 3. Test the Checkout Flow

1. **Add items to cart**: Browse products and add items to your cart
2. **Go to cart**: Navigate to the cart tab
3. **Checkout**: Press the "Proceed to Checkout" button
4. **Verify order creation**: The order should be created in the database
5. **Check reorder page**: Navigate to the reorder tab to see cart items
6. **View order history**: Go to profile tab to see the order in recent orders

### 4. Database Verification

```bash
# Connect to your PostgreSQL database
psql -U postgres -d bundleup

# Check orders table
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;

# Check order_items table
SELECT oi.*, p.name as product_name
FROM order_items oi
JOIN products p ON oi.product_id = p.id
ORDER BY oi.created_at DESC LIMIT 10;
```

## API Endpoints

### Orders

- `GET /api/orders` - Get all orders for authenticated user
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details by ID
- `GET /api/orders/history` - Get user's order history

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your `.env` file has correct database credentials
- Verify the database `bundleup` exists

### Mobile App Issues

- Make sure Expo Go app is installed on your device
- Check that your device and computer are on the same network
- Update the API_BASE_URL in `mobile/config/apiConfig.ts` to match your backend URL

### API Issues

- Check that the backend server is running on port 3001
- Verify CORS settings in backend
- Check authentication tokens are being sent correctly

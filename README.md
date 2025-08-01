# Bundle Up - Fresh Groceries Delivered

A cross-platform grocery delivery application built with React Native (Expo) for mobile and React (Vite) for web, sharing a common backend API.

## 🏗️ Project Structure

```
bundle-up/
├── shared/                          # Shared code between web and mobile
│   ├── components/                  # Shared React components
│   │   └── ProductCard/            # Reusable product card component
│   ├── hooks/                       # Shared custom hooks
│   │   └── useAuth.ts              # Authentication hook
│   ├── services/                    # API services
│   │   └── api.ts                  # HTTP client and API calls
│   ├── utils/                       # Shared utilities
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                # Common interfaces and types
│   └── constants/                   # Shared constants
│       └── index.ts                # API URLs, routes, colors, etc.
├── mobile/                          # React Native app (Expo)
│   ├── components/                  # Mobile-specific components
│   ├── pages/                       # Mobile screens
│   ├── navigation/                  # Mobile navigation
│   ├── assets/                      # Mobile assets
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── web/                             # Web app (React + Vite)
│   ├── src/                         # React source code
│   ├── public/                      # Web assets
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
└── backend/                         # Express.js API server
    ├── src/
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (for mobile development)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ibra-Hud/bundle-up.git
   cd bundle-up
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp web/.env.example web/.env
   cp mobile/.env.example mobile/.env
   ```

### Development

#### Start Backend Server
```bash
npm run dev:backend
```
The API server will run on `http://localhost:3001`

#### Start Mobile App (React Native/Expo)
```bash
npm run dev:mobile
```
This will start the Expo development server. You can:
- Press `w` to open in web browser
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan QR code with Expo Go app on your phone

#### Start Web App (React + Vite)
```bash
npm run dev:web
```
The web app will run on `http://localhost:3000`

## 📱 Mobile App (React Native/Expo)

The mobile app is built with:
- **React Native** with **Expo** for cross-platform development
- **React Navigation** for navigation
- **AsyncStorage** for local data persistence
- **TypeScript** for type safety
- **StyleSheet** for styling

### Key Features
- Product browsing and search
- Shopping cart management
- User authentication
- Order tracking
- Push notifications (planned)

## 🌐 Web App (React + Vite)

The web app is built with:
- **React 18** with hooks
- **Vite** for fast development and building
- **TypeScript** for type safety
- **CSS** for styling (no CSS-in-JS)

### Key Features
- Responsive design
- Fast development with Vite
- SEO optimization
- Progressive Web App (PWA) capabilities

## 🔧 Backend API

The backend is built with:
- **Express.js** with TypeScript
- **PostgreSQL** database with Knex.js ORM
- **JWT** authentication
- **Passport.js** for OAuth (Google)
- **CORS** enabled for cross-origin requests

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

#### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

#### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 🔄 Shared Code

The `shared/` directory contains code that can be used by both web and mobile apps:

### Components
- **ProductCard**: Reusable product display component
- **Navigation**: Common navigation patterns
- **Forms**: Shared form components

### Hooks
- **useAuth**: Authentication state management
- **useCart**: Shopping cart management
- **useProducts**: Product data fetching

### Services
- **api.ts**: HTTP client with all API endpoints
- **storage.ts**: Platform-agnostic storage utilities

### Types
- **User**: User interface
- **Product**: Product interface
- **Cart**: Shopping cart interfaces
- **Order**: Order interfaces

## 🎨 Styling Strategy

### Mobile (React Native)
- Uses React Native's **StyleSheet** API
- Platform-specific styling when needed
- Responsive design with Dimensions API

### Web (React + Vite)
- Uses **CSS** files for styling
- CSS classes for component styling
- Responsive design with CSS Grid and Flexbox

### Shared Design System
- Common color palette in `shared/constants/colors.ts`
- Typography scale
- Spacing system
- Component variants

## 📦 Build & Deployment

### Mobile App
```bash
# Build for Android
npm run build:mobile -- --platform android

# Build for iOS
npm run build:mobile -- --platform ios

# Build for web
npm run build:mobile -- --platform web
```

### Web App
```bash
# Build for production
npm run build:web

# Preview production build
npm run preview:web
```

### Backend
```bash
# Build TypeScript
npm run build:backend

# Start production server
npm run start:backend
```

## 🧪 Testing

```bash
# Run mobile tests
npm test --prefix mobile

# Run web tests
npm test --prefix web

# Run backend tests
npm test --prefix backend
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you have any questions or need help, please:
1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/Ibra-Hud/bundle-up/issues)
3. Create a new issue with a detailed description

## 🚀 Roadmap

- [ ] Push notifications
- [ ] Offline support
- [ ] Payment integration
- [ ] Real-time order tracking
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Accessibility improvements

# Cross-Platform Grocery Delivery App - Folder Structure Guide

## Project Root Structure

```
bundle-up/
├── web/                    # Vite React web app
├── mobile/                 # Expo React Native app
├── shared/                 # Shared code and assets
├── backend/                # Node.js/Express API
├── docs/                   # Documentation
└── README.md
```

## 1. Web Folder Structure (Vite + React)

### Current Vite Structure + Additions:

```
web/
├── public/
│   ├── favicon.ico
│   ├── logos/
│   │   ├── sunshine-farm.png
│   │   ├── natural-foods-inc.png
│   │   └── app-icon.png
│   └── manifest.json
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── Layout/
│   │   ├── auth/           # Authentication components
│   │   │   ├── LoginForm/
│   │   │   ├── SignupForm/
│   │   │   └── AccountTypeSelector/
│   │   ├── product/        # Product-related components
│   │   │   ├── ProductCard/
│   │   │   ├── ProductList/
│   │   │   └── ProductDetails/
│   │   └── branding/       # Brand-specific components
│   │       ├── BrandedHeader/
│   │       ├── BrandedSplash/
│   │       └── ThemeProvider/
│   ├── pages/              # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   └── profile/
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useBranding.js
│   │   └── useApi.js
│   ├── context/            # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── BrandContext.jsx
│   │   └── CartContext.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── products.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validation.js
│   ├── styles/             # Styling files
│   │   ├── globals.css
│   │   ├── themes/
│   │   │   ├── sunshine-farm.css
│   │   │   └── natural-foods.css
│   │   └── components/
│   ├── assets/             # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts
├── package.json
├── vite.config.js
└── index.html
```

### Key Files in Web Folders:

- **components/**: Reusable React components organized by feature
- **pages/**: Full page components that use multiple components
- **hooks/**: Custom hooks for state management and business logic
- **context/**: React context providers for global state
- **services/**: API integration and external service calls
- **utils/**: Helper functions, constants, and validation logic
- **styles/themes/**: Brand-specific CSS variables and styling

## 2. Mobile Folder Structure (Expo + React Native)

### Current Expo Structure + Additions:

```
mobile/
├── assets/
│   ├── images/
│   │   ├── splash-sunshine-farm.png
│   │   ├── splash-natural-foods.png
│   │   └── app-icon.png
│   ├── icons/
│   └── fonts/
├── components/             # Reusable RN components
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── SafeAreaWrapper/
│   ├── auth/
│   │   ├── LoginForm/
│   │   ├── SignupForm/
│   │   ├── AccountTypeSelector/
│   │   └── OAuth/
│   │       └── GoogleSignInButton.tsx
│   ├── product/
│   │   ├── ProductCard/
│   │   ├── ProductList/
│   │   └── ProductDetails/
│   └── branding/
│       ├── BrandedHeader/
│       ├── BrandedSplash/
│       └── BrandedStatusBar/
├── pages/                  # Screen components
│   ├── Authentication/
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── AccountTypeSelection.tsx
│   │   ├── B2BSignUp.tsx
│   │   ├── B2CSignUp.tsx
│   │   ├── B2BSplash.tsx
│   │   └── B2CSplash.tsx
│   ├── Home/
│   │   └── HomePage.tsx
│   ├── Cart/
│   │   └── CartPage.tsx
│   ├── Profile/
│   │   └── ProfilePage.tsx
│   └── Reorder/
│       └── ReorderPage.tsx
├── navigation/             # Navigation configuration
│   ├── Stack/
│   │   ├── Stack.tsx
│   │   └── Stack.styles.ts
│   └── Tab/
│       ├── Tab.tsx
│       └── Tab.styles.ts
├── hooks/                  # Custom hooks
│   └── useAuth.ts
├── context/                # React contexts
│   ├── AuthContext.jsx
│   ├── BrandContext.jsx
│   └── CartContext.jsx
├── services/               # API services
│   └── api.ts
├── utils/                  # Utility functions
│   ├── toast.ts
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
├── styles/                 # Styling
│   ├── globalStyles.js
│   ├── themes/
│   │   ├── sunshineFarm.js
│   │   └── naturalFoods.js
│   └── colors.js
├── app.json
├── package.json
├── metro.config.js
├── babel.config.js
└── .env                    # Environment variables for OAuth
```

### Key Files in Mobile Folders:

- **pages/**: Full screen components for React Navigation
- **navigation/**: Navigation stack and tab configurations
- **components/**: Reusable React Native components
- **styles/**: StyleSheet objects and theme configurations
- **assets/**: Images, icons, fonts specific to mobile
- **.env**: Environment variables for Google OAuth client IDs

## 3. Shared Folder Structure

```
shared/
├── types/                  # TypeScript types/interfaces
│   ├── auth.ts
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
├── constants/              # Shared constants
│   ├── api.js
│   ├── branding.js
│   ├── routes.js
│   └── validation.js
├── utils/                  # Shared utility functions
│   ├── formatters.js       # Date, currency, text formatters
│   ├── validators.js       # Input validation functions
│   ├── calculations.js     # Business logic calculations
│   └── storage.js          # Local storage helpers
├── api/                    # API configuration and schemas
│   ├── client.js           # HTTP client configuration
│   ├── endpoints.js        # API endpoint definitions
│   └── schemas/            # API response schemas
│       ├── auth.js
│       ├── products.js
│       └── orders.js
├── config/                 # Environment and app configuration
│   ├── brands.js           # Brand configuration
│   ├── features.js         # Feature flags
│   └── environments.js     # Environment variables
└── assets/                 # Shared assets
    ├── icons/              # SVG icons that work on both platforms
    └── data/               # Static data files (JSON)
```

### Key Files in Shared Folders:

- **types/**: TypeScript definitions used across platforms
- **constants/**: Hard-coded values, API URLs, brand configurations
- **utils/**: Pure functions that work on both web and mobile
- **api/**: HTTP client setup and API endpoint definitions
- **config/**: Environment-specific and brand-specific configurations

## 4. Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── jwt.ts
│   ├── controllers/
│   │   ├── authControllers.ts
│   │   └── productControllers.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   └── logging.ts
│   ├── models/
│   │   ├── Cart.ts
│   │   ├── CartItem.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── sessions.ts
│   │   └── users.ts
│   ├── services/
│   │   └── authService.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── index.ts
│   │   ├── responseHelpers.ts
│   │   ├── validation.ts
│   │   └── validationHelpers.ts
│   └── server.ts
├── db/
│   ├── knex.ts
│   ├── knexfile.ts
│   ├── migrations/
│   │   ├── 001_create_users_table.ts
│   │   └── 002_create_products_table.ts
│   └── seeds/
│       └── 001_products.ts
├── package.json
└── tsconfig.json
```

## 5. B2B vs B2C User Experience Strategy

### Recommended Approach: Unified App with Brand Context

#### Brand Detection Strategy:

1. **URL/Deep Link Based (Web)**:

   - `app.sunshinefarm.com` → B2C experience
   - `business.sunshinefarm.com` → B2B experience

2. **Account Type Selection (Mobile)**:
   - Single app with account type selection during onboarding
   - Brand context stored in user profile

#### Visual Distinction Methods:

**1. Color Schemes & Theming:**

```javascript
// shared/config/brands.js
export const BRANDS = {
  SUNSHINE_FARM: {
    id: "sunshine_farm",
    name: "Sunshine Farm",
    type: "B2C",
    colors: {
      primary: "#FFD700", // Warm yellow
      secondary: "#FF8C00", // Orange
      background: "#FFF8DC", // Cream
    },
    logo: "sunshine-farm-logo.png",
  },
  NATURAL_FOODS: {
    id: "natural_foods",
    name: "Natural Foods Inc",
    type: "B2B",
    colors: {
      primary: "#2E8B57", // Professional green
      secondary: "#4682B4", // Steel blue
      background: "#F5F5F5", // Light gray
    },
    logo: "natural-foods-logo.png",
  },
};
```

**2. Navigation Differences:**

- **B2C**: Home, Products, Cart, Orders, Profile
- **B2B**: Dashboard, Catalog, Bulk Orders, Analytics, Account Management

**3. Header Indicators:**

- Different logos in header
- Small badge/tag indicating account type
- Different navigation menu items

**4. Splash Screen Logic:**

```javascript
// components/branding/BrandedSplash/index.jsx
const BrandedSplash = ({ accountType, onComplete }) => {
  const brand =
    accountType === "business" ? BRANDS.NATURAL_FOODS : BRANDS.SUNSHINE_FARM;

  return (
    <SplashContainer backgroundColor={brand.colors.background}>
      <Logo source={brand.logo} />
      <BrandName color={brand.colors.primary}>{brand.name}</BrandName>
    </SplashContainer>
  );
};
```

## 6. Authentication Setup

### Google OAuth Configuration

**Environment Variables (.env):**

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.apps.googleusercontent.com
```

**Google Cloud Console Setup:**

1. Create OAuth 2.0 credentials for Web, Android, and iOS
2. Add redirect URIs:
   - Web: `https://auth.expo.io/@your-username/your-app-slug`
   - Android: Use package name from `app.json`
   - iOS: Use bundle identifier from `app.json`
3. Add SHA-1 fingerprint for Android (use Expo's debug key for development)

**Component Location:**

```
mobile/components/auth/OAuth/GoogleSignInButton.tsx
```

## 7. Setup Instructions

### Step 1: Create the folder structure

```bash
# From project root
mkdir -p shared/{types,constants,utils,api,config,assets/{icons,data}}
mkdir -p shared/api/schemas
mkdir -p docs

# Web additions (from web/ directory)
cd web/src
mkdir -p components/{common,auth,product,branding}
mkdir -p pages/{auth,dashboard,products,orders,profile}
mkdir -p {hooks,context,services,utils,styles/themes,assets/{images,icons,fonts}}

# Mobile additions (from mobile/ directory)
cd ../../mobile
mkdir -p components/{common,auth,product,branding}
mkdir -p pages/{auth,dashboard,products,orders,profile}
mkdir -p {navigation,hooks,context,services,utils,styles/themes}
```

### Step 2: Set up shared configurations

1. Create brand configuration in `shared/config/brands.js`
2. Set up API client in `shared/api/client.js`
3. Define shared constants in `shared/constants/`

### Step 3: Implement brand context

1. Create `BrandContext` in both web and mobile
2. Implement brand detection logic
3. Create branded components (Header, Splash, etc.)

### Step 4: Set up component architecture

1. Create base components in `components/common/`
2. Extend base components for brand-specific needs
3. Implement proper prop interfaces for reusability

### Step 5: Configure build systems

1. Update import paths in both projects to include shared folder
2. Set up symlinks or workspace configuration
3. Configure bundlers to handle shared dependencies

### Step 6: Set up authentication

1. Install required packages: `expo-auth-session expo-random`
2. Configure Google OAuth in Google Cloud Console
3. Add client IDs to `.env` file
4. Test authentication flow

## 8. Key Benefits of This Structure

- **Reusability**: Components and logic shared across platforms
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new brands or features
- **Consistency**: Shared business logic ensures consistent behavior
- **Developer Experience**: Clear folder structure makes navigation easy
- **Security**: Environment variables for sensitive configuration
- **Authentication**: OAuth integration for seamless user experience

## 9. Development Workflow

### For New Features:

1. Define types in `shared/types/`
2. Create components in platform-specific `components/` folders
3. Implement business logic in `shared/utils/`
4. Add API endpoints in `backend/`
5. Test across both platforms

### For Brand-Specific Changes:

1. Update `shared/config/brands.js`
2. Modify themed components
3. Update assets and styling
4. Test with different brand contexts

## 10. Next Steps

1. ✅ Set up the folder structure
2. ✅ Configure Google OAuth authentication
3. 🔄 Configure your build tools for shared imports
4. 🔄 Implement the brand context system
5. 🔄 Create your base components
6. 🔄 Test the branding system across both platforms
7. 🔄 Implement account type selection flow
8. 🔄 Add product catalog and cart functionality
9. 🔄 Implement order management system
10. 🔄 Add analytics and reporting for B2B users

## 11. Troubleshooting

### Common Issues:

- **Import errors**: Check shared folder configuration
- **OAuth errors**: Verify client IDs and redirect URIs
- **Styling issues**: Ensure theme context is properly set up
- **Navigation errors**: Check screen registration and stack configuration

### Environment Setup:

- Ensure all required packages are installed
- Verify environment variables are loaded correctly
- Check that Google Cloud Console is properly configured
- Test authentication flow in both development and production modes

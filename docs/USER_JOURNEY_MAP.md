# User Journey Map: B2C vs B2B Account Creation

## Overview
This document outlines the user journey for distinguishing between B2C (Business-to-Consumer) and B2B (Business-to-Business) account creation in the Bundle Up application. The system uses different branding, splash screens, and user experiences to clearly differentiate between individual consumers and business customers.

## User Journey Flow

### Phase 1: Initial App Launch & Account Type Selection

**Entry Point**: App Launch
- **Screen**: AccountTypeSelection
- **Purpose**: Allow users to choose their account type
- **Key Features**:
  - Clear visual distinction between B2C and B2B options
  - Feature comparison cards
  - Brand association (Sunshine Farms for B2C, Natural Foods Inc for B2B)

**User Decision Points**:
1. **Individual Consumer (B2C)**
   - Personal account management
   - Individual orders
   - Consumer pricing
   - Personal delivery
   - **Brand**: Sunshine Farms

2. **Business Customer (B2B)**
   - Business account management
   - Bulk ordering capabilities
   - Business pricing
   - Dedicated support
   - **Brand**: Natural Foods Inc

### Phase 2: Branded Splash Screens

#### B2C Splash Screen (Sunshine Farms)
- **Visual Design**: Warm orange gradient (#f39c12, #e67e22, #d35400)
- **Branding**: Sunshine Farms logo prominently displayed
- **Messaging**: 
  - "Welcome to Sunshine Farms"
  - "Fresh, organic products delivered to your doorstep"
  - Consumer-focused benefits and features
- **Features Highlighted**:
  - Fresh Farm Eggs 🥚
  - Organic Dairy 🥛
  - Fast Delivery 🚚

#### B2B Splash Screen (Natural Foods Inc)
- **Visual Design**: Professional blue-gray gradient (#2c3e50, #34495e, #1a252f)
- **Branding**: Natural Foods Inc logo prominently displayed
- **Messaging**:
  - "Natural Foods Inc"
  - "Professional food distribution solutions for businesses"
  - Business-focused benefits and features
- **Features Highlighted**:
  - Business Solutions 🏢
  - Bulk Orders 📦
  - Dedicated Support 🎯

### Phase 3: Registration Process

#### B2C Registration (Sunshine Farms)
**Form Fields**:
- First Name
- Last Name
- Email Address
- Password
- Confirm Password

**User Experience**:
- Warm, friendly color scheme
- Consumer-focused messaging
- Simple, streamlined form
- Google OAuth integration
- Terms of Service for consumers

#### B2B Registration (Natural Foods Inc)
**Form Fields**:
- Company Name
- Contact First Name
- Contact Last Name
- Business Email
- Phone Number
- Business Type
- Password
- Confirm Password

**User Experience**:
- Professional, business-focused design
- Additional business-specific fields
- Benefits information box
- Business terms and conditions
- Application review process notification

### Phase 4: Post-Registration Experience

#### B2C User Experience
- **Home Screen**: Sunshine Farms branded interface
- **Features**: Personal shopping cart, individual orders, consumer pricing
- **Support**: General customer support
- **Pricing**: Retail pricing structure

#### B2B User Experience
- **Home Screen**: Natural Foods Inc branded interface
- **Features**: Business dashboard, bulk ordering, wholesale pricing
- **Support**: Dedicated business support
- **Pricing**: Wholesale pricing structure

## Technical Implementation

### Navigation Structure
```
App.tsx
└── StackNavigator
    ├── AccountTypeSelection (Initial Route)
    ├── B2C Flow
    │   ├── B2CSplash
    │   ├── B2CSignUp
    │   ├── B2CLogin
    │   └── B2CHome
    └── B2B Flow
        ├── B2BSplash
        ├── B2BSignUp
        ├── B2BLogin
        └── B2BHome
```

### Key Components Created
1. **AccountTypeSelection.tsx** - Initial account type selection screen
2. **B2CSplash.tsx** - Sunshine Farms branded splash screen
3. **B2BSplash.tsx** - Natural Foods Inc branded splash screen
4. **B2CSignUp.tsx** - Consumer registration form
5. **B2BSignUp.tsx** - Business registration form
6. **Stack.tsx** - Navigation configuration

### Design System

#### B2C (Sunshine Farms) Color Palette
- Primary: #f39c12 (Orange)
- Secondary: #e67e22 (Dark Orange)
- Accent: #d35400 (Deep Orange)
- Text: #fff (White)
- Background: Warm gradient

#### B2B (Natural Foods Inc) Color Palette
- Primary: #2c3e50 (Dark Blue-Gray)
- Secondary: #34495e (Medium Blue-Gray)
- Accent: #3498db (Blue)
- Text: #fff (White)
- Background: Professional gradient

## User Benefits

### For B2C Users
- Clear consumer-focused experience
- Simplified registration process
- Personal shopping features
- Warm, welcoming design
- Sunshine Farms brand association

### For B2B Users
- Professional business interface
- Comprehensive business information collection
- Bulk ordering capabilities
- Dedicated business support
- Natural Foods Inc brand association

## Business Benefits

### Brand Differentiation
- Clear separation between consumer and business offerings
- Distinct visual identities for each brand
- Targeted messaging for different user types

### User Experience
- Appropriate complexity for each user type
- Relevant features and pricing for each segment
- Clear value proposition for each account type

### Operational Efficiency
- Streamlined onboarding for each user type
- Appropriate data collection for business needs
- Clear routing to appropriate support channels

## Future Enhancements

### Potential Improvements
1. **Email Domain Detection**: Automatically suggest B2B for business email domains
2. **Progressive Profiling**: Collect additional business information over time
3. **Role-Based Features**: Different feature sets based on business type
4. **Analytics Integration**: Track user journey completion rates
5. **A/B Testing**: Test different messaging and design variations

### Additional Features
1. **Business Verification**: Document upload for business verification
2. **Credit Application**: Integrated credit application for B2B customers
3. **Onboarding Tours**: Guided tours for new users
4. **Multi-language Support**: International business expansion
5. **Mobile App Features**: Push notifications and mobile-specific features

## Conclusion

This user journey map provides a comprehensive framework for distinguishing between B2C and B2B account creation. The implementation uses different branding, visual design, and user experiences to create clear differentiation while maintaining a cohesive overall application experience. The system is designed to be scalable and can accommodate future enhancements as the business grows. 
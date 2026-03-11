import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

// SFI pages
import { HomePage } from './pages/sfi/HomePage';
import { ProductsPage } from './pages/sfi/ProductsPage';
import { ProductDetailPage } from './pages/sfi/ProductDetailPage';
import { LoginPage } from './pages/sfi/LoginPage';
import { RegisterPage } from './pages/sfi/RegisterPage';
import { CartPage } from './pages/sfi/CartPage';
import { OrdersPage } from './pages/sfi/OrdersPage';
import { ProfilePage } from './pages/sfi/ProfilePage';
import { CheckoutPage } from './pages/sfi/CheckoutPage';
import { OrderDetailPage } from './pages/sfi/OrderDetailPage';

// NFI pages
import { NfiHomePage } from './pages/nfi/NfiHomePage';
import { NfiLoginPage } from './pages/nfi/NfiLoginPage';
import { NfiRegisterPage } from './pages/nfi/NfiRegisterPage';
import { NfiProductsPage } from './pages/nfi/NfiProductsPage';

// Admin pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── SFI (B2C) ─────────────────────────────────────────────────── */}
        <Route element={<Layout variant="sfi" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />

          {/* Protected SFI routes */}
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/cart" element={<CartPage variant="sfi" />} />
            <Route path="/checkout" element={<CheckoutPage variant="sfi" />} />
            <Route path="/orders" element={<OrdersPage variant="sfi" />} />
            <Route path="/orders/:id" element={<OrderDetailPage variant="sfi" />} />
            <Route path="/profile" element={<ProfilePage variant="sfi" />} />
          </Route>
        </Route>

        {/* ─── NFI (B2B) ─────────────────────────────────────────────────── */}
        <Route path="/nfi" element={<Layout variant="nfi" />}>
          <Route index element={<NfiHomePage />} />
          <Route path="login" element={<NfiLoginPage />} />
          <Route path="register" element={<NfiRegisterPage />} />
          <Route path="products" element={<NfiProductsPage />} />
          <Route path="products/:slug" element={<ProductDetailPage />} />

          {/* Protected NFI routes */}
          <Route element={<ProtectedRoute redirectTo="/nfi/login" />}>
            <Route path="cart" element={<CartPage variant="nfi" />} />
            <Route path="checkout" element={<CheckoutPage variant="nfi" />} />
            <Route path="orders" element={<OrdersPage variant="nfi" />} />
            <Route path="orders/:id" element={<OrderDetailPage variant="nfi" />} />
            <Route path="profile" element={<ProfilePage variant="nfi" />} />
          </Route>
        </Route>

        {/* ─── Admin ────────────────────────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={<ProtectedRoute requiredRole="admin" redirectTo="/admin/login" />}
        >
          <Route element={<Layout variant="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

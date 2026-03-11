import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '@bundle-up/shared-types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

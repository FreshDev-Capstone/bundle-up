import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '@bundle-up/shared-types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({ requiredRole, redirectTo = '/login' }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

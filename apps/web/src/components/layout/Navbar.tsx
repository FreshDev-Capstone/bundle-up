import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore, useCartItemCount } from '../../stores/cartStore';

interface NavbarProps {
  variant?: 'sfi' | 'nfi' | 'admin';
}

export function Navbar({ variant = 'sfi' }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const { cart, resetCart } = useCartStore();
  const navigate = useNavigate();
  const itemCount = useCartItemCount(cart);

  const isSfi = variant === 'sfi';
  const isNfi = variant === 'nfi';
  const isAdmin = variant === 'admin';

  const homeHref = isAdmin ? '/admin' : isNfi ? '/nfi' : '/';

  React.useEffect(() => {
    if (!user) {
      resetCart();
    }
  }, [user, resetCart]);

  function handleLogout() {
    logout();
    resetCart();
    navigate(isAdmin ? '/admin/login' : isNfi ? '/nfi/login' : '/login');
  }

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={homeHref} className="flex items-center gap-2">
          <span className="text-2xl">🥚</span>
          <span className="text-lg font-bold text-green-700">Bundle Up</span>
          {isNfi && (
            <span className="ml-1 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              Business
            </span>
          )}
          {isAdmin && (
            <span className="ml-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
              Admin
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-4">
          {!isAdmin && (
            <Link
              to={isSfi ? '/products' : '/nfi/products'}
              className="text-sm text-gray-600 hover:text-green-700"
            >
              Products
            </Link>
          )}

          {user ? (
            <>
              {!isAdmin && (
                <Link
                  to={isSfi ? '/orders' : '/nfi/orders'}
                  className="text-sm text-gray-600 hover:text-green-700"
                >
                  Orders
                </Link>
              )}
              {!isAdmin && (
                <Link
                  to={isSfi ? '/profile' : '/nfi/profile'}
                  className="text-sm text-gray-600 hover:text-green-700"
                >
                  Profile
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/products"
                    className="text-sm text-gray-600 hover:text-purple-700"
                  >
                    Products
                  </Link>
                  <Link to="/admin/orders" className="text-sm text-gray-600 hover:text-purple-700">
                    Orders
                  </Link>
                  <Link to="/admin/users" className="text-sm text-gray-600 hover:text-purple-700">
                    Users
                  </Link>
                </>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600">
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to={isAdmin ? '/admin/login' : isNfi ? '/nfi/login' : '/login'}
              className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
            >
              Sign In
            </Link>
          )}

          {(isSfi || isNfi) && (
            <Link
              to={isSfi ? '/cart' : '/nfi/cart'}
              className="relative flex items-center gap-1 text-sm text-gray-600 hover:text-green-700"
            >
              🛒
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

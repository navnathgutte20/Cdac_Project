import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../hooks/useAuth'

// Layouts
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import AdminLayout from '../layouts/AdminLayout'
import DealerLayout from '../layouts/DealerLayout'
import RELayout from '../layouts/RELayout'

// Auth pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'

// Customer pages
import Home from '../pages/customer/Home'
import Products from '../pages/customer/Products'
import ProductDetails from '../pages/customer/ProductDetails'
import Cart from '../pages/customer/Cart'
import Checkout from '../pages/customer/Checkout'
import Orders from '../pages/customer/Orders'
import Invoice from '../pages/customer/Invoice'
import Profile from '../pages/customer/Profile'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminCustomers from '../pages/admin/Customers'
import AdminProducts from '../pages/admin/Products'
import AdminDealers from '../pages/admin/Dealers'
import AdminOrders from '../pages/admin/Orders'

// Dealer pages
import DealerDashboard from '../pages/dealer/Dashboard'
import DealerProducts from '../pages/dealer/Products'
import DealerShipments from '../pages/dealer/Shipments'
import DealerInventory from '../pages/dealer/Inventory'

// RE pages
import REAssignedCustomers from '../pages/re/AssignedCustomers'

import NotFound from '../pages/NotFound'
import { Inventory, Inventory2 } from '@mui/icons-material'

const roleHome = {
  ADMIN: '/admin/dashboard',
  CUSTOMER: '/customer/home',
  DEALER: '/dealer/dashboard',
  REPRESENTATIVE_EXECUTIVE: '/re/customers',
}

const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Navigate to={roleHome[role] || '/login'} replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Customer */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route element={<MainLayout />}>
          <Route path="/customer/home" element={<Home />} />
          <Route path="/customer/products" element={<Products />} />
          <Route path="/customer/products/:id" element={<ProductDetails />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/checkout" element={<Checkout />} />
          <Route path="/customer/orders" element={<Orders />} />
          <Route path="/customer/orders/:id/invoice" element={<Invoice />} />
          <Route path="/customer/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/dealers" element={<AdminDealers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* Dealer */}
      <Route element={<ProtectedRoute allowedRoles={['DEALER']} />}>
        <Route element={<DealerLayout />}>
          <Route path="/dealer/dashboard" element={<DealerDashboard />} />
          <Route path="/dealer/products" element={<DealerProducts />} />
          <Route path="/dealer/inventory" element={<DealerInventory/>} />
          <Route path="/dealer/shipments" element={<DealerShipments />} />
        </Route>
      </Route>

      {/* Representative Executive */}
      <Route element={<ProtectedRoute allowedRoles={['REPRESENTATIVE_EXECUTIVE', 'ADMIN']} />}>
        <Route element={<RELayout />}>
          <Route path="/re/customers" element={<REAssignedCustomers />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes

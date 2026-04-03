import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import RoleGate from './components/RoleGate';
import UserSync from './components/UserSync';

import Login from './pages/Login';
import Dashboard from './pages/dashboard';
import Products from './pages/Products';
import Gardners from './pages/Gardners';
import Orders from './pages/Orders';
import Returns from './pages/Returns';
import Queries from './pages/Queries';
import GardenerDashboard from './Gardner/dashboard';

export default function App() {
  return (
    <RoleProvider>
      <UserSync />
      <RoleGate>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Admin-only routes */}
          <Route path="/"          element={<Dashboard />} />
          <Route path="/products"  element={<Products />} />
          <Route path="/gardeners" element={<Gardners />} />
          <Route path="/orders"    element={<Orders />} />
          <Route path="/returns"   element={<Returns />} />
          <Route path="/queries"   element={<Queries />} />

          {/* Gardener-only routes */}
          <Route path="/gardener/dashboard" element={<GardenerDashboard />} />
          <Route path="/gardener/services"  element={<GardenerDashboard />} />
        </Routes>
      </RoleGate>
    </RoleProvider>
  );
}
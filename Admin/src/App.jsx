import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Products from './pages/Products';
import Gardners from './pages/Gardners';
import Orders from './pages/Orders';
import Returns from './pages/Returns';
import Login from './pages/Login';
import GardenerAppointments from './Gardner/dashboard';
import GardenerGuard from './components/GardenerGuard';
import AdminGuard from './components/AdminGuard';
import UserSync from './components/UserSync';
import GardnerAppointments from './Gardner/dashboard';

export default function App() {
  return (
    <>
      <UserSync />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminGuard><Dashboard /></AdminGuard>} />
        <Route path="/products" element={<AdminGuard><Products /></AdminGuard>} />
        <Route path="/gardeners" element={<AdminGuard><Gardners /></AdminGuard>} />
        <Route path="/orders" element={<AdminGuard><Orders /></AdminGuard>} />
        <Route path="/returns" element={<AdminGuard><Returns /></AdminGuard>} />
        <Route path="/gardener/dashboard" element={<GardenerGuard><GardnerAppointments /></GardenerGuard>} />
        <Route path="/gardener/services" element={<GardenerGuard><GardenerAppointments /></GardenerGuard>} />
      </Routes>
    </>
  );
}
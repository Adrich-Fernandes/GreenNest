import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Products from './pages/Products';
import Gardners from './pages/Gardners';
import Orders from './pages/Orders';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gardeners" element={<Gardners />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}
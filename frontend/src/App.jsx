import React from 'react'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import Products from './pages/products'
import Gardeners from './pages/gardeners'
import ProductView from './pages/productView'
import GardenerView from './pages/gardenerView'
import Cart from './pages/cart'
import UserSync from './components/UserSync'
import Orders from './pages/orders'
import Appointments from './pages/appointments'
import UserGuard from './components/UserGuard'

const App = () => {
  return (
    <div>
      <UserSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gardeners" element={<Gardeners />} />
        <Route path="/gardeners/:id" element={<GardenerView />} />
        <Route path="/plants/:id" element={<ProductView />} />
        
        {/* User Only Routes */}
        <Route path="/cart" element={<UserGuard><Cart /></UserGuard>} />
        <Route path='/orders' element={<UserGuard><Orders /></UserGuard>} />
        <Route path='/appointments' element={<UserGuard><Appointments /></UserGuard>} />
      </Routes>
    </div>
  )
}

export default App

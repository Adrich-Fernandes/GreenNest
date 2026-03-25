import React from 'react'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import Products from './pages/products'
import Gardeners from './pages/gardeners'
import ProductView from './pages/productView'
import Cart from './pages/cart'
import UserSync from './components/UserSync'
import Orders from './pages/orders'

const App = () => {
  return (
    <div>
      <UserSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gardeners" element={<Gardeners />} />
        <Route path="/plants/:id" element={<ProductView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
      </Routes>
    </div>
  )
}

export default App

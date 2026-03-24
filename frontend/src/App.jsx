import React from 'react'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import Products from './pages/products'
import Gardeners from './pages/gardeners'
import ProductView from './pages/productView'
import Cart from './pages/cart'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gardeners" element={<Gardeners />} />
        <Route path="/plants/:id" element={<ProductView />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </div>
  )
}

export default App

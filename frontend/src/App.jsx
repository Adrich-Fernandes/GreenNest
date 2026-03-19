import React from 'react'
import Home from './pages/home'
import { Routes, Route } from 'react-router-dom'
import Products from './pages/products'
import Gardeners from './pages/gardeners'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gardeners" element={<Gardeners />} />
      </Routes>
    </div>
  )
}

export default App

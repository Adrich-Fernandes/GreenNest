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
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

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
        <Route path="/cart" element={<Cart />} />
        
        {/* Protected Routes */}
        <Route path='/orders' element={
          <>
            <SignedIn><Orders /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
        <Route path='/appointments' element={
          <>
            <SignedIn><Appointments /></SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
          </>
        } />
      </Routes>
    </div>
  )
}

export default App

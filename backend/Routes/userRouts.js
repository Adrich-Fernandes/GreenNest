const express = require("express");
const router = express.Router();
const { syncUser, getMyProfile, getCart, addToCart, updateCartQuantity, removeFromCart } = require("../Controller/userController");
const { protect } = require("../middleware/authMiddleware");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Public/Semi-public routes
router.post("/sync", syncUser);

// Protected routes (User profile & Cart)
router.get("/me", ClerkExpressRequireAuth(), protect, getMyProfile);

// Cart routes (mounted at /api/cart in server.js)
router.get("/", ClerkExpressRequireAuth(), protect, getCart);
router.post("/add", ClerkExpressRequireAuth(), protect, addToCart);
router.put("/update/:productId", ClerkExpressRequireAuth(), protect, updateCartQuantity);
router.delete("/remove/:productId", ClerkExpressRequireAuth(), protect, removeFromCart);

module.exports = router;

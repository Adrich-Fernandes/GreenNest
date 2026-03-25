const express = require("express");
const router = express.Router();
const { syncUser, getMyProfile, getCart, addToCart, updateCartQuantity, removeFromCart } = require("../Controller/userController");
const { protect } = require("../middleware/authMiddleware");

// Public/Semi-public routes
router.post("/sync", syncUser);

// Protected routes (User profile & Cart)
router.get("/me", protect, getMyProfile);

// Cart routes (mounted at /api/cart in server.js)
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update/:productId", protect, updateCartQuantity);
router.delete("/remove/:productId", protect, removeFromCart);

module.exports = router;

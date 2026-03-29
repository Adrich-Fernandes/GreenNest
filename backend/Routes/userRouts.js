const express = require("express");
const router = express.Router();
const { syncUser, getMyProfile, getCart, addToCart, updateCartQuantity, removeFromCart, getAddresses, addAddress, deleteAddress } = require("../Controller/userController");
const { protect, isUser } = require("../middleware/authMiddleware");

// Public/Semi-public routes
router.post("/sync", syncUser);

// Protected routes (User profile & Cart)
router.get("/me", protect, getMyProfile);

// Cart routes
router.get("/", protect, isUser, getCart);
router.post("/add", protect, isUser, addToCart);
router.put("/update/:productId", protect, isUser, updateCartQuantity);
router.delete("/remove/:productId", protect, isUser, removeFromCart);

// Address routes
router.get("/addresses", protect, isUser, getAddresses);
router.post("/addresses", protect, isUser, addAddress);
router.delete("/addresses/:id", protect, isUser, deleteAddress);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock} = require("../Controller/productController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/roleMiddleware");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin routes (Protected)
router.post("/", ClerkExpressRequireAuth(), protect, admin, createProduct);
router.put("/:id", ClerkExpressRequireAuth(), protect, admin, updateProduct);
router.delete("/:id", ClerkExpressRequireAuth(), protect, admin, deleteProduct);
router.patch("/:id/stock", ClerkExpressRequireAuth(), protect, admin, updateStock);

module.exports = router;
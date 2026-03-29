const express = require("express");
const router = express.Router();
const { getUserOrders, requestReturn, cancelOrder, placeOrder, getAllOrders, updateOrderStatus, getReturnOrders } = require("../Controller/orderController");
const { protect, admin, isUser, isAdmin } = require("../middleware/authMiddleware");

router.get("/my-orders", protect, isUser, getUserOrders);
router.post("/place", protect, isUser, placeOrder);
router.post("/:orderId/return", protect, isUser, requestReturn);
router.post("/:orderId/cancel", protect, isUser, cancelOrder);

// Admin routes
router.get("/admin/all", protect, isAdmin, getAllOrders);
router.get("/admin/returns", protect, isAdmin, getReturnOrders);
router.put("/admin/:orderId/status", protect, isAdmin, updateOrderStatus);

module.exports = router;

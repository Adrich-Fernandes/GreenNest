const express = require("express");
const router = express.Router();
const { getUserOrders, requestReturn, cancelOrder, placeOrder, getAllOrders, updateOrderStatus } = require("../Controller/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/my-orders", protect, getUserOrders);
router.post("/place", protect, placeOrder);
router.post("/:orderId/return", protect, requestReturn);
router.post("/:orderId/cancel", protect, cancelOrder);

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:orderId/status", protect, admin, updateOrderStatus);

module.exports = router;

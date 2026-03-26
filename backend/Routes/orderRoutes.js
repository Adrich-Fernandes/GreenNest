const express = require("express");
const router = express.Router();
const { getUserOrders, requestReturn } = require("../Controller/orderController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-orders", protect, getUserOrders);
router.post("/:orderId/return", protect, requestReturn);

module.exports = router;

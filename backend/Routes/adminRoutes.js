const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");

// Get dashboard stats (Revenue, Orders, Products, etc.)
router.get("/stats", adminController.getDashboardStats);

module.exports = router;

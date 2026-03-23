const express = require("express");
const router = express.Router();
const { syncUser, getMyProfile } = require("../Controller/userController");
const { protect } = require("../middleware/authMiddleware");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Public/Semi-public routes
router.post("/sync", syncUser);

// Protected routes
router.get("/me", ClerkExpressRequireAuth(), protect, getMyProfile);

module.exports = router;

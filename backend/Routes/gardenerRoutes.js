const express = require("express");
const router = express.Router();
const {
  getGardenerData,
  getAllGardeners,
  getGardenerById,
  syncServices,
  updateAppointmentStatus
} = require("../Controller/gardenerController");

const { protect, isGardener } = require("../middleware/authMiddleware");

router.get("/", getAllGardeners);
router.get("/profile/:id", getGardenerById);
router.get("/:clerkId", protect, isGardener, getGardenerData);
router.post("/sync-services", protect, isGardener, syncServices);
router.put("/appointment-status", protect, isGardener, updateAppointmentStatus);

module.exports = router;

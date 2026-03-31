const express = require("express");
const router = express.Router();
const {
  getGardenerData,
  getAllGardeners,
  getGardenerById,
  updateProfile,
  updateAppointmentStatus,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
} = require("../Controller/gardenerController");

const { protect, isGardener } = require("../middleware/authMiddleware");

// Public
router.get("/", getAllGardeners);
router.get("/profile/:id", getGardenerById);

// Customer routes
router.post("/book-appointment", protect, bookAppointment);
router.get("/my-appointments/:userId", protect, getUserAppointments);
router.put("/cancel-appointment", protect, cancelAppointment);

// Gardener-only routes
router.get("/:clerkId", protect, isGardener, getGardenerData);
router.post("/update-profile", protect, isGardener, updateProfile);
router.put("/appointment-status", protect, isGardener, updateAppointmentStatus);

module.exports = router;

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
  rescheduleAppointment,
  deleteGardener,
  adminUpdateProfile,
  adminAddGardener,
} = require("../Controller/gardenerController");

const { protect, isGardener } = require("../middleware/authMiddleware");

// Public
router.get("/", getAllGardeners);
router.get("/profile/:id", getGardenerById);

// Customer routes
router.post("/book-appointment", protect, bookAppointment);
router.get("/my-appointments/:userId", protect, getUserAppointments);
router.put("/cancel-appointment", protect, cancelAppointment);
router.put("/reschedule-appointment", protect, rescheduleAppointment);

// Gardener-only routes
router.get("/:clerkId", protect, isGardener, getGardenerData);
router.post("/update-profile", protect, isGardener, updateProfile);
router.put("/appointment-status", protect, isGardener, updateAppointmentStatus);
// Admin routes
router.post("/admin-add", adminAddGardener);
router.put("/admin-update/:id", adminUpdateProfile);
router.delete("/:id", deleteGardener);

module.exports = router;

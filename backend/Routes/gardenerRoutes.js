const express = require("express");
const router = express.Router();
const {
  getGardenerData,
  getAllGardeners,
  getGardenerById,
  syncServices,
  updateAppointmentStatus
} = require("../Controller/gardenerController");

router.get("/", getAllGardeners);
router.get("/profile/:id", getGardenerById);
router.get("/:clerkId", getGardenerData);
router.post("/sync-services", syncServices);
router.put("/appointment-status", updateAppointmentStatus);

module.exports = router;

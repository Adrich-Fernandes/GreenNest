const Gardener = require("../Models/gardenerModel");

// Get or Create Gardener data
const getGardenerData = async (req, res) => {
  try {
    const { clerkId } = req.params;
    let gardener = await Gardener.findOne({ clerkId });

    if (!gardener) {
      // Auto-create basic profile if it doesn't exist (similar to UserSync)
      gardener = await Gardener.create({
        clerkId,
        name: "New Gardener",
        email: "gardener@greennest.com", // Temporary placeholder
        services: [],
        appointments: []
      });
    }

    res.json({ success: true, data: gardener });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sync gardener services
const syncServices = async (req, res) => {
  try {
    const { clerkId, services } = req.body;
    const gardener = await Gardener.findOneAndUpdate(
      { clerkId },
      { $set: { services } },
      { new: true, runValidators: true }
    );

    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }

    res.json({ success: true, data: gardener.services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { clerkId, appointmentId, status, date, time } = req.body;
    
    const updateFields = { "appointments.$.status": status };
    if (date) updateFields["appointments.$.date"] = date;
    if (time) updateFields["appointments.$.time"] = time;

    const gardener = await Gardener.findOneAndUpdate(
      { clerkId, "appointments._id": appointmentId },
      { $set: updateFields },
      { new: true }
    );

    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener or Appointment not found" });
    }

    res.json({ success: true, data: gardener.appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all active gardeners
const getAllGardeners = async (req, res) => {
  try {
    const gardeners = await Gardener.find({ status: "active" });
    res.json({ success: true, data: gardeners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get gardener by ID (for profile view)
const getGardenerById = async (req, res) => {
  try {
    const gardener = await Gardener.findById(req.params.id);
    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }
    res.json({ success: true, data: gardener });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGardenerData,
  getAllGardeners,
  getGardenerById,
  syncServices,
  updateAppointmentStatus
};

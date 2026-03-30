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

// Book appointment — called by a customer from the frontend
const bookAppointment = async (req, res) => {
  try {
    const { gardenerId, userId, customerName, location, service, serviceName, price, date, time, duration, note } = req.body;

    const gardener = await Gardener.findById(gardenerId);
    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }

    gardener.appointments.push({
      userId,
      customerName,
      customer: customerName,
      location,
      service: serviceName || service,
      date: new Date(date),
      time,
      duration: duration || "1 hour",
      note: note || "",
      status: "Pending",
    });

    await gardener.save();
    const newAppt = gardener.appointments[gardener.appointments.length - 1];
    res.status(201).json({ success: true, data: newAppt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all appointments for a specific customer (by clerkId)
const getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;

    const gardeners = await Gardener.find({ "appointments.userId": userId });

    const appointments = [];
    gardeners.forEach((g) => {
      g.appointments
        .filter((apt) => apt.userId === userId)
        .forEach((apt) => {
          appointments.push({
            ...apt.toObject(),
            gardenerName: g.name,
            gardenerRating: g.rating || 0,
            gardenerId: g._id,
          });
        });
    });

    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment — called by the customer
const cancelAppointment = async (req, res) => {
  try {
    const { gardenerId, appointmentId } = req.body;

    const gardener = await Gardener.findOneAndUpdate(
      { _id: gardenerId, "appointments._id": appointmentId },
      { $set: { "appointments.$.status": "Canceled" } },
      { new: true }
    );

    if (!gardener) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getGardenerData,
  getAllGardeners,
  getGardenerById,
  syncServices,
  updateAppointmentStatus,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
};

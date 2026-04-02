const Gardener = require("../Models/gardenerModel.js");

// Get or Create Gardener data
const getGardenerData = async (req, res) => {
  try {
    const { clerkId } = req.params;
    let gardener = await Gardener.findOne({ clerkId });

    if (!gardener) {
      // Auto-create basic profile using real details from the User collection
      gardener = await Gardener.create({
        clerkId,
        name: req.user.name || req.user.firstName || "Gardener",
        email: req.user.email,
        basePrice: 0,
        specialties: [],
        appointments: []
      });
    }

    res.json({ success: true, data: gardener });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update gardener profile
const updateProfile = async (req, res) => {
  try {
    const { clerkId, bio, basePrice, location, phone, specialties, experience } = req.body;
    
    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (location !== undefined) updateData.location = location;
    if (phone !== undefined) updateData.phone = phone;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (experience !== undefined) updateData.experience = experience;

    const gardener = await Gardener.findOneAndUpdate(
      { clerkId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }

    res.json({ success: true, data: gardener });
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

// Get all gardeners (filtered by active for public, all for admin)
const getAllGardeners = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { status: "active" };
    const gardeners = await Gardener.find(filter);
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
    const { gardenerId, userId, customerName, location, serviceRequired, price, date, time, duration, note } = req.body;

    const gardener = await Gardener.findById(gardenerId);
    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }

    gardener.appointments.push({
      userId,
      customerName,
      customer: customerName,
      location,
      serviceRequired,
      price: price || gardener.basePrice,
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

// Reschedule appointment — called by the customer
const rescheduleAppointment = async (req, res) => {
  try {
    const { gardenerId, appointmentId, date, time } = req.body;

    const gardener = await Gardener.findOneAndUpdate(
      { _id: gardenerId, "appointments._id": appointmentId },
      { $set: { 
          "appointments.$.date": new Date(date),
          "appointments.$.time": time,
          "appointments.$.status": "Rescheduled"
        } 
      },
      { new: true }
    );

    if (!gardener) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment rescheduled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete gardener profile (Admin)
const deleteGardener = async (req, res) => {
  try {
    const gardener = await Gardener.findByIdAndDelete(req.params.id);
    if (!gardener) {
      return res.status(404).json({ success: false, message: "Gardener not found" });
    }
    res.json({ success: true, message: "Gardener profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update gardener profile (Admin using database ID)
const adminUpdateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, specialties, rating, status, basePrice, experience, bio } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (rating !== undefined) updateData.rating = rating;
    if (status !== undefined) updateData.status = status;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (experience !== undefined) updateData.experience = experience;
    if (bio !== undefined) updateData.bio = bio;

    const gardener = await Gardener.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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
  updateProfile,
  updateAppointmentStatus,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  rescheduleAppointment,
  deleteGardener,
  adminUpdateProfile,
};

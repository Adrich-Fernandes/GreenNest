const mongoose = require("mongoose");

const gardenerSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  location: { 
    type: String 
  },
  services: [{ 
    type: String 
  }],
  bio: { 
    type: String 
  },
  profileImage: { 
    type: String 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  experience: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ["active", "inactive"], 
    default: "active" 
  },
  appointments: [
    {
      userId: { type: String, required: true }, // Clerk ID of customer
      customerName: { type: String, required: true },
      location: { type: String, required: true },
      service: { type: String, required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      duration: { type: String },
      note: { type: String },
      status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Completed", "Canceled", "Rescheduled"],
        default: "Pending" 
      },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Gardener", gardenerSchema);

const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    query: { type: String, required: true },
    clerkId: { type: String, required: false },
    status: { type: String, enum: ["Pending", "Update Requested", "Resolved"], default: "Pending" },
    adminReply: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);

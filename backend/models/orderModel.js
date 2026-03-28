const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

const addressSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  addressline1: { type: String, required: true },
  addressline2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const trackingSchema = new mongoose.Schema({
  label: { type: String, required: true },
  done: { type: Boolean, default: false },
  time: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    address: addressSchema,
    subtotal: { type: Number, required: true, default: 0 },
    delivery: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Ordered" },
    statusKey: {
      type: String,
      enum: ["ordered", "shipped", "out_for_delivery", "delivered", "cancelled", "cancel_requested", "return_requested", "return_confirmed", "refunded"],
      default: "ordered",
    },
    tracking: [trackingSchema],
    canReturn: { type: Boolean, default: false },
    canCancel: { type: Boolean, default: true },
    returnStatus: { type: String, default: null },
    pickupDate: { type: String, default: null },
    returnReason: { type: String },
    returnDetails: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

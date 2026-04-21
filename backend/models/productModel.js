const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nursery: {
      type: String,
      trim: true,
      default: "GreenNest",
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: true,
      enum: ["Indoor", "Outdoor", "Flowering", "Seeds", "Pots & Planters", "Tools"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Active", "Out of Stock", "Low Stock"],
      default: "Active",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    description: {
      type: String,
      trim: true,
    },
    careInstructions: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to automatically update status and inStock based on stock count
productSchema.pre("save", async function () {
  this.inStock = this.stock > 0;
  
  if (this.stock <= 0) {
    this.status = "Out of Stock";
  } else if (this.stock <= 10) {
    this.status = "Low Stock";
  } else {
    this.status = "Active";
  }
});

module.exports = mongoose.model("Product", productSchema);
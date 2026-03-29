const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
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

  role: {
    type: String,
    enum: ["user", "admin", "gardener"],
    default: "user"
  },


  /* ADDRESSES */

  address: [
    {
      fullname: { type: String, required: true },

      addressline1: { type: String, required: true },

      addressline2: { type: String },

      city: { type: String, required: true },

      state: { type: String, required: true },

      phone: { type: String, required: true },

      pincode: { type: String, required: true },

      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],


  /* CART */

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: {
        type: Number,
        default: 1
      },

      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],


  /* WISH LIST */

  wishlist: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],


  /* ORDERS */

  orders: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      phone: {
        type: String,
        required: true
      },

      quantity: {
        type: Number,
        default: 1
      },

      totalPrice: {
        type: Number,
        required: true
      },

      status: {
        type: String,
        enum: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled"
        ],
        default: "pending"
      },

      shippingAddress: {
        fullname: String,
        phone: String,
        addressline1: String,
        addressline2: String,
        city: String,
        state: String,
        pincode: String
      },

      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}
);

module.exports = mongoose.model("User", userSchema);
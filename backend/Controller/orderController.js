const Order = require("../models/orderModel");
const User = require("../models/userModel");

// Get logged in user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Ensure backwards compatibility with frontend mock format in case any transformations are needed
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      statusKey: order.statusKey,
      items: order.items.map(item => ({
        _id: item.product.toString(),
        name: item.name,
        category: item.category,
        price: item.price,
        qty: item.qty,
        image: item.image,
      })),
      address: order.address,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      tracking: order.tracking,
      canReturn: order.canReturn,
      canCancel: order.canCancel,
      returnStatus: order.returnStatus,
      pickupDate: order.pickupDate,
    }));

    res.status(200).json({ success: true, count: formattedOrders.length, data: formattedOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Request a return for an order
const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, details } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.canReturn) {
      return res.status(400).json({ success: false, message: "This order is not eligible for return." });
    }

    // Update order status to return requested
    order.statusKey = "return_requested";
    order.status = "Return Requested";
    order.canReturn = false;
    order.returnStatus = "return_requested";
    order.returnReason = reason;
    order.returnDetails = details;
    
    // Set a mock pickup date for 2 days from now
    const pickup = new Date();
    pickup.setDate(pickup.getDate() + 2);
    order.pickupDate = pickup.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    // Update the tracking log
    order.tracking.push({
      label: "Return Requested",
      done: true,
      time: new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true }),
    });

    await order.save();

    res.status(200).json({ success: true, message: "Return requested successfully", data: order });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserOrders,
  requestReturn
};

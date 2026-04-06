const Order = require("../models/orderModel");
const User = require("../models/userModel");

// Get logged in user's orders
// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Snapshot products and calculate totals
    const orderItems = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      qty: item.quantity,
      image: item.product.images?.[0] || "",
      price: item.product.price,
      category: item.product.category,
    }));

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const delivery = subtotal >= 599 ? 0 : 49;
    const total = subtotal + delivery;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      address,
      paymentMethod: paymentMethod || "cash",
      subtotal,
      delivery,
      total,
      status: "Ordered",
      statusKey: "ordered",
      tracking: [
        {
          label: "Ordered",
          done: true,
          time: new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true }),
        },
        { label: "Shipped", done: false },
        { label: "Out for Delivery", done: false },
        { label: "Delivered", done: false },
      ],
      canReturn: false,
      canCancel: true,
      expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Default 4 days
    });

    // Clear user cart
    user.cart = [];
    await user.save();

    res.status(201).json({ success: true, message: "Order placed successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all orders in the system
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, statusKey, pickupDate } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status) order.status = status;
    if (statusKey) order.statusKey = statusKey;
    if (pickupDate) order.pickupDate = pickupDate;
    
    // Manual date overrides from Admin
    if (req.body.expectedDeliveryDate !== undefined) order.expectedDeliveryDate = req.body.expectedDeliveryDate === "" ? null : req.body.expectedDeliveryDate;
    if (req.body.returnDate !== undefined) order.returnDate = req.body.returnDate === "" ? null : req.body.returnDate;
    // req.body.pickupDate might be handled above, we should override it identically if passed
    if (req.body.pickupDate !== undefined) order.pickupDate = req.body.pickupDate === "" ? null : req.body.pickupDate;

    // Sync tracking steps for the 4 standard statuses
    const standardKeys = ["ordered", "shipped", "out_for_delivery", "delivered"];
    if (standardKeys.includes(statusKey)) {
      const targetLabel = statusKey === "ordered" ? "Ordered" : 
                          statusKey === "shipped" ? "Shipped" : 
                          statusKey === "out_for_delivery" ? "Out for Delivery" : "Delivered";

      order.tracking.forEach((step) => {
        // Mark current and all previous steps as done
        const stepIndex = order.tracking.findIndex(t => t.label === step.label);
        const targetIndex = order.tracking.findIndex(t => t.label === targetLabel);
        
        if (stepIndex <= targetIndex && !step.done) {
          step.done = true;
          step.time = new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true });
        }
      });
    }

    // Special handling
    if (statusKey === "delivered") {
      order.canReturn = true;
      order.canCancel = false;
    }
    if (statusKey === "shipped") {
      order.canCancel = false;
    }
    if (statusKey === "refunded") {
      order.status = "Refunded (Completed)";
    }

    // Add tracking log for requests
    if (["return_confirmed", "refunded", "cancelled"].includes(statusKey)) {
      const label = statusKey === "return_confirmed" ? "Return Confirmed" : 
                    statusKey === "refunded" ? "Refund Processed" : "Order Cancelled";
      
      const existingStep = order.tracking.find(t => t.label === label);
      if (!existingStep) {
        order.tracking.push({
          label,
          done: true,
          time: new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true }),
        });
      }
    }

    await order.save();
    res.status(200).json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// User: Request cancellation
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!order.canCancel) return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });

    order.statusKey = "cancel_requested";
    order.status = "Cancellation Requested";
    order.canCancel = false;
    
    order.tracking.push({
      label: "Cancellation Requested",
      done: true,
      time: new Date().toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "numeric", hour12: true }),
    });

    await order.save();
    res.status(200).json({ success: true, message: "Cancellation request submitted", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get logged in user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Ensure backwards compatibility with frontend mock format
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
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      tracking: order.tracking,
      canReturn: order.canReturn,
      canCancel: order.canCancel,
      returnStatus: order.returnStatus,
      pickupDate: order.pickupDate,
      returnDate: order.returnDate,
      expectedDeliveryDate: order.expectedDeliveryDate,
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
    order.returnDate = new Date();
    
    // Admin will set pickup date upon confirmation
    order.pickupDate = null;

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

// Admin: Get return-related orders
const getReturnOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      statusKey: { 
        $in: ["return_requested", "return_confirmed", "refunded", "cancel_requested", "cancelled"] 
      }
    }).populate("user", "name email").sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserOrders,
  requestReturn,
  placeOrder,
  getAllOrders,
  getReturnOrders,
  updateOrderStatus,
  cancelOrder
};

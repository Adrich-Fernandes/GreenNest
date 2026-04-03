const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Gardener = require("../models/gardenerModel");

// Get comprehensive dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Calculate Total Revenue (Only from delivered orders)
    const revenueData = await Order.aggregate([
      { $match: { statusKey: "delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // 2. Count Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Count Total Products
    const totalProducts = await Product.countDocuments();

    // 4. Count Active Gardeners
    const totalGardeners = await Gardener.countDocuments();

    // 5. Fetch 5 Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("total status statusKey createdAt address");

    // Format recent orders for the frontend table
    const formattedOrders = recentOrders.map(order => ({
      id: `#ORD${order._id.toString().slice(-4).toUpperCase()}`,
      customer: order.address?.fullname || "Unknown",
      amount: `₹${order.total}`,
      status: order.status,
      date: order.createdAt
    }));

    res.status(200).json({
      success: true,
      stats: {
        revenue: totalRevenue,
        orders: totalOrders,
        products: totalProducts,
        gardeners: totalGardeners
      },
      recentOrders: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

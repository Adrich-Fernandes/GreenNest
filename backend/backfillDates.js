const mongoose = require("mongoose");
const Order = require("./models/orderModel"); // Corrected path to standard models folder
require("dotenv").config();

const backfillOrders = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not found in .env");
    
    await mongoose.connect(uri);
    console.log("Connected to MongoDB.");

    const orders = await Order.find({ expectedDeliveryDate: null });
    console.log(`Found ${orders.length} orders lacking expectedDeliveryDate.`);

    for (const order of orders) {
      // Set to 4 days after creation
      const creationDate = new Date(order.createdAt);
      const expected = new Date(creationDate.getTime() + 4 * 24 * 60 * 60 * 1000);
      
      order.expectedDeliveryDate = expected;
      await order.save();
    }

    console.log("Backfill complete.");
    process.exit(0);
  } catch (error) {
    console.error("Backfill failed:", error);
    process.exit(1);
  }
};

backfillOrders();

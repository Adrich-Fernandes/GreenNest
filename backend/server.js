const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const queryRoutes = require("./Routes/queryRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const gardenerRoutes = require("./Routes/gardenerRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", userRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/gardener", gardenerRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminRoutes);
// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "GreenNest API is running 🌿" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
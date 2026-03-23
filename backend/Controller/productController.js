const Product = require("../models/productModel");

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "All Types") {
      query.category = category;
    }

    // Search by name or nursery
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nursery: { $regex: search, $options: "i" } },
      ];
    }

    let products = Product.find(query);

    // Sort
    if (sort === "Price: Low to High") products = products.sort({ price: 1 });
    else if (sort === "Price: High to Low") products = products.sort({ price: -1 });
    else if (sort === "Top Rated") products = products.sort({ rating: -1 });
    else products = products.sort({ createdAt: -1 }); // Newest

    const result = await products;

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create new product
const createProduct = async (req, res) => {
  console.log("POST /api/products body:", req.body);
  try {
    const { name, nursery, price, category, stock, rating, description, careInstructions, image } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price and category are required" });
    }

    const product = await Product.create({
      name,
      nursery,
      price,
      category,
      stock,
      rating,
      description,
      careInstructions,
      image,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH update stock
const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ success: false, message: "Valid stock value is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock, status: stock === 0 ? "Out of Stock" : stock <= 10 ? "Low Stock" : "Active" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
};
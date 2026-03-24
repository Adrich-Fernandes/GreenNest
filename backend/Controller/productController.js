const Product = require("../models/productModel");

// GET /allProducts — public, used by user-facing pages
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: error.message });
  }
};

// GET /product/:id — public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch product", error: error.message });
  }
};

// POST /insertProduct — admin only
const createProduct = async (req, res) => {
  try {
    const { name, nursery, price, category, stock, description, careInstructions, images, rating } = req.body;

    const product = new Product({
      name,
      nursery,
      price,
      category,
      stock,
      description,
      careInstructions,
      images: Array.isArray(images) ? images : images ? [images] : [], // ✅ always store as array
      rating,
    });

    const saved = await product.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create product", error: error.message });
  }
};

// PUT /updateProduct/:id — admin only
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Normalize images to array if provided in update
    if (updates.images !== undefined) {
      updates.images = Array.isArray(updates.images)
        ? updates.images
        : updates.images
        ? [updates.images]
        : [];
    }

    Object.assign(product, updates);
    const updated = await product.save();

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update product", error: error.message });
  }
};

// DELETE /deleteProduct/:id — admin only
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
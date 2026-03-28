const User = require("../models/userModel");

// Sync user from Clerk to local DB
const syncUser = async (req, res) => {
  try {
    const { clerkId, name, email } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ success: false, message: "clerkId and email are required" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Create new user
      // Note: First user could be made admin manually in DB or via logic here
      user = await User.create({
        clerkId,
        name,
        email,
        role: "user" // Default role
      });
    } else {
      // Update existing user
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get cart items
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.status(200).json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let quantity = Number(req.body.quantity) || 1;
    
    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart quantity
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity = qty;
      await user.save();
      res.status(200).json({ success: true, message: "Quantity updated" });
    } else {
      res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user addresses
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user.address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newAddress = req.body;
    
    if (newAddress.isDefault || user.address.length === 0) {
      newAddress.isDefault = true;
      user.address.forEach(addr => addr.isDefault = false);
    }

    user.address.push(newAddress);
    await user.save();
    
    const addedAddress = user.address[user.address.length - 1];
    res.status(200).json({ success: true, message: "Address added", data: addedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addressId = req.params.id;
    
    user.address = user.address.filter(addr => addr._id.toString() !== addressId);
    
    if (user.address.length > 0 && !user.address.some(addr => addr.isDefault)) {
      user.address[0].isDefault = true;
    }

    await user.save();
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { syncUser, getMyProfile, getCart, addToCart, updateCartQuantity, removeFromCart, getAddresses, addAddress, deleteAddress };

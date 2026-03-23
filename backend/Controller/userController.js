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

module.exports = { syncUser, getMyProfile };

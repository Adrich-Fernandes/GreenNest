const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/userModel");

// Middleware to protect routes and attach user to req
const protect = async (req, res, next) => {
  try {
    // ClerkExpressRequireAuth will handle initial validation
    // If we're here, it means the token is valid (or Clerk middleware would have errored)
    
    const clerkId = req.auth.userId;
    
    if (!clerkId) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // Find the user in our database
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in system" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = { protect };

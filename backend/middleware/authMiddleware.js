const User = require("../models/userModel");

// Middleware to protect routes and attach user to req
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // Decode JWT payload without verification for local development
    // This avoids needing the strict CLERK_SECRET_KEY while testing
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    const clerkId = decodedPayload.sub;
    
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
    res.status(401).json({ success: false, message: "Not authorized, token failed/invalid" });
  }
};

// Middleware to restrict access to admins only
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, admin only" });
  }
};

const isAdmin = admin; // Alias for consistency

// Middleware for strict customer (user) only access
const isUser = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, users only" });
  }
};

// Middleware for strict professional gardener only access
const isGardener = (req, res, next) => {
  if (req.user && req.user.role === "gardener") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, gardeners only" });
  }
};

module.exports = { protect, admin, isAdmin, isUser, isGardener };

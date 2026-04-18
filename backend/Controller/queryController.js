const Query = require("../models/queryModel");

// Submit a new user query
exports.submitQuery = async (req, res) => {
  try {
    const { name, email, query, clerkId } = req.body;

    if (!name || !email || !query) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const newQuery = new Query({
      name,
      email,
      query,
      clerkId: clerkId || null
    });

    await newQuery.save();

    res.status(201).json({
      success: true,
      message: "Query submitted successfully! We'll get back to you soon.",
      data: newQuery
    });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all user queries (Admin only)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      queries
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get queries for a specific user
exports.getUserQueries = async (req, res) => {
  try {
    const { clerkId } = req.params;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }

    const queries = await Query.find({ clerkId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      queries
    });
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Request an update for an inquiry (Customer)
exports.requestUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findByIdAndUpdate(
      id,
      { status: "Update Requested" },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Update request sent successfully!",
      query
    });
  } catch (error) {
    console.error("Error requesting update:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Reply to an inquiry (Admin)
exports.replyToQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply } = req.body;

    if (!adminReply) {
      return res.status(400).json({ success: false, message: "Reply message is required" });
    }

    const query = await Query.findByIdAndUpdate(
      id,
      { 
        adminReply,
        status: "Resolved"
      },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Reply sent and inquiry marked as resolved!",
      query
    });
  } catch (error) {
    console.error("Error replying to inquiry:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Reopen an inquiry (Customer)
exports.reopenQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await Query.findByIdAndUpdate(
      id,
      { status: "Reopened", adminReply: "" },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Issue reopened successfully!",
      query
    });
  } catch (error) {
    console.error("Error reopening inquiry:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update inquiry status (Admin)
exports.updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const query = await Query.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully!",
      query
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

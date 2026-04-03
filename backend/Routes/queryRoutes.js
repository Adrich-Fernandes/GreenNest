const express = require("express");
const router = express.Router();
const queryController = require("../Controller/queryController");

// Path: /api/queries/submit
router.post("/submit", queryController.submitQuery);

// Path: /api/queries/all (Admin)
router.get("/all", queryController.getAllQueries);

// Path: /api/queries/user/:clerkId (Customer)
router.get("/user/:clerkId", queryController.getUserQueries);

// Path: /api/queries/:id/update-request (Customer)
router.patch("/:id/update-request", queryController.requestUpdate);

// Path: /api/queries/:id/reply (Admin)
router.patch("/:id/reply", queryController.replyToQuery);

module.exports = router;

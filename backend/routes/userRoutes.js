const express = require("express");
const router = express.Router();
const { updateUserProfile } = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

// Update user profile
router.put("/profile", protect, updateUserProfile);

module.exports = router;
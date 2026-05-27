const express = require("express");

const router =
  express.Router();

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const hotelController =
  require("../controller/hotelController");

const {
  getDashboardStats,
  getHotelRevenueStats,
  getSingleHotelStats,
  getOwnerStats,
  createHotelOwner,
  getAllUsers,
  deleteUser,
} = require("../controller/adminController");

// ==============================
// Add Hotel
// ==============================
router.post(
  "/hotels",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 5),
  hotelController.addHotel
);

// ==============================
// Update Hotel
// ==============================
router.put(
  "/hotels/:id",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 5),
  hotelController.updateHotel
);

// ==============================
// Delete Hotel
// ==============================
router.delete(
  "/hotels/:id",
  protect,
  authorizeRoles("admin"),
  hotelController.deleteHotel
);

// ==============================
// Dashboard Stats
// ==============================
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

// ==============================
// Hotel Revenue Stats
// ==============================
router.get(
  "/hotel-stats",
  protect,
  authorizeRoles("admin"),
  getHotelRevenueStats
);

// ==============================
// Single Hotel Stats
// ==============================
router.get(
  "/hotel/:hotelId/stats",
  protect,
  authorizeRoles(
    "admin",
    "hotelOwner"
  ),
  getSingleHotelStats
);

// ==============================
// Owner Dashboard Stats
// ==============================
router.get(
  "/owner-stats",
  protect,
  authorizeRoles(
    "hotelOwner"
  ),
  getOwnerStats
);

// ==============================
// Create Hotel Owner
// ==============================
router.post(
  "/create-owner",
  protect,
  authorizeRoles("admin"),
  createHotelOwner
);

// ==============================
// Get All Users
// ==============================
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// ==============================
// Delete User
// ==============================
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

module.exports =
  router;
const express = require("express");

const {
  addHotel,
  getHotels,
  getHotelById,
  getMyHotels,
  searchHotels,
  updateHotel,
  deleteHotel,
  updateHotelFacilityStats,
} = require("../controller/hotelController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const upload =
  require("../middleware/uploadMiddleware");

const router =
  express.Router();

// ==============================
// Update Facility Stats
// ==============================
router.put(
  "/:id/facility-stats",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  updateHotelFacilityStats
);

// ==============================
// Add Hotel
// ==============================
router.post(
  "/add",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  upload.array("images", 5),
  addHotel
);

// ==============================
// Get My Hotels
// ==============================
router.get(
  "/my-hotels",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  getMyHotels
);

// ==============================
// Search Hotels
// ==============================
router.get(
  "/search",
  searchHotels
);

// ==============================
// Get All Hotels
// ==============================
router.get(
  "/",
  getHotels
);

// ==============================
// Get Hotel By ID
// ==============================
router.get(
  "/:id",
  getHotelById
);

// ==============================
// Update Hotel
// ==============================
router.put(
  "/:id",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  upload.array("images", 5),
  updateHotel
);

// ==============================
// Delete Hotel
// ==============================
router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  deleteHotel
);

module.exports =
  router;
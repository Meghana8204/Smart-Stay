const express =
  require("express");

const router =
  express.Router();

const {
  addRoom,
  getRoomsByHotel,
  checkRoomAvailability,
  updateRoomAvailability,
  deleteRoom,
} = require(
  "../controller/roomController"
);

const {
  protect,
  authorizeRoles,
} = require(
  "../middleware/authMiddleware"
);

// ==============================
// Add Room
// ==============================
router.post(
  "/add",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  addRoom
);

// ==============================
// Get Rooms By Hotel
// ==============================
router.get(
  "/hotel/:hotelId",
  getRoomsByHotel
);

// ==============================
// Check Availability
// ==============================
router.get(
  "/availability",
  checkRoomAvailability
);

// ==============================
// Update Availability
// ==============================
router.put(
  "/:id/availability",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  updateRoomAvailability
);

// ==============================
// Delete Room
// ==============================
router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "hotelOwner",
    "admin"
  ),
  deleteRoom
);

module.exports =
  router;
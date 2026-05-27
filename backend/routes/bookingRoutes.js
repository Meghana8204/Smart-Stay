const express = require("express");

const {
  bookRoom,
  getMyBookings,
  getOwnerBookings,
  confirmBooking,
  allocateRoom,
  cancelBooking,
  downloadBookingBill,
} = require("../controller/bookingController")

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/book",
  protect,
  bookRoom
);

router.get(
  "/my-bookings",
  protect,
  getMyBookings
);

router.get(
  "/owner-bookings",
  protect,
  authorizeRoles(
    "hotelOwner"
  ),
  getOwnerBookings
);
router.get(
  "/bill/:id",
  protect,
  downloadBookingBill
);

router.put(
  "/confirm/:id",
  protect,
  authorizeRoles("hotelOwner", "admin"),
  confirmBooking
);

router.put(
  "/allocate-room/:id",
  protect,
  authorizeRoles("hotelOwner", "admin"),
  allocateRoom
);

router.put(
  "/cancel/:id",
  protect,
  cancelBooking
);

module.exports = router;

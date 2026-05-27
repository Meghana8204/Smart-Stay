const express = require("express");

const {
  addReview,
  getHotelReviews,
} = require("../controller/reviewController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add",
  protect,
  addReview
);

router.get(
  "/hotel/:hotelId",
  getHotelReviews
);

module.exports = router;
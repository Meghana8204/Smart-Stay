const express = require("express");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require(
  "../controller/wishlistController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/add",
  protect,
  addToWishlist
);

router.get(
  "/my-wishlist",
  protect,
  getWishlist
);

router.delete(
  "/remove/:id",
  protect,
  removeFromWishlist
);

module.exports = router;
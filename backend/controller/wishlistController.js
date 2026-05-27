const Wishlist = require(
  "../models/wishlist"
);

const Hotel = require("../models/Hotel");

const addToWishlist = async (
  req,
  res
) => {
  try {
    const { hotelId } = req.body;

    // Check hotel exists
    const hotel =
      await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    // Prevent duplicate wishlist
    const alreadyExists =
      await Wishlist.findOne({
        user: req.user._id,

        hotel: hotelId,
      });

    if (alreadyExists) {
      return res.status(400).json({
        message:
          "Hotel already in wishlist",
      });
    }

    const wishlist =
      await Wishlist.create({
        user: req.user._id,

        hotel: hotelId,
      });

    res.status(201).json({
      success: true,

      message:
        "Hotel added to wishlist",

      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.find({
        user: req.user._id,
      }).populate("hotel");

    res.status(200).json({
      success: true,

      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist =
  async (req, res) => {
    try {
      const wishlist =
        await Wishlist.findByIdAndDelete(
          req.params.id
        );

      if (!wishlist) {
        return res.status(404).json({
          message:
            "Wishlist item not found",
        });
      }

      res.status(200).json({
        success: true,

        message:
          "Removed from wishlist",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};

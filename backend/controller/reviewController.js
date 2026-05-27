const Review = require("../models/Review");

const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

const addReview = async (req, res) => {
  try {
    const {
      hotelId,
      rating,
      comment,
    } = req.body;

    // Check hotel exists
    const hotel = await Hotel.findById(
      hotelId
    );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    // Prevent duplicate review
    const alreadyReviewed =
      await Review.findOne({
        user: req.user._id,
        hotel: hotelId,
      });

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this hotel",
      });
    }


    // Allow review if booking is finished
    const completedBooking = await Booking.findOne({
      user: req.user._id,
      hotel: hotelId,
      paymentStatus: "Paid",
      bookingStatus: { $in: ["Confirmed", "Finished"] },
    });

    if (!completedBooking) {
      return res.status(403).json({
        message: "Only customers who finished their stay can review this hotel",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,

      hotel: hotelId,

      rating,

      comment,
    });

    // Get all reviews
    const reviews = await Review.find({
      hotel: hotelId,
    });

    // Calculate average rating
    const avgRating =
      reviews.reduce(
        (acc, item) =>
          item.rating + acc,
        0
      ) / reviews.length;

    // Update hotel rating
    hotel.rating = avgRating;

    hotel.totalReviews =
      reviews.length;

    await hotel.save();

    res.status(201).json({
      success: true,

      message:
        "Review added successfully",

      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getHotelReviews = async (
  req,
  res
) => {
  try {
    const reviews = await Review.find({
      hotel: req.params.hotelId,
    })
      .populate(
        "user",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,

      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getHotelReviews,
};

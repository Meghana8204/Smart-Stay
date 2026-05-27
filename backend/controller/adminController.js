const User = require("../models/User");

const Hotel = require("../models/Hotel");

const Room = require("../models/Room");

const Booking = require("../models/Booking");

// ==============================
// Create Hotel Owner
// ==============================
const createHotelOwner = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    // Check existing user
    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists with this email",
      });
    }

    // Hash password
    const bcrypt =
      require("bcryptjs");

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // Create owner
    const newOwner =
      await User.create({
        name,
        email,

        password:
          hashedPassword,

        role:
          "hotelOwner",

        isVerified: true,
      });

    // Remove password
    const ownerObj =
      newOwner.toObject();

    delete ownerObj.password;

    res.status(201).json({
      success: true,

      message:
        "Hotel owner created successfully",

      owner: ownerObj,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Dashboard Stats
// ==============================
const getDashboardStats =
  async (req, res) => {

    try {

      // Totals
      const totalUsers =
        await User.countDocuments();

      const totalHotels =
        await Hotel.countDocuments();

      const totalBookings =
        await Booking.countDocuments();

      // Paid bookings
      const paidBookings =
        await Booking.find({
          paymentStatus:
            "Paid",
        });

      // Revenue
      const totalRevenue =
        paidBookings.reduce(
          (
            total,
            booking
          ) =>

            total +
            booking.totalPrice,

          0
        );

      // Today's revenue
      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const todayBookings =
        paidBookings.filter(
          (booking) =>

            new Date(
              booking.createdAt
            ) >= today
        );

      const todayRevenue =
        todayBookings.reduce(
          (
            total,
            booking
          ) =>

            total +
            booking.totalPrice,

          0
        );

      // Monthly Revenue Chart
      const monthlyRevenue =
        await Booking.aggregate([

          {
            $match: {
              paymentStatus:
                "Paid",
            },
          },

          {
            $group: {

              _id: {
                month: {
                  $month:
                    "$createdAt",
                },
              },

              revenue: {
                $sum:
                  "$totalPrice",
              },
            },
          },

          {
            $sort: {
              "_id.month": 1,
            },
          },
        ]);

      // Booking Status Pie Chart
      const bookingStatus =
        await Booking.aggregate([

          {
            $group: {

              _id:
                "$bookingStatus",

              value: {
                $sum: 1,
              },
            },
          },
        ]);

      res.status(200).json({

        success: true,

        stats: {

          totalUsers,

          totalHotels,

          totalBookings,

          totalRevenue,

          todayRevenue,
        },

        monthlyRevenue,

        bookingStatus,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Hotel Revenue Stats
// ==============================
const getHotelRevenueStats =
  async (req, res) => {

    try {

      const stats =
        await Booking.aggregate([
          {
            $match: {
              paymentStatus:
                "Paid",
            },
          },

          {
            $group: {
              _id: "$hotel",

              totalRevenue: {
                $sum:
                  "$totalPrice",
              },

              totalBookings: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              totalRevenue: -1,
            },
          },
        ]);

      // Populate hotel details
      const populatedStats =
        await Hotel.populate(
          stats,
          {
            path: "_id",

            select:
              "hotelName location images rating",
          }
        );

      res.status(200).json({
        success: true,

        hotelStats:
          populatedStats,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Single Hotel Stats
// ==============================
const getSingleHotelStats =
  async (req, res) => {

    try {

      const hotel =
        await Hotel.findById(
          req.params.hotelId
        );

      if (!hotel) {

        return res.status(404).json({
          message:
            "Hotel not found",
        });
      }

      // Access check
      if (
        req.user.role !==
        "admin" &&
        hotel.owner?.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "Not allowed to view this hotel stats",
        });
      }

      const [
        totalRooms,
        availableRooms,
        totalBookings,
        paidBookings,
        pendingBookings,
        cancelledBookings,
      ] = await Promise.all([
        Room.countDocuments({
          hotel:
            hotel._id,
        }),

        Room.countDocuments({
          hotel:
            hotel._id,

          isAvailable: true,
        }),

        Booking.countDocuments({
          hotel:
            hotel._id,
        }),

        Booking.find({
          hotel:
            hotel._id,

          paymentStatus:
            "Paid",
        }),

        Booking.countDocuments({
          hotel:
            hotel._id,

          bookingStatus:
            "Pending",
        }),

        Booking.countDocuments({
          hotel:
            hotel._id,

          bookingStatus:
            "Cancelled",
        }),
      ]);

      const totalRevenue =
        paidBookings.reduce(
          (acc, booking) =>
            acc +
            booking.totalPrice,
          0
        );

      res.status(200).json({
        success: true,

        stats: {
          hotel,

          totalRooms,

          availableRooms,

          bookedRooms:
            totalRooms -
            availableRooms,

          totalBookings,

          paidBookings:
            paidBookings.length,

          pendingBookings,

          cancelledBookings,

          totalRevenue,

          rating:
            hotel.rating,

          totalReviews:
            hotel.totalReviews,
        },
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Owner Stats
// ==============================
// ==============================
// Owner Dashboard Stats
// ==============================


// ==============================
// Owner Stats
// ==============================
const getOwnerStats =
  async (req, res) => {

    try {

      // Owner hotels
      const hotels =
        await Hotel.find({
          owner: req.user._id
        }).populate(
          "owner",
          "name email"
        )

      const hotelIds =
        hotels.map(
          (hotel) =>
            hotel._id
        );

      // Rooms
      const totalRooms =
        await Room.countDocuments({
          hotel: {
            $in:
              hotelIds,
          },
        });

      // Bookings
      const bookings =
        await Booking.find({
          hotel: {
            $in:
              hotelIds,
          },
        });

      // Revenue
      const totalRevenue =
        bookings.reduce(
          (
            total,
            booking
          ) =>

            total +
            booking.totalPrice,

          0
        );

      res.status(200).json({

        success: true,

        stats: {

          totalHotels:
            hotels.length,

          totalRooms,

          totalBookings:
            bookings.length,

          totalRevenue,
        },

        hotels,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Get All Users
// ==============================
const getAllUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()
          .select("-password");

      res.status(200).json({
        success: true,
        users,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Delete User
// ==============================
const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });
      }

      // Prevent admin deletion
      if (
        user.role === "admin"
      ) {

        return res.status(400).json({
          message:
            "Admin cannot be deleted",
        });
      }

      await user.deleteOne();

      res.status(200).json({
        success: true,

        message:
          "User deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };



// ==============================
// EXPORTS
// ==============================
module.exports = {
  createHotelOwner,
  getDashboardStats,
  getHotelRevenueStats,
  getSingleHotelStats,
  getOwnerStats,
  getAllUsers,
  deleteUser,

};
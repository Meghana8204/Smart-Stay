const Booking = require("../models/Booking");

const Room = require("../models/Room");

const Hotel = require("../models/Hotel");
const sendEmail = require("../utils/sendEmail");
const buildInvoicePdf = require("../utils/pdfInvoice");
const {
  bookingCancelledTemplate,
} = require("../utils/emailTemplates");

const canManageBooking = async (req, booking) => {
  if (req.user.role === "admin") {
    return true;
  }

  const hotel = await Hotel.findById(booking.hotel);

  return (
    req.user.role === "hotelOwner" &&
    hotel?.owner?.toString() === req.user._id.toString()
  );
};

const bookRoom = async (req, res) => {
  try {
    const {
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      guests,
    } = req.body;

    // Check room exists
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        message: "Room is not available",
      });
    }

    // Check hotel exists
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    if (room.hotel.toString() !== hotel._id.toString()) {
      return res.status(400).json({
        message: "Room does not belong to this hotel",
      });
    }

    const checkIn = new Date(checkInDate);

    const checkOut = new Date(checkOutDate);

    if (
      !checkInDate ||
      !checkOutDate ||
      Number.isNaN(checkIn.getTime()) ||
      Number.isNaN(checkOut.getTime()) ||
      checkOut <= checkIn
    ) {
      return res.status(400).json({
        message: "Valid check-in and check-out dates are required",
      });
    }

    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        message: "Guest count exceeds room capacity",
      });
    }

    // Check room availability
    const existingBooking = await Booking.findOne({
      room: roomId,

      bookingStatus: {
        $ne: "Cancelled",
      },

      $or: [
        {
          checkInDate: {
            $lt: checkOut,
          },

          checkOutDate: {
            $gt: checkIn,
          },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "Room already booked for selected dates",
      });
    }

    // Calculate days
    const totalDays =
      (checkOut - checkIn) /
      (1000 * 60 * 60 * 24);

    const totalPrice = totalDays * room.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,

      hotel: hotelId,

      room: roomId,

      checkInDate,

      checkOutDate,

      totalPrice,

      guests,
    });

    res.status(201).json({
      success: true,

      message: "Room booked successfully",

      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("hotel", "hotelName location")
      .populate("room", "roomNumber roomType");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Owner Bookings
// ==============================
const getOwnerBookings =
  async (req, res) => {

    try {

      const hotels =
        await Hotel.find({
          owner:
            req.user._id,
        });

      const hotelIds =
        hotels.map(
          (hotel) =>
            hotel._id
        );

      const bookings =
        await Booking.find({

          hotel: {
            $in: hotelIds,
          },

        })

          .populate(
            "user",
            "name email"
          )

          .populate(
            "hotel",
            "hotelName"
          )

          .populate(
            "room"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        bookings,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!(await canManageBooking(req, booking))) {
      return res.status(403).json({
        message: "Not allowed to confirm this booking",
      });
    }

    booking.bookingStatus = "Confirmed";

    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;
    }

    if (req.body.paymentId) {
      booking.paymentId = req.body.paymentId;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const allocateRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!(await canManageBooking(req, booking))) {
      return res.status(403).json({
        message: "Not allowed to allocate room for this booking",
      });
    }

    const room = await Room.findById(roomId);

    if (!room || room.hotel.toString() !== booking.hotel.toString()) {
      return res.status(400).json({
        message: "Room does not belong to this booking hotel",
      });
    }

    if (!room.isAvailable) {
      return res.status(400).json({
        message: "Room is marked unavailable",
      });
    }

    const overlappingBooking = await Booking.findOne({
      _id: {
        $ne: booking._id,
      },
      room: roomId,
      bookingStatus: {
        $ne: "Cancelled",
      },
      $or: [
        {
          checkInDate: {
            $lt: booking.checkOutDate,
          },
          checkOutDate: {
            $gt: booking.checkInDate,
          },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "Room already booked for selected dates",
      });
    }

    booking.room = roomId;

    await booking.save();

    await booking.populate("hotel room user");

    res.status(200).json({
      success: true,
      message: "Room allocated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwnerOrAdmin = ["admin", "hotelOwner"].includes(req.user.role);
    const isOwnBooking =
      booking.user.toString() === req.user._id.toString();

    if (!isOwnBooking && (!isOwnerOrAdmin || !(await canManageBooking(req, booking)))) {
      return res.status(403).json({
        message: "Not allowed to cancel this booking",
      });
    }

    booking.bookingStatus = "Cancelled";

    await booking.save();

    await booking.populate(
      "user hotel"
    );

    await sendEmail(
      booking.user.email,

      "Booking Cancelled",

      bookingCancelledTemplate(
        booking.user.name,

        booking.hotel.hotelName
      )
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const downloadBookingBill = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("hotel", "hotelName location address")
      .populate("room", "roomNumber roomType price");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwnBooking =
      booking.user._id.toString() === req.user._id.toString();

    if (!isOwnBooking && !(await canManageBooking(req, booking))) {
      return res.status(403).json({
        message: "Not allowed to download this bill",
      });
    }

    const pdf = await buildInvoicePdf(booking);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-${booking._id}.pdf`
    );
    res.send(pdf);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  bookRoom,
  getMyBookings,
  getOwnerBookings,
  confirmBooking,
  allocateRoom,
  cancelBooking,
  downloadBookingBill,
};

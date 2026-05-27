const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Booking = require("../models/Booking");

const sendEmail = require(
  "../utils/sendEmail"
);

const {
  bookingConfirmationTemplate,
} = require(
  "../utils/emailTemplates"
);

const createPaymentOrder = async (
  req,
  res
) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(
      bookingId
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed to create payment for this booking",
      });
    }

    const options = {
      amount: booking.totalPrice * 100,

      currency: "INR",

      receipt: booking._id.toString(),
    };

    const order =
      await razorpay.orders.create(options);

    booking.orderId = order.id;

    await booking.save();
    

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(body.toString())
        .digest("hex");

    const isAuthentic =
      expectedSignature ===
      razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const booking =
      await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed to verify payment for this booking",
      });
    }

    booking.paymentStatus = "Paid";

    booking.paymentId =
      razorpay_payment_id;

    await booking.save();

    await booking.populate(
  "user hotel room"
);

await sendEmail(
  booking.user.email,

  "Booking Confirmation",

  bookingConfirmationTemplate(
    booking.user.name,

    booking.hotel.hotelName,

    booking.room.roomType,

    booking.checkInDate
      .toISOString()
      .split("T")[0],

    booking.checkOutDate
      .toISOString()
      .split("T")[0]
  )
);

    res.status(200).json({
      success: true,

      message:
        "Payment successful and booking confirmed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};

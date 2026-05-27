const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        hotel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },

        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },

        checkInDate: {
            type: Date,
            required: true,
        },

        checkOutDate: {
            type: Date,
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        guests: {
            type: Number,
            required: true,
        },

        bookingStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Cancelled",
            ],
            default: "Pending",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
            ],
            default: "Pending",
        },
        orderId: {
            type: String,
            default: "",
        },
        paymentId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);

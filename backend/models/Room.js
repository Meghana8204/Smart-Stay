const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      enum: [
        "Single",
        "Double",
        "Deluxe",
        "Suite",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
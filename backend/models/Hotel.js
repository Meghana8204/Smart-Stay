
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    pricePerNight: {
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

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // Facility stats for owner management
    totalRooms: {
      type: Number,
      default: 0,
    },
    availableRooms: {
      type: Number,
      default: 0,
    },
    bookedRooms: {
      type: Number,
      default: 0,
    },
    facilityUsage: {
      type: Map,
      of: Number, // e.g., { pool: 10, gym: 5 }
      default: {},
    },

    mapEmbed: {
      type: String,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    coordinates: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Hotel ||

  mongoose.model(
    "Hotel",
    hotelSchema
  );
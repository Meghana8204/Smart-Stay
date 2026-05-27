const Hotel = require("../models/Hotel");

const Room = require("../models/Room");

const Booking = require("../models/Booking");

const Review = require("../models/Review");

// ==============================
// Update Hotel Facility Stats
// ==============================
const updateHotelFacilityStats =
  async (req, res) => {

    try {

      const hotel =
        await Hotel.findById(
          req.params.id
        );

      if (!hotel) {

        return res.status(404).json({
          message:
            "Hotel not found",
        });
      }

      // Authorization
      if (
        hotel.owner.toString() !==
          req.user._id.toString() &&

        req.user.role !== "admin"
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      const {
        totalRooms,
        availableRooms,
        bookedRooms,
        facilityUsage,
      } = req.body;

      if (
        typeof totalRooms ===
        "number"
      ) {

        hotel.totalRooms =
          totalRooms;
      }

      if (
        typeof availableRooms ===
        "number"
      ) {

        hotel.availableRooms =
          availableRooms;
      }

      if (
        typeof bookedRooms ===
        "number"
      ) {

        hotel.bookedRooms =
          bookedRooms;
      }

      if (
        facilityUsage &&
        typeof facilityUsage ===
          "object"
      ) {

        hotel.facilityUsage =
          facilityUsage;
      }

      await hotel.save();

      res.status(200).json({
        success: true,

        message:
          "Facility stats updated",

        hotel,
      });

    } catch (error) {

          console.error("GET HOTELS ERROR:", error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Add Hotel
// ==============================
const addHotel =
  async (req, res) => {

    try {

      const {
        hotelName,
        type,
        description,
        location,
        address,
        pricePerNight,
        amenities,
        mapEmbed,
        email,
        ownerId,
      } = req.body;

      // Check email
      if (!email) {

        return res.status(400).json({
          message:
            "Hotel email required",
        });
      }

      // Duplicate email
      const existingHotel =
        await Hotel.findOne({
          email,
        });

      if (existingHotel) {

        return res.status(400).json({
          message:
            "Hotel email already exists",
        });
      }

      // Owner assignment
      const finalOwner =

        req.user.role ===
          "admin"

          ? ownerId

          : req.user._id;

      // One hotel per owner
      const ownerHotel =
        await Hotel.findOne({
          owner:
            finalOwner,
        });

      if (ownerHotel) {

        return res.status(400).json({
          message:
            "Owner already has a hotel",
        });
      }

      // Images
      let imageUrls = [];
      if (req.files) {
        const filesArray = Array.isArray(req.files) ? req.files : (req.files.images || []);
        imageUrls = filesArray.map((file) => file.path);
      } else if (req.file) {
        imageUrls = [req.file.path];
      }

      // Amenities
      const parsedAmenities =

        typeof amenities ===
        "string"

          ? amenities
              .split(",")
              .map((item) =>
                item.trim()
              )

          : amenities || [];

      // Create Hotel
      const hotel =
        await Hotel.create({

          hotelName,

          type,

          description,

          location,

          address,

          email,

          pricePerNight,

          amenities:
            parsedAmenities,

          images:
            imageUrls,

          owner:
            finalOwner,

          mapEmbed,
        });

      res.status(201).json({
        success: true,

        message:
          "Hotel added successfully",

        hotel,
      });

    } catch (error) {

      console.log(
        "ADD HOTEL ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

// ==============================
// Get All Hotels
// ==============================
const getHotels =
  async (req, res) => {

    try {

      const hotels =
        await Hotel.find()

          .populate(
            "owner",
            "name email"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        hotels,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Get My Hotels
// ==============================
const getMyHotels =
  async (req, res) => {

    try {

      let hotels = [];

      // Admin
      if (
        req.user.role ===
        "admin"
      ) {

        hotels =
          await Hotel.find()

            .populate(
              "owner",
              "name email"
            )

            .sort({
              createdAt: -1,
            });

      } else {

        // Owner
        hotels =
          await Hotel.find({
            owner:
              req.user._id,
          })

            .populate(
              "owner",
              "name email"
            )

            .sort({
              createdAt: -1,
            });
      }

      res.status(200).json({
        success: true,
        hotels,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Get Single Hotel
// ==============================
const getHotelById =
  async (req, res) => {

    try {

      const hotel =
        await Hotel.findById(
          req.params.id
        ).populate(
          "owner",
          "name email"
        );

      if (!hotel) {

        return res.status(404).json({
          message:
            "Hotel not found",
        });
      }

      const rooms =
        await Room.find({
          hotel:
            hotel._id,
        });

      res.status(200).json({
        success: true,
        hotel,
        rooms,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Search Hotels
// ==============================
const searchHotels =
  async (req, res) => {

    try {

      const {
        location,
        minPrice,
        maxPrice,
        amenities,
        minRating,
        hotelName,
      } = req.query;

      const query = {};

      // Location
      if (location) {

        query.location = {
          $regex:
            location,

          $options:
            "i",
        };
      }

      // Hotel name
      if (hotelName) {

        query.hotelName = {
          $regex:
            hotelName,

          $options:
            "i",
        };
      }

      // Price
      if (
        minPrice ||
        maxPrice
      ) {

        query.pricePerNight =
          {};

        if (minPrice) {

          query.pricePerNight.$gte =
            Number(minPrice);
        }

        if (maxPrice) {

          query.pricePerNight.$lte =
            Number(maxPrice);
        }
      }

      // Rating
      if (minRating) {

        query.rating = {
          $gte:
            Number(minRating),
        };
      }

      // Amenities
      if (amenities) {

        const amenityList =

          Array.isArray(
            amenities
          )

            ? amenities

            : amenities
                .split(",")
                .map((item) =>
                  item.trim()
                );

        query.amenities = {
          $all:
            amenityList.filter(
              Boolean
            ),
        };
      }

      const hotels =
        await Hotel.find(query)

          .populate(
            "owner",
            "name email"
          );

      res.status(200).json({
        success: true,
        hotels,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Update Hotel
// ==============================
const updateHotel =
  async (req, res) => {

    try {

      const hotel =
        await Hotel.findById(
          req.params.id
        );

      if (!hotel) {

        return res.status(404).json({
          message:
            "Hotel not found",
        });
      }

      // Authorization
      if (
        req.user.role !==
          "admin" &&

        hotel.owner.toString() !==
          req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "Not allowed",
        });
      }

      const fields = [
        "hotelName",
        "type",
        "description",
        "location",
        "address",
        "pricePerNight",
        "amenities",
        "mapEmbed",
      ];

      fields.forEach(
        (field) => {

          if (
            req.body[field] !==
            undefined
          ) {

            hotel[field] =

              field ===
                "amenities" &&

                typeof req.body[
                  field
                ] === "string"

                ? req.body[
                    field
                  ]
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )

                : req.body[
                    field
                  ];
          }
        }
      );

      // Images
      let newImageUrls = [];
      if (req.files) {
        const filesArray = Array.isArray(req.files) ? req.files : (req.files.images || []);
        newImageUrls = filesArray.map((file) => file.path);
      } else if (req.file) {
        newImageUrls = [req.file.path];
      }
      if (newImageUrls.length > 0) {
        hotel.images = newImageUrls;
      }

      await hotel.save();

      res.status(200).json({
        success: true,

        message:
          "Hotel updated successfully",

        hotel,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Delete Hotel
// ==============================
const deleteHotel =
  async (req, res) => {

    try {

      const hotel =
        await Hotel.findById(
          req.params.id
        );

      if (!hotel) {

        return res.status(404).json({
          message:
            "Hotel not found",
        });
      }

      // Authorization
      if (
        req.user.role !==
          "admin" &&

        hotel.owner.toString() !==
          req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "Not allowed",
        });
      }

      // Delete related data
      await Promise.all([

        Room.deleteMany({
          hotel:
            hotel._id,
        }),

        Booking.deleteMany({
          hotel:
            hotel._id,
        }),

        Review.deleteMany({
          hotel:
            hotel._id,
        }),
      ]);

      await hotel.deleteOne();

      res.status(200).json({
        success: true,

        message:
          "Hotel deleted successfully",
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
  addHotel,
  getHotels,
  getHotelById,
  getMyHotels,
  searchHotels,
  updateHotel,
  deleteHotel,
  updateHotelFacilityStats,
};
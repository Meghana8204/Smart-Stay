const Room =
  require("../models/Room");

const Booking =
  require("../models/Booking");

// ==============================
// Add Room
// ==============================
const addRoom =
  async (req, res) => {

    try {

      const {
        hotelId,
        roomNumber,
        roomType,
        price,
        capacity,
        amenities,
      } = req.body;

      const room =
        await Room.create({

          hotel:
            hotelId,

          roomNumber,

          roomType,

          price,

          capacity,

          amenities,
        });

      res.status(201).json({
        success: true,
        room,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Get Rooms By Hotel
// ==============================
const getRoomsByHotel =
  async (req, res) => {

    try {

      const rooms =
        await Room.find({
          hotel:
            req.params.hotelId,
        });

      res.status(200).json({
        success: true,
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
// Delete Room
// ==============================
const deleteRoom =
  async (req, res) => {

    try {

      await Room.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Room deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Update Availability
// ==============================
const updateRoomAvailability =
  async (req, res) => {

    try {

      const room =
        await Room.findById(
          req.params.id
        );

      if (!room) {

        return res.status(404).json({
          message:
            "Room not found",
        });
      }

      room.isAvailable =
        req.body.isAvailable;

      await room.save();

      res.status(200).json({
        success: true,
        room,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==============================
// Check Availability
// ==============================
const checkRoomAvailability =
  async (req, res) => {

    try {

      const {
        hotelId,
        checkInDate,
        checkOutDate,
        guests,
      } = req.query;

      if (!hotelId || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          message: "Missing parameters",
        });
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const query = { hotel: hotelId, isAvailable: true };
      if (guests) {
        query.capacity = { $gte: Number(guests) };
      }

      const rooms = await Room.find(query);
      const roomIds = rooms.map(room => room._id);

      const bookedRooms = await Booking.find({
        room: { $in: roomIds },
        bookingStatus: { $ne: "Cancelled" },
        $or: [
          {
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn },
          },
        ],
      }).distinct("room");

      const availableRooms = rooms.filter(
        room => !bookedRooms.some(
          bookedRoomId => bookedRoomId.toString() === room._id.toString()
        )
      );

      res.status(200).json({
        success: true,
        rooms: availableRooms,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  addRoom,
  getRoomsByHotel,
  checkRoomAvailability,
  updateRoomAvailability,
  deleteRoom,
};
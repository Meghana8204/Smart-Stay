import api from "./api";

// ==============================
// Add Room
// ==============================
export const addRoom =
  async (
    roomData,
    token
  ) => {

    const { data } =
      await api.post(
        "/rooms/add",
        roomData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// ==============================
// Get Rooms By Hotel
// ==============================
export const getRoomsByHotel =
  async (hotelId) => {

    const { data } =
      await api.get(
        `/rooms/hotel/${hotelId}`
      );

    return data;
};

// ==============================
// Delete Room
// ==============================
export const deleteRoom =
  async (
    roomId,
    token
  ) => {

    const { data } =
      await api.delete(
        `/rooms/${roomId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// ==============================
// Update Availability
// ==============================
export const updateRoomAvailability =
  async (
    roomId,
    isAvailable,
    token
  ) => {

    const { data } =
      await api.put(
        `/rooms/${roomId}/availability`,
        { isAvailable },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// ==============================
// Check Room Availability
// ==============================
export const checkRoomAvailability =
  async (
    hotelId,
    checkInDate,
    checkOutDate,
    guests
  ) => {

    const { data } =
      await api.get(
        `/rooms/availability`,
        {
          params: {
            hotelId,
            checkInDate,
            checkOutDate,
            guests,
          },
        }
      );

    return data;
};
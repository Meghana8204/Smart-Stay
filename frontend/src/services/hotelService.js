import api from "./api";

// ==============================
// Get All Hotels
// ==============================
export const getHotels =
  async () => {

    const { data } =
      await api.get("/hotels");

    return data;
};

// ==============================
// Get Single Hotel
// ==============================
export const getHotelById =
  async (id) => {

    const { data } =
      await api.get(
        `/hotels/${id}`
      );

    return data;
};

// ==============================
// Search Hotels
// ==============================
export const searchHotels =
  async (query) => {

    const { data } =
      await api.get(
        `/hotels/search?location=${query}`
      );

    return data;
};

// ==============================
// Add Hotel
// ==============================
export const addHotel =
  async (
    formData,
    token
  ) => {

    const { data } =
      await api.post(
        "/admin/hotels",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
};

// ==============================
// Get My Hotels
// ==============================
export const getMyHotels =
  async (token) => {

    const { data } =
      await api.get(
        "/hotels/my-hotels",
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
// Update Hotel
// ==============================
export const updateHotel =
  async (
    hotelId,
    formData,
    token
  ) => {

    const { data } =
      await api.put(
        `/hotels/${hotelId}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data;
};

// ==============================
// Delete Hotel
// ==============================
export const deleteHotel =
  async (
    hotelId,
    token
  ) => {

    const { data } =
      await api.delete(
        `/admin/hotels/${hotelId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};
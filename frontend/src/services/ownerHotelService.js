import api from "./api";

// ==============================
// Get Owner Hotel
// ==============================
export const getOwnerHotel =
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
// Update Owner Hotel
// ==============================
export const updateOwnerHotel =
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
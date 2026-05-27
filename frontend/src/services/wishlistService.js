import api from "./api";

// Add to wishlist
export const addToWishlist =
  async (
    hotelId,
    token
  ) => {

    const { data } =
      await api.post(
        "/wishlist/add",
        { hotelId },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// Get wishlist
export const getWishlist =
  async (token) => {

    const { data } =
      await api.get(
        "/wishlist/my-wishlist",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// Remove wishlist
export const removeWishlist =
  async (
    wishlistId,
    token
  ) => {

    const { data } =
      await api.delete(
        `/wishlist/remove/${wishlistId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};
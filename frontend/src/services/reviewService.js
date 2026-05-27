import api from "./api";


// Get hotel reviews
export const getHotelReviews = async (hotelId) => {
  const { data } = await api.get(`/reviews/hotel/${hotelId}`);
  return data;
};

// Add a review
export const addReview = async (hotelId, review, token) => {
  const { data } = await api.post(
    `/reviews/add`,
    { hotelId, ...review },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

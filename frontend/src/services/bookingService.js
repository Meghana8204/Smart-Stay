import api from "./api";



// Create booking
export const createBooking =
  async (
    bookingData,
    token
  ) => {

    const { data } =
      await api.post(
        "/bookings/book",
        bookingData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// Verify payment
export const verifyPayment =
  async (
    paymentData,
    token
  ) => {

    const { data } =
      await api.post(
        "/payments/verify-payment", // Update this to match your backend route exactly!
        paymentData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// Get my bookings
export const getMyBookings =
  async (token) => {

    const { data } =
      await api.get(
        "/bookings/my-bookings",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

// Download bill PDF
export const downloadBill =
  async (
    bookingId,
    token
  ) => {

    const response =
      await api.get(
        `/bookings/bill/${bookingId}`,
        {
          responseType:
            "blob",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

// Create Razorpay order
export const createPaymentOrder =
  async (
    paymentData,
    token
  ) => {

    const { data } =
      await api.post(
        "/payments/create-order",
        paymentData,
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
// Get Owner Bookings
// ==============================
export const getOwnerBookings =
  async (token) => {

    const { data } =
      await api.get(
        "/bookings/owner-bookings",
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
// Confirm Booking
// ==============================
export const confirmBooking =
  async (bookingId, token) => {

    const { data } =
      await api.put(
        `/bookings/confirm/${bookingId}`,
        {},
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
// Cancel / Reject Booking
// ==============================
export const cancelBooking =
  async (bookingId, token) => {

    const { data } =
      await api.put(
        `/bookings/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};
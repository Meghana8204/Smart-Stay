import api from "./api";

// ==============================
// Dashboard Stats
// ==============================
export const getDashboardStats = async (token) => {
  const { data } = await api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Get All Hotels
// ==============================
export const getAllHotels = async (token) => {
  const { data } = await api.get("/hotels", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Delete Hotel
// ==============================
export const deleteHotel = async (hotelId, token) => {
  const { data } = await api.delete(`/admin/hotels/${hotelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Get All Users
// ==============================
export const getAllUsers = async (token) => {
  const { data } = await api.get("/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Delete User
// ==============================
export const deleteUser = async (userId, token) => {
  const { data } = await api.delete(`/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Create Hotel Owner
// ==============================
export const createHotelOwner = async (ownerData, token) => {
  const { data } = await api.post("/admin/create-owner", ownerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// ==============================
// Get Owner Stats
// ==============================
export const getOwnerStats = async (token) => {
  const { data } = await api.get("/admin/owner-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

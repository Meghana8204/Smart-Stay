import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import Home from "./pages/Home";

import Auth from "./pages/Auth";

import Hotels from "./pages/Hotels";

import HotelDetails from "./pages/HotelDetails";

import NotFound from "./pages/NotFound";

import VerifyOTP from "./pages/VerifyOTP";

import Wishlist from "./pages/Wishlist";

import Profile from "./pages/Profile";

import Settings from "./pages/Settings";

import Bookings from "./pages/Bookings";

// Admin
import AdminLayout from "./layouts/AdminLayout";

import AdminDashboard from "./admin/AdminDashboard";

import AdminUsers from "./admin/AdminUsers";

import AdminHotels from "./admin/AdminHotels";

import CreateOwner from "./admin/CreateOwner";

// Owner
import OwnerLayout from "./layouts/OwnerLayout";

import OwnerDashboard from "./owner/OwnerDashboard";

import OwnerHotel from "./owner/OwnerHotel";

import OwnerRooms from "./owner/OwnerRooms";

import OwnerBookings from "./owner/OwnerBookings";

// ==============================
// App Content
// ==============================
function AppContent() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/owner");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div className="p-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />

          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route path="/hotels" element={<Hotels />} />

          <Route path="/hotel/:id" element={<HotelDetails />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/my-bookings" element={<Bookings />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />

            <Route path="hotels" element={<AdminHotels />} />

            <Route path="create-owner" element={<CreateOwner />} />
          </Route>

          <Route path="/owner" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />

            <Route path="hotels" element={<OwnerHotel />} />

            <Route path="rooms" element={<OwnerRooms />} />

            <Route path="bookings" element={<OwnerBookings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideNavbar && <Footer />}
    </>
  );
}

// ==============================
// Main App
// ==============================
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

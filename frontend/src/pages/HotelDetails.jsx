import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "../components/ReviewForm";
import { getHotelById } from "../services/hotelService";
import { getHotelReviews } from "../services/reviewService";
import { checkRoomAvailability } from "../services/roomService";
import { createBooking, createPaymentOrder, verifyPayment } from "../services/bookingService";
import { addToWishlist, getWishlist, removeWishlist } from "../services/wishlistService";
import toast from "react-hot-toast";

function HotelDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("rooms"); // rooms | reviews

  // ==============================
  // Data Fetching
  // ==============================
  const fetchData = async () => {
    try {
      const { hotel, rooms } = await getHotelById(id);
      setHotel(hotel);
      setAvailableRooms(rooms || []);

      const { reviews } = await getHotelReviews(id);
      setReviews(reviews || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    if (user?.token) {
      try {
        const data = await getWishlist(user.token);
        const wishlistItem = data.wishlist?.find(
          (item) => item.hotel?._id === id || item.hotel === id
        );
        if (wishlistItem) {
          setIsInWishlist(true);
          setWishlistItemId(wishlistItem._id);
        } else {
          setIsInWishlist(false);
          setWishlistItemId(null);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchWishlistStatus();
  }, [id, user]);

  // ==============================
  // Handlers
  // ==============================
  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      if (isInWishlist) {
        await removeWishlist(wishlistItemId, user.token);
        setIsInWishlist(false);
        setWishlistItemId(null);
      } else {
        await addToWishlist(id, user.token);
        setIsInWishlist(true);
        fetchWishlistStatus();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleCheckAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
      toast.error("Please select both a check-in and check-out date.");
        return;
      }
      setLoading(true);
      const data = await checkRoomAvailability(id, checkInDate, checkOutDate, Number(guests));
      setAvailableRooms(data.rooms || []);
      setActiveTab("rooms");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to check availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async (room) => {
    if (!user) {
      toast.error("Please login to book a room");
      navigate("/auth");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      toast.error("Please check availability first by selecting dates!");
      return;
    }

    setBookingLoading(room._id);
    try {
      // 1. Create the booking in the database first
      const bookingResponse = await createBooking({
        hotelId: hotel._id,
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guests: Number(guests)
      }, user.token);

      // 2. Create payment order for the newly created booking
      const orderData = await createPaymentOrder({
        bookingId: bookingResponse.booking._id
      }, user.token);

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        setBookingLoading("");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "YOUR_RAZORPAY_KEY", 
        amount: orderData.order.amount,
        currency: "INR",
        name: "SmartStay",
        description: `Booking for ${hotel.hotelName}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingResponse.booking._id,
            }, user.token);
            toast.success("Payment Successful! Your booking is pending owner confirmation.");
            navigate("/my-bookings");
          } catch (err) {
            console.log(err);
            toast.error("Payment Verification Failed");
          }
        },
        prefill: {
          name: user.user.name,
          email: user.user.email,
        },
        theme: { color: "#c9a96e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to initiate booking");
    } finally {
      setBookingLoading("");
    }
  };

  const nights = checkInDate && checkOutDate
    ? Math.max(0, Math.round((new Date(checkOutDate) - new Date(checkInDate)) / 86400000))
    : null;

  if (loading) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'); body{font-family:'Poppins',sans-serif;background:#f5f2ed}`}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: "1rem" }}>
        <div style={{ width: 42, height: 42, border: "3px solid #ede8de", borderTopColor: "#c9a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: "0.78rem", color: "#bbb", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading hotel…</p>
      </div>
    </>
  );

  if (!hotel) return <div style={{ textAlign: "center", padding: "5rem", fontFamily: "Poppins, sans-serif", color: "#999" }}>Hotel not found.</div>;

  const images = hotel.images?.length > 1 ? hotel.images : [hotel.images?.[0], hotel.images?.[0], hotel.images?.[0]];
  const fullStars = Math.round(hotel.rating || 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hd-root {
          font-family: 'Poppins', sans-serif;
          background: #f5f2ed;
          color: #1a1a1a;
          min-height: 100vh;
          padding-bottom: 6rem;
        }

        /* ── HERO ── */
        .hd-hero {
          position: relative;
          height: 70vh;
          min-height: 480px;
          overflow: hidden;
        }

        .hd-hero-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .hd-hero:hover .hd-hero-img { transform: scale(1.03); }

        .hd-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.75) 100%);
        }

        .hd-hero-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 2.5rem 3rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hd-hero-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #c9a96e;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        .hd-hero-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        .hd-hero-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.6rem;
        }

        .rating-stars { color: #c9a96e; font-size: 1rem; letter-spacing: 0.06em; }
        .rating-num { color: rgba(255,255,255,0.75); font-size: 0.8rem; font-weight: 500; }

        .hero-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.7rem;
        }

        .wishlist-btn {
          width: 50px; height: 50px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          cursor: pointer;
          transition: all 0.25s;
        }

        .wishlist-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.08); }
        .wishlist-btn.active { background: rgba(220,53,69,0.2); border-color: rgba(220,53,69,0.5); }

        /* ── BODY ── */
        .hd-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── INFO STRIP ── */
        .hd-strip {
          display: flex;
          gap: 0;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          margin-top: -2.5rem;
          position: relative;
          z-index: 10;
          overflow: hidden;
        }

        .strip-item {
          flex: 1;
          padding: 1.4rem 1.8rem;
          border-right: 1px solid #f0ebe2;
          text-align: center;
        }

        .strip-item:last-child { border-right: none; }

        .strip-key {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ccc;
          margin-bottom: 0.3rem;
        }

        .strip-val {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .strip-val.gold { color: #c9a96e; }

        /* ── SECTION TITLES ── */
        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.6rem;
        }

        .eyebrow-line { width: 28px; height: 2px; background: linear-gradient(90deg, #c9a96e, transparent); }

        .eyebrow-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a96e;
        }

        .section-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.15;
        }

        /* ── ABOUT ── */
        .hd-about {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 4rem;
          align-items: start;
        }

        .about-desc {
          color: #777;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.85;
          margin-top: 1.5rem;
        }

        /* Amenity pills */
        .amenity-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 1.5rem;
        }

        .amenity-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1rem;
          background: #fff;
          border: 1.5px solid #ede8de;
          border-radius: 100px;
          font-size: 0.76rem;
          font-weight: 600;
          color: #555;
          transition: all 0.2s;
        }

        .amenity-pill:hover { border-color: #c9a96e; color: #c9a96e; background: #fdf9f3; }

        /* Thumbnail strip */
        .thumb-strip {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .thumb-main {
          border-radius: 18px;
          overflow: hidden;
          aspect-ratio: 4/3;
        }

        .thumb-main img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .thumb-main:hover img { transform: scale(1.04); }

        .thumb-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.7rem;
        }

        .thumb-small {
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 4/3;
          cursor: pointer;
          outline: 2px solid transparent;
          transition: outline 0.2s;
        }

        .thumb-small.active { outline-color: #c9a96e; }

        .thumb-small img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }

        .thumb-small:hover img { transform: scale(1.06); }

        /* ── MAP ── */
        .map-container {
          width: 100%;
          height: 400px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          border: 1px solid #ede8de;
          background: #fff;
        }
        .map-container iframe {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
          display: block;
        }

        /* ── AVAILABILITY ── */
        .avail-card {
          background: #1a1714;
          border-radius: 24px;
          padding: 2.5rem;
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
        }

        .avail-card::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .avail-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .avail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 0.6fr auto;
          gap: 1rem;
          align-items: end;
        }

        .avail-field label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.4rem;
        }

        .avail-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          color-scheme: dark;
        }

        .avail-input:focus { border-color: #c9a96e; }

        .avail-btn {
          padding: 0.77rem 1.8rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(201,169,110,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }

        .avail-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .nights-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.2rem;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.25);
          border-radius: 100px;
          padding: 0.3rem 0.85rem;
          color: #c9a96e;
          font-size: 0.73rem;
          font-weight: 600;
        }

        /* ── TABS ── */
        .hd-tabs {
          display: flex;
          gap: 0.5rem;
          margin-top: 4rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #ede8de;
          padding-bottom: 0;
        }

        .tab-btn {
          padding: 0.65rem 1.5rem;
          border: none;
          background: transparent;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #bbb;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .tab-btn.active { color: #1a1a1a; border-bottom-color: #c9a96e; }
        .tab-btn:hover:not(.active) { color: #888; }

        /* ── ROOM CARDS ── */
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
        }

        .room-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          transition: transform 0.25s, box-shadow 0.25s;
          animation: cardIn 0.4s ease both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .room-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }

        .room-img-wrap {
          position: relative;
          height: 190px;
          overflow: hidden;
        }

        .room-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.55s ease;
        }

        .room-card:hover .room-img { transform: scale(1.07); }

        .room-capacity-badge {
          position: absolute;
          top: 0.75rem; right: 0.75rem;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 0.3rem 0.7rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .room-body { padding: 1.4rem; }

        .room-type {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.2rem;
        }

        .room-number {
          font-size: 0.72rem;
          color: #bbb;
          font-weight: 500;
          letter-spacing: 0.06em;
          margin-bottom: 0.8rem;
        }

        .room-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.1rem;
        }

        .room-amenity {
          padding: 0.25rem 0.65rem;
          background: #f5f2ed;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 600;
          color: #888;
          border: 1px solid #ede8de;
        }

        .room-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f0ebe2;
        }

        .room-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .room-price span {
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          color: #bbb;
          font-weight: 400;
        }

        .book-btn {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(201,169,110,0.35);
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }

        .book-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .book-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .nights-price {
          font-size: 0.7rem;
          color: #c9a96e;
          font-weight: 600;
          margin-top: 0.15rem;
        }

        /* ── REVIEWS ── */
        .review-card {
          background: #fff;
          border-radius: 18px;
          padding: 1.6rem;
          border: 1px solid #ede8de;
          margin-bottom: 1rem;
          transition: box-shadow 0.2s;
          animation: cardIn 0.4s ease both;
        }

        .review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        .review-header {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 0.8rem;
        }

        .review-avatar {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }

        .review-name {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1a1a1a;
        }

        .review-stars { color: #c9a96e; font-size: 0.85rem; letter-spacing: 0.05em; }

        .review-comment {
          font-size: 0.85rem;
          color: #777;
          font-weight: 300;
          line-height: 1.75;
        }

        .review-form-card {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid #ede8de;
          margin-top: 2rem;
        }

        .review-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1.4rem;
        }

        /* ── EMPTY ── */
        .empty-rooms {
          grid-column: span 3;
          text-align: center;
          padding: 4rem 2rem;
          background: #fff;
          border-radius: 20px;
          border: 2px dashed #ede8de;
          color: #bbb;
          font-size: 0.88rem;
        }

        .empty-rooms span { display: block; font-size: 2.5rem; margin-bottom: 0.8rem; opacity: 0.4; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hd-hero-bottom { padding: 1.5rem; }
          .hd-strip { flex-wrap: wrap; }
          .strip-item { min-width: 45%; }
          .hd-about { grid-template-columns: 1fr; }
          .thumb-strip { display: none; }
          .avail-grid { grid-template-columns: 1fr 1fr; }
          .avail-btn { grid-column: span 2; }
          .rooms-grid { grid-template-columns: repeat(2, 1fr); }
          .empty-rooms { grid-column: span 2; }
        }

        @media (max-width: 580px) {
          .hd-hero { height: 55vh; }
          .hd-hero-name { font-size: 1.8rem; }
          .hd-strip { flex-direction: column; }
          .strip-item { border-right: none; border-bottom: 1px solid #f0ebe2; }
          .strip-item:last-child { border-bottom: none; }
          .avail-grid { grid-template-columns: 1fr; }
          .avail-btn { grid-column: span 1; }
          .rooms-grid { grid-template-columns: 1fr; }
          .map-container { height: 300px; }
          .empty-rooms { grid-column: span 1; }
          .hd-body { padding: 0 1rem; }
          .avail-card { padding: 1.5rem; }
        }
      `}</style>

      <div className="hd-root">

        {/* ── HERO ── */}
        <div className="hd-hero">
          <img
            className="hd-hero-img"
            src={hotel.images?.[activeImg] || hotel.images?.[0]}
            alt={hotel.hotelName}
          />
          <div className="hd-hero-overlay" />
          <div className="hd-hero-bottom">
            <div>
              <div className="hd-hero-location">
                <span>📍</span> {hotel.location}
              </div>
              <h1 className="hd-hero-name">{hotel.hotelName}</h1>
              <div className="hd-hero-rating">
                <span className="rating-stars">
                  {"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}
                </span>
                <span className="rating-num">({hotel.rating?.toFixed(1)}/5 · {reviews.length} reviews)</span>
              </div>
            </div>
            <div className="hero-actions">
              <button
                onClick={handleWishlist}
                className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isInWishlist ? "❤️" : "♡"}
              </button>
            </div>
          </div>
        </div>

        <div className="hd-body">

          {/* ── INFO STRIP ── */}
          <div className="hd-strip">
            <div className="strip-item">
              <div className="strip-key">Location</div>
              <div className="strip-val">{hotel.location?.split(",").pop().trim() || hotel.location}</div>
            </div>
            <div className="strip-item">
              <div className="strip-key">Rating</div>
              <div className="strip-val gold">★ {hotel.rating?.toFixed(1)}</div>
            </div>
            <div className="strip-item">
              <div className="strip-key">Rooms Available</div>
              <div className="strip-val">{availableRooms.length}</div>
            </div>
            <div className="strip-item">
              <div className="strip-key">Starting From</div>
              <div className="strip-val gold">
                {availableRooms.length > 0 
                  ? `₹${Math.min(...availableRooms.map(r => r.price)).toLocaleString()}/night`
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* ── ABOUT ── */}
          <div className="hd-about">
            <div>
              <div className="section-eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">About This Hotel</span>
              </div>
              <h2 className="section-h2">A sanctuary of<br /><em style={{ fontStyle: "italic", color: "#c9a96e" }}>timeless luxury</em></h2>
              <p className="about-desc">{hotel.description}</p>

              <div style={{ marginTop: "2rem" }}>
                <div className="section-eyebrow">
                  <div className="eyebrow-line" />
                  <span className="eyebrow-text">Amenities & Services</span>
                </div>
                <div className="amenity-grid">
                  {hotel.amenities?.map((item, i) => (
                    <span className="amenity-pill" key={i}>✦ {item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="thumb-strip">
              <div className="thumb-main">
                <img src={images[activeImg] || images[0]} alt="Hotel main" />
              </div>
              <div className="thumb-row">
                {images.slice(0, 3).map((img, i) => (
                  <div
                    key={i}
                    className={`thumb-small ${activeImg === i ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── MAP EMBED ── */}
          {hotel.mapEmbed && (
            <div className="hd-map" style={{ marginTop: "4rem" }}>
              <div className="section-eyebrow">
                <div className="eyebrow-line" />
                <span className="eyebrow-text">Location</span>
              </div>
              <h2 className="section-h2" style={{ marginBottom: "1.5rem" }}>Explore the <em>neighborhood</em></h2>
              <div 
                className="map-container"
                dangerouslySetInnerHTML={{ __html: hotel.mapEmbed }} 
              />
            </div>
          )}

          {/* ── AVAILABILITY ── */}
          <div className="avail-card">
            <div className="avail-title">Check Room Availability</div>
            <div className="avail-grid">
              <div className="avail-field">
                <label>Check-in Date</label>
                <input
                  type="date"
                  className="avail-input"
                  value={checkInDate}
                  onChange={e => setCheckInDate(e.target.value)}
                />
              </div>
              <div className="avail-field">
                <label>Check-out Date</label>
                <input
                  type="date"
                  className="avail-input"
                  value={checkOutDate}
                  onChange={e => setCheckOutDate(e.target.value)}
                />
              </div>
              <div className="avail-field">
                <label>Guests</label>
                <input
                  type="number"
                  min="1"
                  className="avail-input"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                />
              </div>
              <button className="avail-btn" onClick={handleCheckAvailability}>
                Search Rooms
              </button>
            </div>
            {nights > 0 && (
              <div className="nights-tag">
                ✦ {nights} night{nights > 1 ? "s" : ""} selected
              </div>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="hd-tabs">
            <button
              className={`tab-btn ${activeTab === "rooms" ? "active" : ""}`}
              onClick={() => setActiveTab("rooms")}
            >
              Available Rooms ({availableRooms.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Guest Reviews ({reviews.length})
            </button>
          </div>

          {/* ── ROOMS ── */}
          {activeTab === "rooms" && (
            <div className="rooms-grid">
              {availableRooms.length > 0 ? availableRooms.map((room, i) => {
                const totalPrice = nights ? room.price * nights : null;
                return (
                  <div className="room-card" key={room._id} style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="room-img-wrap">
                      <img
                        className="room-img"
                        src={room.images?.[0] || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"}
                        alt={room.roomType}
                        loading="lazy"
                      />
                      <div className="room-capacity-badge">👤 Max {room.capacity}</div>
                    </div>
                    <div className="room-body">
                      <div className="room-type">{room.roomType}</div>
                      <div className="room-number">Room #{room.roomNumber}</div>
                      <div className="room-amenities">
                        {room.amenities?.map((a, j) => (
                          <span className="room-amenity" key={j}>{a}</span>
                        ))}
                      </div>
                      <div className="room-footer">
                        <div>
                          <div className="room-price">
                            ₹{room.price.toLocaleString()} <span>/night</span>
                          </div>
                          {totalPrice && (
                            <div className="nights-price">₹{totalPrice.toLocaleString()} for {nights} nights</div>
                          )}
                        </div>
                        <button
                          className="book-btn"
                          onClick={() => handleBooking(room)}
                          disabled={bookingLoading === room._id}
                        >
                          {bookingLoading === room._id
                            ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Booking…</>
                            : "Book Now →"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="empty-rooms">
                  <span>🛏</span>
                  No rooms available for the selected dates.<br />Try adjusting your dates above.
                </div>
              )}
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <div>
              {reviews.map((review, i) => (
                <div className="review-card" key={review._id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="review-header">
                    <div className="review-avatar">
                      {review.user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="review-name">{review.user?.name}</div>
                      <div className="review-stars">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}

              {user && (
                <div className="review-form-card">
                  <div className="review-form-title">Share Your Experience</div>
                  <ReviewForm hotelId={hotel?._id} onReviewAdded={fetchData} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

export default HotelDetails;
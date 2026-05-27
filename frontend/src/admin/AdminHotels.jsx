import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllHotels, deleteHotel, getAllUsers } from "../services/adminService";
import { addHotel } from "../services/hotelService";
import toast from "react-hot-toast";

const INITIAL_FORM = {
  hotelName: "", type: "Hotel", location: "", address: "",
  description: "", amenities: "", pricePerNight: "",
  mapEmbed: "", email: "", ownerId: "",
};

const iStyle = {
  fontFamily: "'Poppins',sans-serif", fontSize: 13,
  border: "1.5px solid #e8ecf0", borderRadius: 10,
  padding: "11px 14px", outline: "none", color: "#1a2332",
  background: "#fafbfc", width: "100%", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const Field = ({ label, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    <label style={{ fontSize:11, fontWeight:600, color:"#8B9EA8", letterSpacing:"0.08em", textTransform:"uppercase" }}>
      {label}
    </label>
    {children}
  </div>
);

const TYPE_COLOR = { 
  Hotel: "#C9A96E", 
  Resort: "#5D8AA8", 
  Villa: "#7A9E7E",
  Boutique: "#D4A553",
  Hostel: "#707B7C",
  Eco: "#45B39D",
  Luxury: "#8E44AD"
};

function AdminHotels() {
  const { user } = useAuth();
  const [owners, setOwners]       = useState([]);
  const [hotels, setHotels]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [images, setImages]       = useState([]);
  const [formData, setFormData]   = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── FIX: depend on the primitive token, not the user object ──────────────
  const fetchHotels = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await getAllHotels(user.token);
      setHotels(data.hotels ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  const fetchOwners = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await getAllUsers(user.token);
      setOwners((data.users || []).filter((u) => u.role === "hotelOwner" || u.role === "owner"));
    } catch (err) {
      console.error(err);
    }
  }, [user?.token]);

  useEffect(() => { fetchHotels(); fetchOwners(); }, [fetchHotels, fetchOwners]);

  const handleToggleForm = () => {
    if (!showForm) {
      setFormData(INITIAL_FORM);
      setImages([]);
    }
    setShowForm((v) => !v);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) {
      toast.error("Please select at least one image");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) fd.append(k, v); });
      images.forEach((img) => fd.append("images", img));
      await addHotel(fd, user.token);
      toast.success("Hotel added successfully");
      setFormData(INITIAL_FORM);
      setImages([]);
      setShowForm(false);
      fetchHotels();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Hotel creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    setDeletingId(id);
    try {
      await deleteHotel(id, user.token);
      setHotels((p) => p.filter((h) => h._id !== id));
      toast.success("Hotel deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete hotel");
    } finally {
      setDeletingId(null);
    }
  };

  const imgSrc = (hotel) => {
    const img = hotel?.images?.[0];
    if (!img) return "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop";
    return img.startsWith("http") ? img : `http://localhost:5000${img}`;
  };

  if (loading) return (
    <div style={{ fontFamily:"'Poppins',sans-serif", display:"flex", alignItems:"center", gap:10, color:"#8B9EA8", padding:40 }}>
      <span style={{ fontSize:22, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Loading hotels…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

        .ah-root { font-family:'Poppins',sans-serif; color:#1a2332; display:flex; flex-direction:column; gap:28px; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

        /* header */
        .ah-header { display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:14px; }
        .ah-title  { font-size:28px; font-weight:800; letter-spacing:-0.5px; line-height:1.1; }
        .ah-sub    { font-size:13px; color:#8B9EA8; margin-top:4px; }
        .ah-gold   { display:block; width:36px; height:3px; background:#C9A96E; border-radius:2px; margin-top:8px; }

        /* add btn */
        .ah-add-btn {
          background:#1a2332; color:#C9A96E; border:none;
          font-family:'Poppins',sans-serif; font-size:13px; font-weight:600;
          padding:11px 22px; border-radius:12px; cursor:pointer;
          display:flex; align-items:center; gap:8px; transition:all 0.2s;
        }
        .ah-add-btn:hover    { background:#C9A96E; color:#1a2332; }
        .ah-add-btn.is-close { background:#f0f3f7; color:#5a6a7a; }
        .ah-add-btn.is-close:hover { background:#e2e7ed; color:#1a2332; }

        /* form */
        .ah-form-wrap {
          background:#fff; border-radius:18px; padding:30px;
          box-shadow:0 8px 40px rgba(44,62,80,0.10);
          border-top:4px solid #C9A96E;
          animation:slideDown 0.3s ease;
        }
        .ah-form-title { font-size:16px; font-weight:700; margin-bottom:22px; }
        .ah-form-grid  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .ah-full       { grid-column:1/-1; }

        .ah-submit {
          background:#1a2332; color:#C9A96E; border:none;
          font-family:'Poppins',sans-serif; font-size:14px; font-weight:600;
          padding:13px; border-radius:12px; cursor:pointer; width:100%;
          transition:all 0.2s; letter-spacing:0.3px;
        }
        .ah-submit:hover:not(:disabled) { background:#C9A96E; color:#1a2332; }
        .ah-submit:disabled { opacity:0.55; cursor:not-allowed; }

        input:focus, select:focus, textarea:focus {
          border-color:#C9A96E !important; background:#fff !important;
          box-shadow:0 0 0 3px rgba(201,169,110,0.12) !important;
        }

        /* cards grid */
        .ah-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }

        .ah-card {
          background:#fff; border-radius:16px; overflow:hidden;
          box-shadow:0 4px 20px rgba(44,62,80,0.08);
          transition:transform 0.25s, box-shadow 0.25s;
          animation:fadeUp 0.45s ease both;
        }
        .ah-card:hover { transform:translateY(-5px); box-shadow:0 14px 40px rgba(44,62,80,0.13); }

        .ah-img-wrap { overflow:hidden; position:relative; }
        .ah-img-wrap img { width:100%; height:200px; object-fit:cover; display:block; transition:transform 0.45s; }
        .ah-card:hover .ah-img-wrap img { transform:scale(1.06); }

        .ah-type-badge {
          position:absolute; top:12px; left:12px;
          font-family:'Poppins',sans-serif; font-size:10px; font-weight:700;
          color:#fff; padding:4px 10px; border-radius:20px;
          letter-spacing:0.5px; text-transform:uppercase;
        }

        .ah-amenity {
          background:#f0f3f7; color:#4a5a6a;
          font-size:10.5px; font-weight:500;
          padding:4px 10px; border-radius:20px; white-space:nowrap;
        }

        .ah-del-btn {
          background:#fff0f0; color:#c0392b;
          border:1.5px solid #fccac7;
          font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
          padding:8px 16px; border-radius:8px; cursor:pointer; transition:all 0.2s;
        }
        .ah-del-btn:hover:not(:disabled) { background:#c0392b; color:#fff; border-color:#c0392b; }
        .ah-del-btn:disabled { opacity:0.5; cursor:not-allowed; }

        /* empty state */
        .ah-empty {
          text-align:center; padding:80px 20px;
          background:#fff; border-radius:18px;
          box-shadow:0 4px 20px rgba(44,62,80,0.06);
        }

        /* responsive */
        @media (max-width:1050px) { .ah-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:700px)  {
          .ah-grid { grid-template-columns:1fr; }
          .ah-form-grid { grid-template-columns:1fr; }
          .ah-title { font-size:22px; }
        }
      `}</style>

      <div className="ah-root">

        {/* Header */}
        <div className="ah-header">
          <div>
            <h1 className="ah-title">Hotels</h1>
            <p className="ah-sub">{hotels.length} propert{hotels.length === 1 ? "y" : "ies"} registered</p>
            <span className="ah-gold" />
          </div>
          <button
            className={`ah-add-btn${showForm ? " is-close" : ""}`}
            onClick={handleToggleForm}
          >
            {showForm ? "✕ Close" : "+ Add Hotel"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="ah-form-wrap">
            <p className="ah-form-title">🏨 New Hotel Details</p>
            <form onSubmit={handleSubmit}>
              <div className="ah-form-grid">

                <Field label="Hotel Name">
                  <input style={iStyle} type="text" name="hotelName" placeholder="Grand Palace Hotel"
                    required value={formData.hotelName} onChange={handleChange} />
                </Field>

                <Field label="Type">
                  <select style={iStyle} name="type" value={formData.type} onChange={handleChange} required>
                    <option value="Hotel">🏨 Hotel</option>
                    <option value="Resort">🌴 Resort</option>
                    <option value="Villa">🏡 Villa</option>
                    <option value="Boutique">✨ Boutique</option>
                    <option value="Hostel">🛏️ Hostel</option>
                    <option value="Eco">🌿 Eco Stay</option>
                    <option value="Luxury">💎 Luxury</option>
                  </select>
                </Field>

                <Field label="Location">
                  <input style={iStyle} type="text" name="location" placeholder="Mumbai, India"
                    required value={formData.location} onChange={handleChange} />
                </Field>

                <Field label="Full Address">
                  <input style={iStyle} type="text" name="address" placeholder="123 Marine Drive"
                    required value={formData.address} onChange={handleChange} />
                </Field>

                <Field label="Assign Owner (Linked Login)">
                  <select style={iStyle} name="ownerId" value={formData.ownerId} onChange={(e) => {
                    const selectedOwner = owners.find(o => o._id === e.target.value);
                    setFormData(p => ({ ...p, ownerId: e.target.value, email: selectedOwner ? selectedOwner.email : "" }));
                  }} required>
                    <option value="">-- Select Owner --</option>
                    {owners.map((o) => (
                      <option key={o._id} value={o._id}>{o.name} ({o.email})</option>
                    ))}
                  </select>
                </Field>

                <Field label="Price Per Night (₹)">
                  <input style={iStyle} type="number" name="pricePerNight" placeholder="4500"
                    required value={formData.pricePerNight} onChange={handleChange} />
                </Field>

                <Field label="Amenities (comma separated)">
                  <input style={iStyle} type="text" name="amenities" placeholder="WiFi, Pool, Spa"
                    required value={formData.amenities} onChange={handleChange} />
                </Field>

                <div className="ah-full">
                  <Field label="Description">
                    <textarea style={{ ...iStyle, resize:"vertical" }} name="description"
                      placeholder="Describe the property…" rows={4}
                      required value={formData.description} onChange={handleChange} />
                  </Field>
                </div>

                <div className="ah-full">
                  <Field label="Google Maps Embed (optional)">
                    <textarea style={{ ...iStyle, resize:"vertical" }} name="mapEmbed"
                      placeholder="<iframe src='...'></iframe>" rows={3}
                      value={formData.mapEmbed} onChange={handleChange} />
                  </Field>
                </div>

                <div className="ah-full">
                  <Field label="Property Images">
                    <input style={{ ...iStyle, cursor:"pointer" }} type="file" multiple required
                      accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
                    {images.length > 0 && (
                      <span style={{ fontSize:11, color:"#C9A96E", fontWeight:600, marginTop:4 }}>
                        ✓ {images.length} image{images.length > 1 ? "s" : ""} selected
                      </span>
                    )}
                  </Field>
                </div>

                <div className="ah-full" style={{ marginTop:4 }}>
                  <button className="ah-submit" type="submit" disabled={submitting}>
                    {submitting ? "Creating…" : "Create Hotel"}
                  </button>
                </div>

              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        {hotels.length === 0 ? (
          <div className="ah-empty">
            <div style={{ fontSize:48, marginBottom:14 }}>🏨</div>
            <p style={{ fontSize:16, fontWeight:600 }}>No hotels yet</p>
            <p style={{ fontSize:13, color:"#8B9EA8", marginTop:6 }}>Click "Add Hotel" to register your first property.</p>
          </div>
        ) : (
          <div className="ah-grid">
            {hotels.map((hotel, i) => (
              <div className="ah-card" key={hotel._id} style={{ animationDelay:`${i * 0.06}s` }}>
                <div className="ah-img-wrap">
                  <img src={imgSrc(hotel)} alt={hotel.hotelName} />
                  <span className="ah-type-badge" style={{ background: TYPE_COLOR[hotel.type] || "#C9A96E" }}>
                    {hotel.type}
                  </span>
                </div>

                <div style={{ padding:"20px 20px 22px" }}>
                  <h2 style={{ fontSize:17, fontWeight:700, lineHeight:1.3, marginBottom:4 }}>{hotel.hotelName}</h2>
                  <p style={{ fontSize:12, color:"#8B9EA8", fontWeight:500, marginBottom:10 }}>📍 {hotel.location}</p>
                  <p style={{
                    fontSize:12.5, color:"#5a6a7a", lineHeight:1.6, marginBottom:14,
                    display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
                  }}>{hotel.description}</p>

                  {hotel.amenities?.length > 0 && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                      {hotel.amenities.slice(0, 4).map((a, idx) => (
                        <span key={idx} className="ah-amenity">{a}</span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="ah-amenity">+{hotel.amenities.length - 4} more</span>
                      )}
                    </div>
                  )}

                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div>
                      <span style={{ fontSize:11, color:"#8B9EA8", fontWeight:500 }}>per night</span>
                      <p style={{ fontSize:20, fontWeight:800, color:"#C9A96E", letterSpacing:"-0.5px" }}>
                        ₹ {Number(hotel.pricePerNight).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button className="ah-del-btn" onClick={() => handleDelete(hotel._id)}
                      disabled={deletingId === hotel._id}>
                      {deletingId === hotel._id ? "Deleting…" : "🗑 Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}

export default AdminHotels;
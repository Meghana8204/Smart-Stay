import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyHotels } from "../services/hotelService";
import { getHotelReviews } from "../services/reviewService";
import api from "../services/api";
import toast from "react-hot-toast";

const NAVY = "#1a3c5e";
const GOLD = "#d4a553";

const S = {
  root: {
    fontFamily: "'Poppins', sans-serif",
    padding: "2rem",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  // ── Header ──
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "12px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "14px" },
  headerIconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "13px",
    background: NAVY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },
  headerTitle: { fontSize: "24px", fontWeight: 700, color: NAVY },
  headerSub: { fontSize: "12px", color: "#6b7a8d", marginTop: "2px" },
  btnEdit: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    padding: "10px 22px",
    borderRadius: "10px",
    border: "none",
    background: NAVY,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "opacity 0.15s",
  },

  // ── Card wrapper ──
  card: {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 2px 16px rgba(26,60,94,0.09)",
    border: "1px solid #e8edf3",
    overflow: "hidden",
  },

  // ── Hero image strip ──
  heroWrap: { position: "relative", height: "300px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(26,60,94,0.7) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  heroBadge: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "rgba(255,255,255,0.92)",
    color: NAVY,
    fontSize: "11px",
    fontWeight: 700,
    padding: "5px 14px",
    borderRadius: "20px",
    letterSpacing: "0.05em",
    fontFamily: "'Poppins', sans-serif",
  },
  heroBottom: {
    position: "absolute",
    bottom: "18px",
    left: "22px",
    right: "22px",
  },
  heroHotelName: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.2,
  },
  heroLocation: { fontSize: "13px", color: "rgba(255,255,255,0.8)", marginTop: "4px" },

  // ── Detail body ──
  detailBody: { padding: "24px 26px" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },
  infoItem: {
    background: "#f4f7fb",
    borderRadius: "12px",
    padding: "14px 16px",
  },
  infoLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a0aab4",
    fontWeight: 500,
  },
  infoVal: { fontSize: "14px", fontWeight: 600, color: "#1e2d3d", marginTop: "4px" },
  infoValPrice: { fontSize: "16px", fontWeight: 700, color: NAVY, marginTop: "4px" },
  infoValRating: { fontSize: "14px", fontWeight: 600, color: "#b45309", marginTop: "4px" },

  // ── Stars ──
  starsRow: { display: "flex", gap: "3px", marginTop: "5px" },
  star: (filled) => ({ color: filled ? GOLD : "#dde2ea", fontSize: "16px" }),

  // ── Amenities ──
  amenitiesWrap: { marginBottom: "20px" },
  amenitiesList: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" },
  amenityTag: {
    fontSize: "12px",
    fontWeight: 500,
    padding: "5px 14px",
    borderRadius: "20px",
    background: "#eef2f8",
    color: NAVY,
    border: "1px solid #dde6f0",
    fontFamily: "'Poppins', sans-serif",
  },

  // ── Section divider ──
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: NAVY,
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionLine: {
    height: "3px",
    width: "28px",
    background: GOLD,
    borderRadius: "2px",
    marginBottom: "14px",
  },
  divider: { borderTop: "1px solid #f0f3f7", margin: "22px 0" },

  // ── Description ──
  descText: {
    fontSize: "14px",
    color: "#4a5568",
    lineHeight: 1.8,
    whiteSpace: "pre-wrap",
  },

  // ── Map ──
  mapWrap: {
    width: "100%",
    height: "280px",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #e8edf3",
  },

  // ── Reviews ──
  reviewCard: {
    background: "#f8fafc",
    border: "1px solid #e8edf3",
    borderRadius: "14px",
    padding: "16px 18px",
    marginBottom: "12px",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  reviewAvatar: (bg) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    color: NAVY,
    flexShrink: 0,
    fontFamily: "'Poppins', sans-serif",
  }),
  reviewName: { fontSize: "13px", fontWeight: 600, color: "#1e2d3d" },
  reviewDate: { fontSize: "11px", color: "#a0aab4" },
  reviewComment: { fontSize: "13px", color: "#4a5568", lineHeight: 1.7 },
  noReviews: { fontSize: "14px", color: "#a0aab4", textAlign: "center", padding: "2rem 0" },

  // ── Edit Form ──
  formCard: {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 2px 16px rgba(26,60,94,0.09)",
    border: "1px solid #e8edf3",
    padding: "28px 30px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
    marginBottom: "14px",
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "5px" },
  fieldLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7a8d",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dde2ea",
    outline: "none",
    color: "#1e2d3d",
    background: "#fafbfc",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  textarea: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid #dde2ea",
    outline: "none",
    color: "#1e2d3d",
    background: "#fafbfc",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: 1.7,
    transition: "border-color 0.15s",
  },
  fileInput: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px dashed #c0ccd8",
    background: "#f7f9fc",
    width: "100%",
    boxSizing: "border-box",
    color: "#6b7a8d",
    cursor: "pointer",
  },
  formActions: { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" },
  btnSave: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    padding: "11px 26px",
    borderRadius: "10px",
    border: "none",
    background: NAVY,
    color: "#fff",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  btnCancel: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    padding: "11px 26px",
    borderRadius: "10px",
    border: "1.5px solid #dde2ea",
    background: "#fff",
    color: "#5a6475",
    cursor: "pointer",
    transition: "background 0.15s",
  },

  // ── Loading / Empty ──
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #f5e6c8",
    borderTop: `4px solid ${GOLD}`,
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: { fontSize: "14px", color: "#8a96a3", fontWeight: 500 },
  emptyCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(26,60,94,0.08)",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "12px" },
  emptyTitle: { fontSize: "18px", fontWeight: 700, color: "#c0392b", marginBottom: "8px" },
  emptyText: { fontSize: "14px", color: "#6b7a8d" },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#dbeafe","#dcfce7","#fef9c3","#fce7f3","#ede9fe","#ffedd5","#ccfbf1"];
function avatarBg(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function Stars({ rating }) {
  return (
    <div style={S.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={S.star(n <= Math.round(rating))}>★</span>
      ))}
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", as, rows = 3, children }) {
  const baseStyle = as === "textarea" ? S.textarea : S.input;
  return (
    <div style={S.fieldWrap}>
      <label style={S.fieldLabel}>{label}</label>
      {as === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} rows={rows} style={baseStyle} />
      ) : as === "select" ? (
        <select name={name} value={value} onChange={onChange} style={baseStyle}>{children}</select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} style={baseStyle} />
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function OwnerHotel() {
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    hotelName: "", type: "Hotel", location: "", address: "",
    description: "", amenities: "", pricePerNight: "", mapEmbed: "",
  });

  const fetchHotel = async () => {
    try {
      const data = await getMyHotels(user.token);
      if (data.hotels?.length > 0) {
        const h = data.hotels[0];
        setHotel(h);
        setFormData({
          hotelName: h.hotelName || "",
          type: h.type || "Hotel",
          location: h.location || "",
          address: h.address || "",
          description: h.description || "",
          amenities: Array.isArray(h.amenities) ? h.amenities.join(", ") : "",
          pricePerNight: h.pricePerNight || "",
          mapEmbed: h.mapEmbed || "",
        });
        const reviewData = await getHotelReviews(h._id);
        setReviews(reviewData.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.token) fetchHotel(); }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const hotelForm = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v) hotelForm.append(k, v); });
      images.forEach((img) => hotelForm.append("images", img));
      await api.put(`/hotels/${hotel._id}`, hotelForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Hotel updated successfully!");
      setIsEditing(false);
      setImages([]);
      fetchHotel();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update hotel");
    } finally {
      setSaving(false);
    }
  };

  const imgSrc =
    hotel?.images?.[0]
      ? hotel.images[0].startsWith("http")
        ? hotel.images[0]
        : `http://localhost:5000${hotel.images[0]}`
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80";

  // ── Loading ──
  if (loading) {
    return (
      <>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ ...S.root, ...S.loadingWrap }}>
          <div style={S.spinner} />
          <div style={S.loadingText}>Loading your hotel…</div>
        </div>
      </>
    );
  }

  // ── No hotel ──
  if (!hotel) {
    return (
      <div style={S.root}>
        <div style={S.emptyCard}>
          <div style={S.emptyIcon}>🏨</div>
          <div style={S.emptyTitle}>No Hotel Assigned</div>
          <div style={S.emptyText}>
            You have not been assigned a hotel yet. Please contact the administrator.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus,textarea:focus,select:focus{border-color:${NAVY}!important;box-shadow:0 0 0 3px rgba(26,60,94,0.08)}
      `}</style>

      <div style={S.root}>

        {/* ── Top bar ── */}
        <div style={S.topBar}>
          <div style={S.headerLeft}>
            <div style={S.headerIconWrap}>🏨</div>
            <div>
              <div style={S.headerTitle}>My Hotel</div>
              <div style={S.headerSub}>Manage your property details</div>
            </div>
          </div>
          {!isEditing && (
            <button
              style={S.btnEdit}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Hotel
            </button>
          )}
        </div>

        {/* ════════════════════ EDIT FORM ════════════════════ */}
        {isEditing ? (
          <div style={S.formCard}>
            <div style={{ ...S.sectionTitle, marginBottom: "4px" }}>✏️ Edit Hotel Details</div>
            <div style={S.sectionLine} />

            <form onSubmit={handleSubmit}>
              <div style={S.formGrid}>
                <Field label="Hotel Name"  name="hotelName"     value={formData.hotelName}     onChange={handleChange} />
                <Field label="Type"        name="type"          value={formData.type}          onChange={handleChange} as="select">
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                </Field>
                <Field label="Location"    name="location"      value={formData.location}      onChange={handleChange} />
                <Field label="Address"     name="address"       value={formData.address}       onChange={handleChange} />
                <Field label="Price Per Night (₹)" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} type="number" />
                <Field label="Amenities (comma separated)" name="amenities" value={formData.amenities} onChange={handleChange} />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <Field label="Description" name="description" value={formData.description} onChange={handleChange} as="textarea" rows={4} />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <Field label="Google Maps Embed Code (<iframe>)" name="mapEmbed" value={formData.mapEmbed} onChange={handleChange} as="textarea" rows={3} />
              </div>

              <div style={S.fieldWrap}>
                <label style={S.fieldLabel}>Update Images (leave empty to keep existing)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(Array.from(e.target.files))}
                  style={S.fileInput}
                />
                {images.length > 0 && (
                  <span style={{ fontSize: "12px", color: "#6b7a8d", marginTop: "4px" }}>
                    {images.length} file{images.length > 1 ? "s" : ""} selected
                  </span>
                )}
              </div>

              <div style={S.formActions}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ ...S.btnSave, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving…" : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  style={S.btnCancel}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f4f6f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  onClick={() => { setIsEditing(false); setImages([]); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

        ) : (
        /* ════════════════════ VIEW MODE ════════════════════ */
          <div style={S.card}>

            {/* Hero image */}
            <div style={S.heroWrap}>
              <img src={imgSrc} alt={hotel.hotelName} style={S.heroImg} />
              <div style={S.heroOverlay} />
              <div style={S.heroBadge}>{hotel.type || "Hotel"}</div>
              <div style={S.heroBottom}>
                <div style={S.heroHotelName}>{hotel.hotelName}</div>
                <div style={S.heroLocation}>📍 {hotel.location}</div>
              </div>
            </div>

            <div style={S.detailBody}>

              {/* Info grid */}
              <div style={S.infoGrid}>
                <div style={S.infoItem}>
                  <div style={S.infoLabel}>Address</div>
                  <div style={S.infoVal}>🏠 {hotel.address}</div>
                </div>
                <div style={S.infoItem}>
                  <div style={S.infoLabel}>Contact Email</div>
                  <div style={S.infoVal}>✉️ {hotel.email}</div>
                </div>
                <div style={S.infoItem}>
                  <div style={S.infoLabel}>Price Per Night</div>
                  <div style={S.infoValPrice}>₹ {Number(hotel.pricePerNight).toLocaleString("en-IN")}</div>
                </div>
                <div style={S.infoItem}>
                  <div style={S.infoLabel}>Rating</div>
                  <div style={S.infoValRating}>⭐ {hotel.rating} / 5</div>
                  <Stars rating={hotel.rating} />
                  <div style={{ fontSize: "11px", color: "#a0aab4", marginTop: "4px" }}>
                    {hotel.totalReviews} review{hotel.totalReviews !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities?.length > 0 && (
                <div style={S.amenitiesWrap}>
                  <div style={S.sectionTitle}>🛎️ Amenities</div>
                  <div style={S.sectionLine} />
                  <div style={S.amenitiesList}>
                    {hotel.amenities.map((am, i) => (
                      <span key={i} style={S.amenityTag}>{am}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={S.divider} />

              {/* Description */}
              <div>
                <div style={S.sectionTitle}>📝 Description</div>
                <div style={S.sectionLine} />
                <p style={S.descText}>{hotel.description}</p>
              </div>

              {/* Map */}
              {hotel.mapEmbed && (
                <>
                  <div style={S.divider} />
                  <div style={S.sectionTitle}>🗺️ Location Map</div>
                  <div style={S.sectionLine} />
                  <div
                    style={S.mapWrap}
                    dangerouslySetInnerHTML={{ __html: hotel.mapEmbed }}
                  />
                </>
              )}

              {/* Reviews */}
              <div style={S.divider} />
              <div style={S.sectionTitle}>💬 Customer Reviews</div>
              <div style={S.sectionLine} />

              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} style={S.reviewCard}>
                    <div style={S.reviewHeader}>
                      <div style={S.reviewAvatar(avatarBg(review.user?.name))}>
                        {initials(review.user?.name)}
                      </div>
                      <div>
                        <div style={S.reviewName}>{review.user?.name}</div>
                        <Stars rating={review.rating} />
                      </div>
                      <span style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "#fef5e0",
                        color: "#92400e",
                      }}>
                        ⭐ {review.rating} / 5
                      </span>
                    </div>
                    <p style={S.reviewComment}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div style={S.noReviews}>💬 No reviews yet.</div>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OwnerHotel;
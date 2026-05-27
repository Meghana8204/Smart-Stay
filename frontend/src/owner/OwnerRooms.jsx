import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyHotels } from "../services/hotelService";
import {
  addRoom,
  getRoomsByHotel,
  deleteRoom,
  updateRoomAvailability,
} from "../services/roomService";
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
  headerSub: (name) => ({
    fontSize: "12px",
    color: "#6b7a8d",
    marginTop: "2px",
  }),
  hotelBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#eef2f8",
    border: `1.5px solid #c8d8ea`,
    color: NAVY,
    fontSize: "12px",
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: "20px",
  },

  // ── Two-col layout ──
  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
    alignItems: "start",
  },

  // ── Add Room Form ──
  formCard: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(26,60,94,0.08)",
    border: "1px solid #e8edf3",
    overflow: "hidden",
    position: "sticky",
    top: "1.5rem",
  },
  formHeader: {
    background: NAVY,
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formHeaderTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
  },
  formHeaderIcon: { fontSize: "18px" },
  formBody: { padding: "18px 20px" },
  fieldWrap: { marginBottom: "12px" },
  fieldLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 600,
    color: "#6b7a8d",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "5px",
  },
  input: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    padding: "9px 13px",
    borderRadius: "9px",
    border: "1.5px solid #dde2ea",
    outline: "none",
    color: "#1e2d3d",
    background: "#fafbfc",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  btnAdd: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    padding: "11px",
    borderRadius: "10px",
    border: "none",
    background: NAVY,
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    marginTop: "4px",
    transition: "opacity 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },

  // ── Rooms section ──
  roomsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
    flexWrap: "wrap",
    gap: "8px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: 600,
    color: NAVY,
  },
  roomCount: {
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: "20px",
    background: "#eef2f8",
    color: NAVY,
  },
  sectionLine: {
    height: "3px",
    width: "28px",
    background: GOLD,
    borderRadius: "2px",
    marginBottom: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "14px",
  },

  // ── Room Card ──
  roomCard: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(26,60,94,0.07)",
    border: "1px solid #e8edf3",
    overflow: "hidden",
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  roomCardTop: {
    background: NAVY,
    padding: "13px 16px 11px",
    position: "relative",
  },
  roomCardAccent: {
    position: "absolute",
    top: 0, right: 0,
    width: "60px", height: "100%",
    background: "linear-gradient(135deg, transparent 55%, rgba(212,165,83,0.15))",
    pointerEvents: "none",
  },
  roomNumber: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#fff",
  },
  roomType: {
    fontSize: "11px",
    color: "#a8bfd4",
    marginTop: "2px",
  },
  roomBody: { padding: "14px 16px" },
  roomInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  roomInfoItem: {},
  roomInfoLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#a0aab4",
    fontWeight: 500,
  },
  roomInfoVal: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1e2d3d",
    marginTop: "2px",
  },
  roomInfoValPrice: {
    fontSize: "14px",
    fontWeight: 700,
    color: NAVY,
    marginTop: "2px",
  },
  amenitiesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginTop: "10px",
    marginBottom: "12px",
  },
  amenityTag: {
    fontSize: "10px",
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: "20px",
    background: "#eef2f8",
    color: NAVY,
    border: "1px solid #dde6f0",
    fontFamily: "'Poppins', sans-serif",
  },
  cardFooter: {
    display: "flex",
    gap: "8px",
    paddingTop: "10px",
    borderTop: "1px solid #f0f3f7",
  },
  btnAvail: (available) => ({
    fontFamily: "'Poppins', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: available ? "#e6f5ec" : "#f0f0f0",
    color: available ? "#1a7a3c" : "#5a6475",
    cursor: "pointer",
    flex: 1,
    transition: "opacity 0.15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  }),
  btnDelete: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "#feecec",
    color: "#9a2323",
    cursor: "pointer",
    transition: "opacity 0.15s",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  // ── Empty ──
  emptyWrap: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "3rem 1rem",
    color: "#a0aab4",
  },
  emptyIcon: { fontSize: "44px", marginBottom: "10px" },
  emptyText: { fontSize: "14px", fontWeight: 500 },

  // ── No hotel ──
  noHotelCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "3rem",
    textAlign: "center",
    boxShadow: "0 2px 12px rgba(26,60,94,0.08)",
  },
};

const ROOM_TYPE_ICONS = {
  Single: "🛏️",
  Double: "🛏️",
  Deluxe: "✨",
  Suite: "👑",
};

// ── Field helper ──────────────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", as, children }) {
  return (
    <div style={S.fieldWrap}>
      <label style={S.fieldLabel}>{label}</label>
      {as === "select" ? (
        <select name={name} value={value} onChange={onChange} style={S.input}>
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          style={S.input}
          required={type !== "text" || name !== "amenities"}
        />
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function OwnerRooms() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [rooms, setRooms] = useState([]);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "", roomType: "Single", price: "", capacity: "", amenities: "",
  });

  // ── Fetch rooms ──
  const fetchRooms = async (hotelId) => {
    if (!hotelId || hotelId.length !== 24 || !/^[a-fA-F0-9]{24}$/.test(hotelId)) {
      setRooms([]); return;
    }
    try {
      const data = await getRoomsByHotel(hotelId);
      setRooms(data.rooms || []);
    } catch (err) { console.log(err); }
  };

  // ── Fetch hotels ──
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getMyHotels(user.token);
        setHotels(data.hotels || []);
        if (data.hotels?.length > 0) {
          setSelectedHotel(data.hotels[0]._id);
          fetchRooms(data.hotels[0]._id);
        }
      } catch (err) { console.log(err); }
    };
    if (user?.token) fetchHotels();
  }, [user]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ── Add room ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addRoom({
        hotelId: selectedHotel,
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        price: formData.price,
        capacity: formData.capacity,
        amenities: formData.amenities.split(",").map((i) => i.trim()).filter(Boolean),
      }, user.token);
      fetchRooms(selectedHotel);
      setFormData({ roomNumber: "", roomType: "Single", price: "", capacity: "", amenities: "" });
      toast.success("Room added successfully");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to add room");
    } finally { setAdding(false); }
  };

  // ── Delete ──
  const handleDelete = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await deleteRoom(roomId, user.token);
      fetchRooms(selectedHotel);
    } catch (err) { console.log(err); }
  };

  // ── Toggle availability ──
  const toggleAvailability = async (roomId, current) => {
    try {
      await updateRoomAvailability(roomId, !current, user.token);
      fetchRooms(selectedHotel);
    } catch (err) { console.log(err); }
  };

  const hotelName = hotels[0]?.hotelName || "";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        input:focus, select:focus { border-color: ${NAVY} !important; box-shadow: 0 0 0 3px rgba(26,60,94,0.08); }
        @media (max-width: 780px) { .rm-layout { grid-template-columns: 1fr !important; } .rm-form { position: static !important; } }
      `}</style>

      <div style={S.root}>

        {/* ── Header ── */}
        <div style={S.topBar}>
          <div style={S.headerLeft}>
            <div style={S.headerIconWrap}>🛏️</div>
            <div>
              <div style={S.headerTitle}>Room Management</div>
              <div style={{ fontSize: "12px", color: "#6b7a8d", marginTop: "2px" }}>
                Add, edit and manage rooms for your property
              </div>
            </div>
          </div>
          {hotelName && (
            <div style={S.hotelBadge}>
              🏨 {hotelName}
            </div>
          )}
        </div>

        {/* ── No hotel ── */}
        {hotels.length === 0 ? (
          <div style={S.noHotelCard}>
            <div style={S.emptyIcon}>🏨</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#c0392b", marginBottom: "8px" }}>
              No Hotel Assigned
            </div>
            <div style={{ fontSize: "14px", color: "#6b7a8d" }}>
              You have not been assigned a hotel yet. Please contact the administrator.
            </div>
          </div>
        ) : (

          <div style={{ ...S.layout }} className="rm-layout">

            {/* ── Add Room Form ── */}
            <div style={S.formCard} className="rm-form">
              <div style={S.formHeader}>
                <span style={S.formHeaderIcon}>➕</span>
                <span style={S.formHeaderTitle}>Add New Room</span>
              </div>
              <div style={S.formBody}>
                <form onSubmit={handleSubmit}>
                  <Field label="Room Number"  name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
                  <Field label="Room Type"    name="roomType"   value={formData.roomType}   onChange={handleChange} as="select">
                    {["Single","Double","Deluxe","Suite"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Field>
                  <Field label="Price Per Night (₹)" name="price"    value={formData.price}    onChange={handleChange} type="number" />
                  <Field label="Capacity"            name="capacity" value={formData.capacity} onChange={handleChange} type="number" />
                  <Field label="Amenities (comma separated)" name="amenities" value={formData.amenities} onChange={handleChange} />

                  <button
                    type="submit"
                    disabled={adding}
                    style={{ ...S.btnAdd, opacity: adding ? 0.7 : 1 }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = adding ? "0.7" : "1")}
                  >
                    {adding ? "Adding…" : "➕ Add Room"}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Rooms Grid ── */}
            <div>
              <div style={S.roomsHeader}>
                <div>
                  <div style={S.sectionTitle}>🛏️ Rooms</div>
                  <div style={S.sectionLine} />
                </div>
                <span style={S.roomCount}>{rooms.length} room{rooms.length !== 1 ? "s" : ""}</span>
              </div>

              <div style={S.grid}>
                {rooms.length > 0 ? rooms.map((room) => (
                  <div
                    key={room._id}
                    style={S.roomCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 24px rgba(26,60,94,0.13)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,60,94,0.07)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Card top */}
                    <div style={S.roomCardTop}>
                      <div style={S.roomCardAccent} />
                      <div style={S.roomNumber}>
                        {ROOM_TYPE_ICONS[room.roomType] || "🛏️"} Room {room.roomNumber}
                      </div>
                      <div style={S.roomType}>{room.roomType}</div>
                    </div>

                    {/* Card body */}
                    <div style={S.roomBody}>
                      <div style={S.roomInfoRow}>
                        <div style={S.roomInfoItem}>
                          <div style={S.roomInfoLabel}>Price / Night</div>
                          <div style={S.roomInfoValPrice}>₹ {Number(room.price).toLocaleString("en-IN")}</div>
                        </div>
                        <div style={S.roomInfoItem}>
                          <div style={S.roomInfoLabel}>Capacity</div>
                          <div style={S.roomInfoVal}>👤 {room.capacity} guest{room.capacity !== 1 ? "s" : ""}</div>
                        </div>
                      </div>

                      {room.amenities?.length > 0 && (
                        <div style={S.amenitiesList}>
                          {room.amenities.map((a, i) => (
                            <span key={i} style={S.amenityTag}>{a}</span>
                          ))}
                        </div>
                      )}

                      <div style={S.cardFooter}>
                        <button
                          style={S.btnAvail(room.isAvailable)}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                          onClick={() => toggleAvailability(room._id, room.isAvailable)}
                        >
                          {room.isAvailable ? "✓ Available" : "✗ Unavailable"}
                        </button>
                        <button
                          style={S.btnDelete}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                          onClick={() => handleDelete(room._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={S.emptyWrap}>
                    <div style={S.emptyIcon}>🛏️</div>
                    <div style={S.emptyText}>No rooms added yet. Use the form to add your first room.</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default OwnerRooms;
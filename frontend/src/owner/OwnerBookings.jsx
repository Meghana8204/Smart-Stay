import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getOwnerBookings, confirmBooking, cancelBooking } from "../services/bookingService";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  Confirmed: { bg: "#e8f5e9", color: "#2e7d32", label: "Confirmed" },
  Pending:   { bg: "#fff8e1", color: "#f57f17", label: "Pending"   },
  Cancelled: { bg: "#fce4ec", color: "#c62828", label: "Cancelled" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600,
      padding: "4px 10px", borderRadius: 20,
      letterSpacing: "0.4px", textTransform: "uppercase",
      fontFamily: "'Poppins',sans-serif",
    }}>{s.label}</span>
  );
};

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function OwnerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchBookings = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await getOwnerBookings(user.token);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleUpdateStatus = async (id, status) => {
    const isConfirm = status === "Confirmed";
    if (!window.confirm(`Are you sure you want to ${isConfirm ? "confirm" : "reject"} this booking?`)) return;
    
    try {
      if (isConfirm) await confirmBooking(id, user.token);
      else await cancelBooking(id, user.token);
      
      // Optimistically update the UI to show the new status immediately
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: status } : b))
      );

      // Re-fetch in the background to ensure perfect synchronization with the backend
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || `Failed to update booking status`);
    }
  };

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.bookingStatus === filter);

  if (loading) return (
    <div style={{ fontFamily:"'Poppins',sans-serif", display:"flex", alignItems:"center", gap:10, color:"#8a96a3", padding:40 }}>
      <span style={{ fontSize:22, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Loading bookings…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .ob-root { font-family:'Poppins',sans-serif; color:#1a2332; display:flex; flex-direction:column; gap:24px; padding: 10px 0; }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .ob-root { animation:fadeIn 0.35s ease; }

        /* header */
        .ob-header { display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:14px; }
        .ob-title  { font-size:28px; font-weight:800; letter-spacing:-0.5px; line-height:1.1; color: #1a3c5e; }
        .ob-sub    { font-size:13px; color:#6b7a8d; margin-top:4px; }
        .ob-gold   { display:block; width:36px; height:3px; background:#d4a553; border-radius:2px; margin-top:8px; }

        /* filters */
        .ob-filters { display:flex; gap:8px; flex-wrap:wrap; }
        .ob-filter-btn {
          background:#fff; border:1.5px solid #e8ecf0; color:#6b7a8d;
          font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
          padding:6px 14px; border-radius:20px; cursor:pointer; transition:all 0.2s;
        }
        .ob-filter-btn.active {
          background:#1a3c5e; border-color:#1a3c5e; color:#fff;
        }

        /* table card */
        .ob-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(26,60,94,0.06); overflow:hidden; border: 1px solid #e8edf3; }

        /* table */
        .ob-table { width:100%; border-collapse:collapse; }
        .ob-table thead tr { background:#f8fafc; border-bottom: 1px solid #e8edf3; }
        .ob-table thead th {
          padding:14px 18px; text-align:left;
          font-size:11px; font-weight:700; color:#6b7a8d;
          letter-spacing:0.08em; text-transform:uppercase;
        }

        .ob-table tbody tr {
          border-bottom:1px solid #f0f3f7;
          transition:background 0.15s;
        }
        .ob-table tbody tr:last-child { border-bottom:none; }
        .ob-table tbody tr:hover { background:#fcfdfd; }

        .ob-table td { padding:16px 18px; font-size:13px; color:#1a3c5e; vertical-align:middle; }

        .ob-guest-info { display:flex; flex-direction:column; gap:2px; }
        .ob-guest-name { font-weight:600; font-size:13.5px; }
        .ob-guest-email { color:#8a96a3; font-size:11.5px; }

        .ob-hotel-info { display:flex; flex-direction:column; gap:2px; }
        .ob-hotel-name { font-weight:600; }
        .ob-room-type { color:#8a96a3; font-size:11.5px; }

        .ob-date-block { display:flex; flex-direction:column; gap:2px; }
        .ob-date-label { font-size:10px; color:#8a96a3; text-transform:uppercase; font-weight:600; }

        /* actions */
        .ob-actions { display:flex; gap:8px; }
        .ob-btn {
          font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
          padding:6px 12px; border-radius:6px; cursor:pointer; transition:all 0.2s; border:none;
        }
        .ob-btn-confirm { background:#e8f5e9; color:#2e7d32; }
        .ob-btn-confirm:hover { background:#c8e6c9; }
        
        .ob-btn-reject { background:#fce4ec; color:#c62828; }
        .ob-btn-reject:hover { background:#f8bbd0; }

        /* empty */
        .ob-empty { text-align:center; padding:56px 20px; color:#8a96a3; font-size:13.5px; }
        .ob-table-scroll { overflow-x:auto; }

        @media (max-width:800px) {
          .ob-header { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <div className="ob-root">
        <div className="ob-header">
          <div>
            <h1 className="ob-title">Manage Bookings</h1>
            <p className="ob-sub">Review and update guest reservations</p>
            <span className="ob-gold" />
          </div>

          <div className="ob-filters">
            {["All", "Pending", "Confirmed", "Cancelled"].map((f) => (
              <button
                key={f}
                className={`ob-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ background:"#fef2f2", color:"#b91c1c", padding:"12px 16px", borderRadius:8, fontSize:13 }}>⚠ {error}</div>}

        <div className="ob-card">
          <div className="ob-table-scroll">
            <table className="ob-table">
              <thead>
                <tr>
                  <th>Guest Details</th>
                  <th>Property & Room</th>
                  <th>Dates</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="ob-guest-info">
                        <span className="ob-guest-name">{b.user?.name || "Unknown Guest"}</span>
                        <span className="ob-guest-email">{b.user?.email || "No email available"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ob-hotel-info">
                        <span className="ob-hotel-name">{b.hotel?.hotelName || "Your Hotel"}</span>
                        <span className="ob-room-type">{b.room?.roomType || "Standard Room"} • {b.guests} Guest(s)</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:16 }}>
                        <div className="ob-date-block">
                          <span className="ob-date-label">Check-in</span>
                          <span>{fmt(b.checkInDate)}</span>
                        </div>
                        <div className="ob-date-block">
                          <span className="ob-date-label">Check-out</span>
                          <span>{fmt(b.checkOutDate)}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ color:"#1a3c5e" }}>₹{b.totalPrice?.toLocaleString("en-IN")}</strong>
                    </td>
                    <td><StatusBadge status={b.bookingStatus} /></td>
                    <td>
                      {b.bookingStatus === "Pending" ? (
                        <div className="ob-actions">
                          <button className="ob-btn ob-btn-confirm" onClick={() => handleUpdateStatus(b._id, "Confirmed")}>Confirm</button>
                          <button className="ob-btn ob-btn-reject" onClick={() => handleUpdateStatus(b._id, "Cancelled")}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ fontSize:11, color:"#8a96a3", fontStyle:"italic" }}>No action needed</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6">
                      <div className="ob-empty">
                        No {filter !== "All" ? filter.toLowerCase() : ""} bookings found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OwnerBookings;
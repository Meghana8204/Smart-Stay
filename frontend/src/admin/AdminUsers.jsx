import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, deleteUser } from "../services/adminService";

const ROLE_STYLE = {
  admin:      { bg: "rgba(201,169,110,0.12)", color: "#a07830", label: "Admin" },
  hotelOwner: { bg: "rgba(93,138,168,0.12)", color: "#3a6a8a", label: "Hotel Owner" },
  owner:      { bg: "rgba(93,138,168,0.12)", color: "#3a6a8a", label: "Hotel Owner" },
  user:       { bg: "rgba(44,62,80,0.08)", color: "#4a5a6a", label: "User" },
};

const RoleBadge = ({ role }) => {
  const s = ROLE_STYLE[role] || ROLE_STYLE.user;
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

function Avatar({ name }) {
  const initials = name?.split(" ").map(w => w[0]).slice(0,2).join("").toUpperCase() || "?";
  const hue = [...(name || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue},40%,88%)`, color: `hsl(${hue},40%,38%)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: 13, fontWeight: 700, fontFamily:"'Poppins',sans-serif",
    }}>{initials}</div>
  );
}

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch]     = useState("");

  // ── FIX: primitive dependency to prevent infinite loop ───────────────────
  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await getAllUsers(user.token);
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await deleteUser(id, user.token);
      setUsers((p) => p.filter((u) => u._id !== id)); // optimistic remove
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ fontFamily:"'Poppins',sans-serif", display:"flex", alignItems:"center", gap:10, color:"#8B9EA8", padding:40 }}>
      <span style={{ fontSize:22, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Loading users…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .au-root { font-family:'Poppins',sans-serif; color:#1a2332; display:flex; flex-direction:column; gap:24px; }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .au-root { animation:fadeIn 0.35s ease; }

        /* header */
        .au-header { display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:14px; }
        .au-title  { font-size:28px; font-weight:800; letter-spacing:-0.5px; line-height:1.1; }
        .au-sub    { font-size:13px; color:#8B9EA8; margin-top:4px; }
        .au-gold   { display:block; width:36px; height:3px; background:#C9A96E; border-radius:2px; margin-top:8px; }

        /* search */
        .au-search-wrap { position:relative; width:280px; }
        .au-search-wrap svg { position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none; }
        .au-search {
          font-family:'Poppins',sans-serif; font-size:13px;
          border:1.5px solid #e8ecf0; border-radius:10px;
          padding:9px 14px 9px 36px; outline:none; color:#1a2332;
          background:#fafbfc; width:100%; transition:border-color 0.2s, box-shadow 0.2s;
        }
        .au-search:focus { border-color:#C9A96E; background:#fff; box-shadow:0 0 0 3px rgba(201,169,110,0.12); }

        /* error */
        .au-error { background:#fff0f0; color:#c0392b; border:1px solid #fccac7; border-radius:10px; padding:12px 16px; font-size:13px; }

        /* table card */
        .au-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(44,62,80,0.08); overflow:hidden; }

        /* table */
        .au-table { width:100%; border-collapse:collapse; }
        .au-table thead tr { background:#1a2332; }
        .au-table thead th {
          padding:14px 18px; text-align:left;
          font-size:11px; font-weight:600; color:rgba(255,255,255,0.6);
          letter-spacing:0.08em; text-transform:uppercase;
        }
        .au-table thead th:first-child { color:#C9A96E; }

        .au-table tbody tr {
          border-bottom:1px solid #f0f3f7;
          transition:background 0.15s;
        }
        .au-table tbody tr:last-child { border-bottom:none; }
        .au-table tbody tr:hover { background:#fafbfc; }

        .au-table td { padding:14px 18px; font-size:13.5px; color:#2a3a4a; vertical-align:middle; }

        .au-name-cell { display:flex; align-items:center; gap:12px; }
        .au-name-text { font-weight:600; }
        .au-email     { color:#8B9EA8; font-size:12.5px; margin-top:1px; }

        .au-del-btn {
          background:#fff0f0; color:#c0392b;
          border:1.5px solid #fccac7;
          font-family:'Poppins',sans-serif; font-size:11.5px; font-weight:600;
          padding:6px 14px; border-radius:8px; cursor:pointer; transition:all 0.2s;
          white-space:nowrap;
        }
        .au-del-btn:hover:not(:disabled) { background:#c0392b; color:#fff; border-color:#c0392b; }
        .au-del-btn:disabled { opacity:0.5; cursor:not-allowed; }

        /* footer */
        .au-footer { padding:12px 18px; background:#fafbfc; border-top:1px solid #f0f3f7; font-size:12px; color:#8B9EA8; }

        /* empty */
        .au-empty { text-align:center; padding:56px 20px; color:#8B9EA8; font-size:13.5px; }

        /* responsive scroll */
        .au-table-scroll { overflow-x:auto; }

        @media (max-width:600px) {
          .au-title { font-size:22px; }
          .au-search-wrap { width:100%; }
          .au-header { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <div className="au-root">

        {/* Header */}
        <div className="au-header">
          <div>
            <h1 className="au-title">Users</h1>
            <p className="au-sub">{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
            <span className="au-gold" />
          </div>
          <div className="au-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B9EA8" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className="au-search"
              placeholder="Search name, email, role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Error */}
        {error && <div className="au-error">⚠ {error}</div>}

        {/* Table */}
        <div className="au-card">
          <div className="au-table-scroll">
            <table className="au-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="au-name-cell">
                        <Avatar name={item.name} />
                        <span className="au-name-text">{item.name}</span>
                      </div>
                    </td>
                    <td style={{ color:"#8B9EA8", fontSize:13 }}>{item.email}</td>
                    <td><RoleBadge role={item.role} /></td>
                    <td>
                      {item.role !== "admin" ? (
                        <button
                          className="au-del-btn"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                        >
                          {deletingId === item._id ? "Deleting…" : "🗑 Delete"}
                        </button>
                      ) : (
                        <span style={{ fontSize:11, color:"#C9A96E", fontWeight:600 }}>Protected</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4">
                      <div className="au-empty">
                        {search ? `No users matching "${search}"` : "No users found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="au-footer">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>

      </div>
    </>
  );
}

export default AdminUsers;
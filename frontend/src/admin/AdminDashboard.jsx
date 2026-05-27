import { useEffect, useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/adminService";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_COLORS = ["#C9A96E", "#2C3E50", "#8B9EA8"];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1a2332", border:"1px solid #C9A96E", borderRadius:8, padding:"10px 16px", color:"#fff", fontFamily:"'Poppins',sans-serif", fontSize:13 }}>
      <p style={{ color:"#C9A96E", marginBottom:4, fontWeight:600 }}>{label}</p>
      <p>₹ {payload[0].value.toLocaleString("en-IN")}</p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1a2332", border:"1px solid #C9A96E", borderRadius:8, padding:"10px 16px", color:"#fff", fontFamily:"'Poppins',sans-serif", fontSize:13 }}>
      <p style={{ color:"#C9A96E", fontWeight:600 }}>{payload[0].name}</p>
      <p>{payload[0].value} bookings</p>
    </div>
  );
};

const StatCard = ({ label, value, icon, accent, index }) => (
  <div style={{
    background:"#fff", borderRadius:16, padding:"22px 24px",
    boxShadow:"0 4px 24px rgba(44,62,80,0.07)", borderTop:`4px solid ${accent}`,
    display:"flex", flexDirection:"column", gap:10,
    animation:"fadeUp 0.5s ease both", animationDelay:`${index * 0.08}s`,
    position:"relative", overflow:"hidden",
  }}>
    <div style={{ position:"absolute", top:-18, right:-18, width:72, height:72, borderRadius:"50%", background:accent, opacity:0.07 }} />
    <div style={{ fontSize:26, lineHeight:1 }}>{icon}</div>
    <div>
      <p style={{ fontSize:11, fontWeight:600, color:"#8B9EA8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>{label}</p>
      <p style={{ fontSize:26, fontWeight:800, color:"#1a2332", letterSpacing:"-0.5px", lineHeight:1 }}>{value}</p>
    </div>
  </div>
);

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats]               = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [bookingStatus, setBookingStatus]   = useState([]);

  // ── FIX: depend on the primitive token, not the user object ──────────────
  const fetchStats = useCallback(async () => {
    if (!user?.token) return;
    try {
      const data = await getDashboardStats(user.token);
      setStats(data.stats);
      setMonthlyRevenue(data.monthlyRevenue.map(item => ({
        month: MONTHS[item._id.month - 1],
        revenue: item.revenue,
      })));
      setBookingStatus(data.bookingStatus.map(item => ({
        name: item._id,
        value: item.value,
      })));
    } catch (err) {
      console.error(err);
    }
  }, [user?.token]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const fmt = (val) =>
    val >= 100000 ? `₹ ${(val / 100000).toFixed(2)}L` : `₹ ${val?.toLocaleString("en-IN") || 0}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .ad-root { font-family: 'Poppins', sans-serif; display: flex; flex-direction: column; gap: 28px; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .ad-root { animation: fadeIn 0.35s ease; }

        /* stats grid */
        .ad-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }

        /* charts grid */
        .ad-charts { display:grid; grid-template-columns:1fr 1fr; gap:24px; }

        .ad-chart-card {
          background:#fff; border-radius:16px; padding:24px 24px 16px;
          box-shadow:0 4px 24px rgba(44,62,80,0.07);
          animation:fadeUp 0.5s ease both; animation-delay:0.3s;
        }
        .ad-chart-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .ad-chart-title  { font-size:16px; font-weight:700; color:#1a2332; }
        .ad-chart-badge  {
          font-size:10px; font-weight:600; color:#C9A96E;
          background:rgba(201,169,110,0.12); padding:4px 10px;
          border-radius:20px; letter-spacing:0.5px; text-transform:uppercase;
        }

        .ad-pie-legend { display:flex; justify-content:center; gap:20px; margin-top:14px; flex-wrap:wrap; }
        .ad-legend-item { display:flex; align-items:center; gap:6px; font-size:11px; color:#5a6a7a; font-weight:500; }
        .ad-legend-dot  { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

        /* page heading */
        .ad-heading { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .ad-title   { font-size:28px; font-weight:800; color:#1a2332; letter-spacing:-0.5px; line-height:1.1; }
        .ad-sub     { font-size:13px; color:#8B9EA8; margin-top:4px; }
        .ad-gold-line { display:block; width:36px; height:3px; background:#C9A96E; border-radius:2px; margin-top:8px; }
        .ad-export-btn {
          background:#1a2332; color:#C9A96E; border:none;
          padding:10px 20px; border-radius:10px;
          font-family:'Poppins',sans-serif; font-size:12px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; gap:8px;
          letter-spacing:0.3px; transition:all 0.2s;
        }
        .ad-export-btn:hover { background:#C9A96E; color:#1a2332; }

        @media (max-width:1100px) { .ad-stats  { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:800px)  { .ad-charts { grid-template-columns:1fr; } }
        @media (max-width:500px)  { .ad-stats  { grid-template-columns:1fr 1fr; gap:12px; }
                                    .ad-title  { font-size:22px; } }
        @media (max-width:360px)  { .ad-stats  { grid-template-columns:1fr; } }
      `}</style>

      <div className="ad-root">

        {/* Heading */}
        <div className="ad-heading">
          <div>
            <h1 className="ad-title">Admin Dashboard</h1>
            <p className="ad-sub">Welcome back! Here's what's happening today.</p>
            <span className="ad-gold-line" />
          </div>
          <button className="ad-export-btn">⬇ Export Report</button>
        </div>

        {/* Stat Cards */}
        <div className="ad-stats">
          <StatCard index={0} label="Today's Revenue" value={fmt(stats.todayRevenue)} icon="💳" accent="#C9A96E" />
          <StatCard index={1} label="Total Revenue"   value={fmt(stats.totalRevenue)}  icon="💰" accent="#2C3E50" />
          <StatCard index={2} label="Total Hotels"    value={stats.totalHotels || 0}   icon="🏨" accent="#5D8AA8" />
          <StatCard index={3} label="Total Guests"    value={(stats.totalUsers || 0).toLocaleString("en-IN")} icon="👥" accent="#C96E6E" />
        </div>

        {/* Charts */}
        <div className="ad-charts">

          {/* Bar */}
          <div className="ad-chart-card">
            <div className="ad-chart-header">
              <span className="ad-chart-title">Monthly Revenue</span>
              <span className="ad-chart-badge">2025</span>
            </div>
            <div style={{ height:280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontFamily:"Poppins", fontSize:11, fill:"#8B9EA8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily:"Poppins", fontSize:11, fill:"#8B9EA8" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} width={50} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill:"rgba(201,169,110,0.07)" }} />
                  <Bar dataKey="revenue" radius={[6,6,0,0]}>
                    {monthlyRevenue.map((_, i) => (
                      <Cell key={i} fill={i === monthlyRevenue.length - 1 ? "#C9A96E" : "#1a2332"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie */}
          <div className="ad-chart-card" style={{ animationDelay:"0.42s" }}>
            <div className="ad-chart-header">
              <span className="ad-chart-title">Booking Status</span>
              <span className="ad-chart-badge">Live</span>
            </div>
            <div style={{ height:240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bookingStatus} dataKey="value" cx="50%" cy="50%"
                    innerRadius={65} outerRadius={105} paddingAngle={3}>
                    {bookingStatus.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ad-pie-legend">
              {bookingStatus.map((item, i) => (
                <div className="ad-legend-item" key={i}>
                  <div className="ad-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {item.name} — <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
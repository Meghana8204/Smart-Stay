import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOwnerStats } from "../services/adminService";

const NAVY = "#1a3c5e";
const GOLD = "#d4a553";

const styles = {
  root: {
    fontFamily: "'Poppins', sans-serif",
    padding: "2rem",
    background: "#f4f6f9",
    minHeight: "100vh",
  },

  // ── Header ──
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "2rem",
  },
  headerIconWrap: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: NAVY,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerIcon: { fontSize: "26px" },
  headerTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: NAVY,
    lineHeight: 1.2,
  },
  headerSub: { fontSize: "13px", color: "#6b7a8d", marginTop: "3px" },

  // ── Stats grid ──
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "2rem",
  },
  statCard: (accent) => ({
    background: "#fff",
    borderRadius: "16px",
    padding: "22px 24px",
    boxShadow: "0 2px 12px rgba(26,60,94,0.08)",
    border: "1px solid #e8edf3",
    borderTop: `4px solid ${accent}`,
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  }),
  statIconWrap: (bg) => ({
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "14px",
  }),
  statLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#8a96a3",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  statValue: (color) => ({
    fontSize: "28px",
    fontWeight: 700,
    color: color,
    marginTop: "4px",
    lineHeight: 1.1,
  }),
  statTrend: {
    fontSize: "11px",
    color: "#1a7a3c",
    marginTop: "6px",
    fontWeight: 500,
  },

  // ── Section title ──
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: NAVY,
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionDivider: {
    height: "3px",
    width: "32px",
    background: GOLD,
    borderRadius: "2px",
    marginBottom: "16px",
  },

  // ── Quick info cards row ──
  infoRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
    marginBottom: "2rem",
  },
  infoCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "20px 22px",
    boxShadow: "0 2px 12px rgba(26,60,94,0.08)",
    border: "1px solid #e8edf3",
  },
  infoCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  infoCardTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: NAVY,
  },
  infoCardIcon: {
    fontSize: "18px",
    background: "#f4f7fb",
    borderRadius: "8px",
    padding: "6px",
    lineHeight: 1,
  },
  progressBarWrap: { marginBottom: "8px" },
  progressBarBg: {
    height: "6px",
    background: "#edf0f5",
    borderRadius: "6px",
    overflow: "hidden",
  },
  progressBarFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: "6px",
    transition: "width 0.8s ease",
  }),
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#8a96a3",
    marginTop: "4px",
  },

  // ── Revenue highlight ──
  revenueCard: {
    background: NAVY,
    borderRadius: "16px",
    padding: "24px 26px",
    boxShadow: "0 2px 12px rgba(26,60,94,0.18)",
    position: "relative",
    overflow: "hidden",
    marginBottom: "2rem",
  },
  revenueGlowLeft: {
    position: "absolute",
    top: "-30px",
    left: "-30px",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(212,165,83,0.12)",
    pointerEvents: "none",
  },
  revenueGlowRight: {
    position: "absolute",
    bottom: "-40px",
    right: "-20px",
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    background: "rgba(212,165,83,0.08)",
    pointerEvents: "none",
  },
  revenueLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#a8bfd4",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },
  revenueValue: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.1,
  },
  revenueGold: { color: GOLD },
  revenueSub: {
    fontSize: "12px",
    color: "#a8bfd4",
    marginTop: "8px",
  },

  // ── Loading ──
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
  },
  loadingSpinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #f5e6c8",
    borderTop: `4px solid ${GOLD}`,
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: { fontSize: "15px", color: "#8a96a3", fontWeight: 500 },
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent, iconBg, valueColor, trend }) {
  return (
    <div
      style={styles.statCard(accent)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(26,60,94,0.14)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,60,94,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={styles.statIconWrap(iconBg)}>{icon}</div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue(valueColor)}>{value}</div>
      {trend && <div style={styles.statTrend}>{trend}</div>}
    </div>
  );
}

// ── Progress Row ───────────────────────────────────────────────────────────────
function ProgressRow({ label, pct, color }) {
  return (
    <div style={styles.progressBarWrap}>
      <div style={styles.progressBarBg}>
        <div style={styles.progressBarFill(pct, color)} />
      </div>
      <div style={styles.progressLabel}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function OwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getOwnerStats(user.token);
        setStats(data.stats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ ...styles.root, ...styles.loadingWrap }}>
          <div style={styles.loadingSpinner} />
          <div style={styles.loadingText}>Loading dashboard…</div>
        </div>
      </>
    );
  }

  const totalHotels   = stats.totalHotels   || 0;
  const totalRooms    = stats.totalRooms    || 0;
  const totalBookings = stats.totalBookings || 0;
  const totalRevenue  = stats.totalRevenue  || 0;

  // Derived occupancy % (rooms / (hotels * 20) capped at 100 — adjust denominator to your model)
  const occupancyPct = totalRooms > 0
    ? Math.min(100, Math.round((totalBookings / totalRooms) * 100))
    : 0;
  const confirmedPct = stats.confirmedBookings && totalBookings
    ? Math.round((stats.confirmedBookings / totalBookings) * 100)
    : 0;
  const paidPct = stats.paidBookings && totalBookings
    ? Math.round((stats.paidBookings / totalBookings) * 100)
    : 0;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.root}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerIconWrap}>
            <span style={styles.headerIcon}>🏨</span>
          </div>
          <div>
            <div style={styles.headerTitle}>Owner Dashboard</div>
            <div style={styles.headerSub}>
              Welcome back, {user?.name || "Hotel Owner"} — here's your overview
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div style={styles.statsGrid}>
          <StatCard
            icon="🏨"
            label="Total Hotels"
            value={totalHotels}
            accent={NAVY}
            iconBg="#e8f0f8"
            valueColor={NAVY}
            trend="Your properties"
          />
          <StatCard
            icon="🛏️"
            label="Total Rooms"
            value={totalRooms}
            accent="#7c3aed"
            iconBg="#f3eeff"
            valueColor="#5b21b6"
            trend="Across all hotels"
          />
          <StatCard
            icon="📋"
            label="Total Bookings"
            value={totalBookings}
            accent="#0891b2"
            iconBg="#e0f5fa"
            valueColor="#0e7490"
            trend="All reservations"
          />
          <StatCard
            icon="💰"
            label="Total Revenue"
            value={`₹${Number(totalRevenue).toLocaleString("en-IN")}`}
            accent={GOLD}
            iconBg="#fef5e0"
            valueColor="#92400e"
            trend="From paid bookings"
          />
        </div>

        {/* ── Revenue highlight banner ── */}
        <div style={styles.revenueCard}>
          <div style={styles.revenueGlowLeft} />
          <div style={styles.revenueGlowRight} />
          <div style={styles.revenueLabel}>Total Revenue Earned</div>
          <div style={styles.revenueValue}>
            <span style={styles.revenueGold}>₹</span>{" "}
            {Number(totalRevenue).toLocaleString("en-IN")}
          </div>
          <div style={styles.revenueSub}>
            Across {totalHotels} hotel{totalHotels !== 1 ? "s" : ""} ·{" "}
            {totalBookings} booking{totalBookings !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ── Quick Insights ── */}
        <div style={styles.sectionTitle}>
          📊 <span>Quick Insights</span>
        </div>
        <div style={styles.sectionDivider} />

        <div style={styles.infoRow}>
          {/* Occupancy */}
          <div style={styles.infoCard}>
            <div style={styles.infoCardHeader}>
              <span style={styles.infoCardTitle}>Booking Rate</span>
              <span style={styles.infoCardIcon}>📋</span>
            </div>
            <ProgressRow label="Bookings per room" pct={occupancyPct} color="#0891b2" />
            <ProgressRow label="Confirmed"          pct={confirmedPct} color="#1a7a3c" />
            <ProgressRow label="Paid"               pct={paidPct}      color={GOLD} />
          </div>

          {/* Property summary */}
          <div style={styles.infoCard}>
            <div style={styles.infoCardHeader}>
              <span style={styles.infoCardTitle}>Property Summary</span>
              <span style={styles.infoCardIcon}>🏨</span>
            </div>
            {[
              { label: "Hotels", value: totalHotels, color: NAVY },
              { label: "Rooms", value: totalRooms, color: "#7c3aed" },
              {
                label: "Avg rooms / hotel",
                value: totalHotels > 0 ? Math.round(totalRooms / totalHotels) : 0,
                color: "#0891b2",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f3f7",
                }}
              >
                <span style={{ fontSize: "13px", color: "#6b7a8d" }}>{label}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Revenue breakdown */}
          <div style={styles.infoCard}>
            <div style={styles.infoCardHeader}>
              <span style={styles.infoCardTitle}>Revenue Breakdown</span>
              <span style={styles.infoCardIcon}>💰</span>
            </div>
            {[
              { label: "Total revenue",       value: `₹${Number(totalRevenue).toLocaleString("en-IN")}`,       color: "#92400e" },
              {
                label: "Avg per booking",
                value: totalBookings > 0
                  ? `₹${Math.round(totalRevenue / totalBookings).toLocaleString("en-IN")}`
                  : "₹0",
                color: NAVY,
              },
              {
                label: "Avg per hotel",
                value: totalHotels > 0
                  ? `₹${Math.round(totalRevenue / totalHotels).toLocaleString("en-IN")}`
                  : "₹0",
                color: "#7c3aed",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f3f7",
                }}
              >
                <span style={{ fontSize: "13px", color: "#6b7a8d" }}>{label}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default OwnerDashboard;
import { useMemo } from "react";
import {
  CreditCardOutlined,
  TeamOutlined,
  PictureOutlined,
  ArrowUpOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import useFetchAllDonations from "../hooks/fetchAllDonations";
import useFetchAllVolunteers from "../hooks/fetchVolunteers";
import useFetchAllMedia from "../hooks/fetchAllMedia";
import {
  globalStyles,
  primary,
  accent,
  greenDim,
  primaryDim,
  primaryGlow,
  green,
  blue,
  blueDim,
  dark,
} from "../utils/uiHelpers";
import { Image } from "antd";

// ── Helpers ──────────────────────────────────────────────────────
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Stat card ────────────────────────────────────────────────────
function StatCard({ icon, value, label, color, sub, trend, delay = 0 }) {
  return (
    <div
      className="dash-stat-card"
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        padding: "20px 22px",
        flex: 1,
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: `${color}18`,
            border: `1px solid ${color}28`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            fontSize: 18,
          }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: green,
              background: greenDim,
              border: "1px solid rgba(39,174,96,0.2)",
              borderRadius: 20,
              padding: "2px 8px",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <ArrowUpOutlined style={{ fontSize: 9 }} />
            {trend}%
          </span>
        )}
      </div>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#1a1a1a",
          margin: "0 0 4px",
          lineHeight: 1,
          animation: "countUp 0.6s ease both",
          animationDelay: `${delay + 100}ms`,
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "#aaa",
          margin: 0,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color,
            margin: "6px 0 0",
            fontWeight: 500,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────
function SectionHeading({ title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 3,
          height: 16,
          borderRadius: 2,
          background: `linear-gradient(to bottom, ${primary}, #a066bc)`,
        }}
      />
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "#333",
          margin: 0,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </p>
    </div>
  );
}

// ── Mini bar chart ────────────────────────────────────────────────
function MiniBarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            className="dash-bar"
            title={`${d.label}: ${d.value}`}
            style={{
              width: "100%",
              borderRadius: "4px 4px 0 0",
              background: `linear-gradient(to top, ${color}, ${color}88)`,
              height: `${Math.max((d.value / max) * 52, 3)}px`,
              cursor: "default",
            }}
          />
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 9,
              color: "#ccc",
              margin: 0,
            }}
          >
            {d.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Activity item ─────────────────────────────────────────────────
function ActivityItem({
  icon,
  iconColor,
  iconBg,
  title,
  sub,
  time,
  isRead,
  delay = 0,
}) {
  return (
    <div
      className="dash-activity-row"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 10px",
        marginBottom: 2,
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          flexShrink: 0,
          background: iconBg,
          border: `1px solid ${iconColor}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          fontSize: 13,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: isRead ? 500 : 700,
            color: "#333",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {!isRead && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accent,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
          )}
          {title}
        </p>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color: "#aaa",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sub}
        </p>
      </div>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 10,
          color: "#ccc",
          flexShrink: 0,
        }}
      >
        {time}
      </span>
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────
function Card({ children, delay = 0, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        padding: "20px 22px",
        animation: "fadeUp 0.5s ease both",
        animationDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
function Home() {
  const { donations, loading: dl } = useFetchAllDonations();
  const { volunteers, loading: vl } = useFetchAllVolunteers();
  const { media, loading: ml } = useFetchAllMedia();

  const totalKES = useMemo(
    () => donations?.reduce((s, d) => s + (d.amount || 0), 0) ?? 0,
    [donations],
  );
  const unreadDon = useMemo(
    () => donations?.filter((d) => !d.isRead).length ?? 0,
    [donations],
  );
  const unreadVol = useMemo(
    () => volunteers?.filter((v) => !v.isRead).length ?? 0,
    [volunteers],
  );
  const topDonor = useMemo(
    () =>
      donations?.length
        ? donations.reduce(
            (top, d) => (d.amount > (top?.amount ?? 0) ? d : top),
            null,
          )
        : null,
    [donations],
  );

  const isLoading = dl || vl || ml;

  const donationChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
        date: d.toDateString(),
        value: 0,
      };
    });
    donations?.forEach((d) => {
      const idx = days.findIndex(
        (day) => day.date === new Date(d.createdAt).toDateString(),
      );
      if (idx !== -1) days[idx].value += d.amount || 0;
    });
    return days;
  }, [donations]);

  const volunteerChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
        date: d.toDateString(),
        value: 0,
      };
    });
    volunteers?.forEach((v) => {
      const idx = days.findIndex(
        (day) => day.date === new Date(v.createdAt).toDateString(),
      );
      if (idx !== -1) days[idx].value++;
    });
    return days;
  }, [volunteers]);

  const recentActivity = useMemo(
    () =>
      [
        ...(donations?.slice(-6).map((d) => ({
          type: "donation",
          date: d.createdAt,
          title: `${d.name} donated KES ${d.amount?.toLocaleString()}`,
          sub: d.message || d.email,
          isRead: d.isRead,
        })) ?? []),
        ...(volunteers?.slice(-6).map((v) => ({
          type: "volunteer",
          date: v.createdAt,
          title: `${v.fullName} signed up to volunteer`,
          sub: v.email,
          isRead: v.isRead,
        })) ?? []),
        ...(media?.slice(-4).map((m) => ({
          type: "media",
          date: m.createdAt,
          title: `"${m.title}" uploaded`,
          sub: `by ${m.createdBy?.username} · ${m.type}`,
          isRead: true,
        })) ?? []),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10),
    [donations, volunteers, media],
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 48px", fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Welcome banner ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${dark} 0%, #1a0a28 60%, #0d1a3c 100%)`,
            borderRadius: 16,
            padding: "28px 32px",
            marginBottom: 24,
            position: "relative",
            overflow: "hidden",
            animation: "fadeUp 0.5s ease both",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: 60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: primaryGlow,
              filter: "blur(70px)",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 240,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "rgba(254,165,73,0.2)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${primary}, #a066bc, transparent)`,
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(173, 165, 165, 0.69)",
                  margin: "0 0 6px",
                }}
              >
                {getGreeting()}
              </p>

              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  color: "rgba(223, 214, 214, 0.91)",
                  margin: 0,
                }}
              >
                Here's what's happening with Toto Kalezi Foundation today.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  color: "rgba(214, 202, 202, 0.92)",
                  margin: "8px 0 0",
                }}
              >
                {new Date().toLocaleDateString("en-KE", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          <StatCard
            delay={0}
            icon={<CreditCardOutlined />}
            value={isLoading ? "—" : (donations?.length ?? 0)}
            label="Total Donations"
            color={primary}
            trend={12}
          />
          <StatCard
            delay={80}
            icon={<HeartOutlined />}
            value={isLoading ? "—" : `KES ${totalKES.toLocaleString()}`}
            label="Total Raised"
            color={green}
            sub={topDonor ? `Top: ${topDonor.name}` : undefined}
          />
          <StatCard
            delay={160}
            icon={<TeamOutlined />}
            value={isLoading ? "—" : (volunteers?.length ?? 0)}
            label="Volunteers"
            color={accent}
            trend={5}
          />
          <StatCard
            delay={240}
            icon={<PictureOutlined />}
            value={isLoading ? "—" : (media?.length ?? 0)}
            label="Gallery Items"
            color={blue}
          />
        </div>

        {/* ── Charts + Activity ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          {/* Charts */}
          <div
            style={{
              flex: 1.4,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Card delay={200}>
              <SectionHeading title="Donations — Last 7 Days" />
              <MiniBarChart data={donationChart} color={green} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(133,74,154,0.07)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#bbb",
                      margin: "0 0 2px",
                    }}
                  >
                    Total this week
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                      fontWeight: 800,
                      color: green,
                      margin: 0,
                    }}
                  >
                    KES{" "}
                    {donationChart
                      .reduce((s, d) => s + d.value, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#bbb",
                      margin: "0 0 2px",
                    }}
                  >
                    Unread
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                      fontWeight: 800,
                      color: accent,
                      margin: 0,
                    }}
                  >
                    {unreadDon}
                  </p>
                </div>
              </div>
            </Card>

            <Card delay={280}>
              <SectionHeading title="Volunteer Sign-ups — Last 7 Days" />
              <MiniBarChart data={volunteerChart} color={primary} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(133,74,154,0.07)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#bbb",
                      margin: "0 0 2px",
                    }}
                  >
                    This week
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                      fontWeight: 800,
                      color: primary,
                      margin: 0,
                    }}
                  >
                    {volunteerChart.reduce((s, d) => s + d.value, 0)} sign-ups
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#bbb",
                      margin: "0 0 2px",
                    }}
                  >
                    Unread
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                      fontWeight: 800,
                      color: accent,
                      margin: 0,
                    }}
                  >
                    {unreadVol}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity feed */}
          <Card
            delay={240}
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <SectionHeading title="Recent Activity" />
            <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin" }}>
              {recentActivity.length === 0 ? (
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: "#ccc",
                    textAlign: "center",
                    marginTop: 40,
                  }}
                >
                  No recent activity
                </p>
              ) : (
                recentActivity
                  .slice(0, 5)
                  .map((item, i) => (
                    <ActivityItem
                      key={i}
                      delay={i * 40}
                      isRead={item.isRead}
                      icon={
                        item.type === "donation" ? (
                          <CreditCardOutlined />
                        ) : item.type === "volunteer" ? (
                          <TeamOutlined />
                        ) : (
                          <PictureOutlined />
                        )
                      }
                      iconColor={
                        item.type === "donation"
                          ? green
                          : item.type === "volunteer"
                            ? primary
                            : blue
                      }
                      iconBg={
                        item.type === "donation"
                          ? greenDim
                          : item.type === "volunteer"
                            ? primaryDim
                            : blueDim
                      }
                      title={item.title}
                      sub={item.sub}
                      time={timeAgo(item.date)}
                    />
                  ))
              )}
            </div>
          </Card>
        </div>

        {/* ── Starred + Media ── */}
        <div style={{ display: "flex", gap: 14 }}>
          {/* Media snapshot */}
          <Card delay={360} style={{ flex: 1 }}>
            <SectionHeading title="Recent Media" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
              }}
            >
              {(media?.slice(-6) ?? []).map((m, i) => (
                <div
                  key={m._id}
                  className="media-thumb"
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    aspectRatio: "1",
                    background: "#0d0814",
                    animation: "fadeUp 0.4s ease both",
                    animationDelay: `${i * 50}ms`,
                    cursor: "pointer",
                  }}
                >
                  {m.type === "video" ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: primaryDim,
                      }}
                    >
                      <EyeOutlined style={{ color: primary, fontSize: 18 }} />
                    </div>
                  ) : (
                    <Image
                      src={m.url}
                      alt={m.title}
                      preview={true}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                  <div
                    className="media-thumb-overlay"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(5,2,14,0.6)",
                      display: "flex",
                      alignItems: "flex-end",
                      padding: "6px",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 9,
                        fontWeight: 600,
                        color: "#fff",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.title}
                    </p>
                  </div>
                </div>
              ))}
              {(!media || media.length === 0) && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "24px 0",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 13,
                      color: "#ccc",
                      margin: 0,
                    }}
                  >
                    No media uploaded yet
                  </p>
                </div>
              )}
            </div>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "#ccc",
                margin: "12px 0 0",
                textAlign: "right",
              }}
            >
              {media?.length ?? 0} total ·{" "}
              {media?.filter((m) => m.type === "image").length ?? 0} images ·{" "}
              {media?.filter((m) => m.type === "video").length ?? 0} videos
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Home;

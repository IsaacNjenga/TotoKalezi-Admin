import { Avatar, Button, Divider } from "antd";
import {
  CalendarOutlined,
  MessageOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import {
  primary,
  primaryDim,
  primaryMid,
  green,
  greenDim,
} from "../utils/uiHelpers";

export default function DonationsPreview({ donation }) {
  if (!donation) return null;

  const date = new Date(donation.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const initials = donation.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ padding: "12px", fontFamily: "'Outfit', sans-serif" }}>
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <Avatar
          size={48}
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
            border: `2px solid rgba(133,74,154,0.25)`,
          }}
        >
          {initials}
        </Avatar>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#1a1a1a",
              margin: "0 0 2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {donation.name}
          </p>
          <a
            href={`mailto:${donation.email}`}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: primary,
              textDecoration: "none",
            }}
          >
            {donation.email}
          </a>
        </div>
      </div>

      {/* ── Amount pill ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "14px 20px",
          borderRadius: 10,
          marginBottom: 16,
          background: greenDim,
          border: "1px solid rgba(39,174,96,0.2)",
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: green,
            letterSpacing: "0.02em",
          }}
        >
          KES {donation.amount?.toLocaleString()}
        </span>
      </div>

      {/* ── Meta ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        {[
          {
            icon: <CreditCardOutlined />,
            label: "Transaction ID",
            value: (
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12,
                  color: "#555",
                }}
              >
                {donation.transactionID}
              </span>
            ),
          },
          {
            icon: <CalendarOutlined />,
            label: "Date",
            value: date,
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 7,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = primaryDim)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span
              style={{
                color: primary,
                fontSize: 13,
                marginTop: 1,
                width: 14,
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#bbb",
                  margin: "0 0 1px",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#333",
                  margin: 0,
                }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Divider
        style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 14px" }}
      />

      {/* ── Message ── */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#bbb",
          margin: "0 0 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <MessageOutlined style={{ color: primary }} /> Message
      </p>
      <div
        style={{
          background: primaryDim,
          border: `1px solid ${primaryMid}`,
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 20,
          height: 140,
        }}
      >
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: donation.message ? "#444" : "#bbb",
            fontStyle: donation.message ? "normal" : "italic",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {donation.message || "No message provided."}
        </p>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          href={`mailto:${donation.email}`}
          type="primary"
          size="small"
          block
          style={{
            flex: 1,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
            border: "none",
            borderRadius: 7,
            boxShadow: "0 2px 8px rgba(133,74,154,0.25)",
          }}
        >
          Reply
        </Button>
      </div>
    </div>
  );
}

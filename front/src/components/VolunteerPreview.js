import { Tag, Avatar, Button, Divider } from "antd";
import { CalendarOutlined, MessageOutlined } from "@ant-design/icons";
import {
  primary,
  primaryDim,
  primaryMid,
  accent,
  accentDim,
} from "../utils/uiHelpers";
import { format } from "date-fns";

export default function VolunteerDetail({ volunteer }) {
  if (!volunteer) return null;

  const initials = volunteer.fullName
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
          marginBottom: 20,
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
            {volunteer.fullName}
          </p>
          <a
            href={`mailto:${volunteer.email}`}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: primary,
              textDecoration: "none",
            }}
          >
            {volunteer.email}
          </a>
        </div>
        <Tag
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "2px 10px",
            borderRadius: 20,
            margin: 0,
            flexShrink: 0,
            border: volunteer.isRead
              ? "1px solid rgba(39,174,96,0.3)"
              : `1px solid rgba(254,165,73,0.35)`,
            background: volunteer.isRead ? "rgba(39,174,96,0.08)" : accentDim,
            color: volunteer.isRead ? "#27ae60" : accent,
          }}
        >
          {volunteer.isRead ? <>Read</> : <>Unread</>}
        </Tag>
      </div>

      {/* ── Date ── */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          color: "#bbb",
          margin: "0 0 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <CalendarOutlined style={{ color: primary }} />
        Sent on {format(new Date(volunteer.createdAt), "PPpp")}
      </p>

      <Divider
        style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 16px" }}
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
          overflow: "auto",
          textOverflow: "ellipsis",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          hyphens: "auto",
          overflowWrap: "break-word",
          height: 180,
        }}
      >
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: volunteer.message ? "#444" : "#bbb",
            fontStyle: volunteer.message ? "normal" : "italic",
            margin: 0,
            whiteSpace: "pre-wrap",
          }}
        >
          {volunteer.message || "No message provided."}
        </p>
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          href={`mailto:${volunteer.email}`}
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

import { Avatar, Divider, Tooltip, Button, Row, Col, Image } from "antd";
import {
  CalendarOutlined,
  TagOutlined,
  LinkOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import {
  primaryDim,
  primary,
  primaryMid,
  accent,
  accentDim,
  globalStyles,
} from "../utils/uiHelpers";

// ── Small helpers ────────────────────────────────────────────────
export const MetaRow = ({ icon, label, value, mono = false }) => {
  return (
    <div
      className="mp-meta-row"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "9px 10px",
        transition: "background 0.2s ease",
        cursor: "default",
      }}
    >
      <span
        style={{
          color: primary,
          fontSize: 14,
          marginTop: 2,
          flexShrink: 0,
          width: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#aaa",
            margin: "0 0 2px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: mono
              ? "'Courier New', monospace"
              : "'Outfit', sans-serif",
            fontSize: mono ? 11 : 13,
            fontWeight: 500,
            color: "#333",
            margin: 0,
            wordBreak: "break-all",
            lineHeight: 1.5,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export const SectionLabel = ({ children }) => {
  return (
    <p
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#bbb",
        margin: "16px 0 6px 10px",
      }}
    >
      {children}
    </p>
  );
};

// ── Main ─────────────────────────────────────────────────────────
function MediaPreview({ content }) {
  const [copied, setCopied] = useState(false);

  if (!content) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 400,
          color: "#ccc",
          gap: 12,
        }}
      >
        <EyeOutlined style={{ fontSize: 40, color: "#ddd" }} />
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: "#bbb",
            margin: 0,
          }}
        >
          Select a media item to preview
        </p>
      </div>
    );
  }

  const isVideo = content.type === "video";
  const uploadDate = new Date(content.createdAt).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const uploadTime = new Date(content.createdAt).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const updateDate = new Date(content.updatedAt).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const updateTime = new Date(content.updatedAt).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(content.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(133,74,154,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
          overflow: "hidden",
          fontFamily: "'Outfit', sans-serif",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          margin: 0,
        }}
      >
        {/* ── Media display ── */}
        <div
          style={{
            position: "relative",
            background: "#0d0814",
            flexShrink: 0,
          }}
        >
          {/* Type badge */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 20,
              background: "rgba(10,5,20,0.75)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {isVideo ? (
              <VideoCameraOutlined style={{ color: accent, fontSize: 12 }} />
            ) : (
              <PictureOutlined style={{ color: primary, fontSize: 12 }} />
            )}
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: isVideo ? accent : "#c08adb",
              }}
            >
              {content.type}
            </span>
          </div>

          {/* Banner ribbon */}
          {content.banner && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 2,
                padding: "4px 12px",
                borderRadius: 20,
                background: accentDim,
                border: `1px solid rgba(254,165,73,0.3)`,
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accent,
                }}
              >
                <TagOutlined style={{ marginRight: 4 }} />
                {content.banner}
              </span>
            </div>
          )}

          {isVideo ? (
            <video
              src={content.url}
              controls
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "contain",
                display: "block",
                background: "#0d0814",
              }}
            />
          ) : (
            <Image
              src={content.url}
              alt={content.title}
              preview
              wrapperStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                maxHeight: 300,
                background: "#0d0814",
                overflow: "hidden",
              }}
              style={{
                maxHeight: 300,
                objectFit: "contain",
                display: "block",
              }}
            />
          )}

          {/* Bottom gradient */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background:
                "linear-gradient(to bottom, transparent, rgba(5,2,12,0.6))",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Scrollable info panel ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 20px 0",
          }}
        >
          {/* Description */}

          {content.description && (
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#777",
                lineHeight: 1.7,
                margin: "0 0 16px",
              }}
            >
              {content.description}
            </p>
          )}

          <Divider
            style={{ margin: "0 0 4px", borderColor: "rgba(133,74,154,0.1)" }}
          />

          {/* ── Details ── */}
          <SectionLabel>Details</SectionLabel>
          <Row gutter={[12, 12]} justify={"space-between"}>
            <Col>
              <MetaRow
                icon={<CalendarOutlined />}
                label="Uploaded"
                value={`${uploadDate} at ${uploadTime}`}
              />
            </Col>
            <Col>
              <MetaRow
                icon={<ClockCircleOutlined />}
                label="Last updated"
                value={`${updateDate} at ${updateTime}`}
              />
            </Col>
            <Col>
              <MetaRow
                icon={<TagOutlined />}
                label="Banner / Tag"
                value={content.banner || "—"}
              />
            </Col>
          </Row>

          {/* ── Author ── */}
          <SectionLabel>Uploaded by</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 10px",
              borderRadius: 10,
              background: primaryDim,
              border: `1px solid ${primaryMid}`,
              marginBottom: 4,
            }}
          >
            <Avatar
              src={content.createdBy?.avatar}
              size={40}
              style={{ border: `2px solid ${primaryMid}`, flexShrink: 0 }}
            >
              {content.createdBy?.username?.[0]?.toUpperCase()}
            </Avatar>
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: primary,
                  margin: "0 0 1px",
                }}
              >
                {content.createdBy?.username}
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: "#999",
                  margin: 0,
                }}
              >
                {content.createdBy?.email}
              </p>
            </div>
          </div>

          {/* ── URL ── */}
          <SectionLabel>URL</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 10px",
            }}
          >
            <LinkOutlined
              style={{ color: primary, fontSize: 14, flexShrink: 0 }}
            />
            <p
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "#555",
                margin: 0,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {content.url}
            </p>
            <Tooltip title={copied ? "Copied!" : "Copy URL"}>
              <button
                className="mp-copy-btn"
                onClick={handleCopy}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  flexShrink: 0,
                  border: "1px solid rgba(133,74,154,0.2)",
                  background: "transparent",
                  color: copied ? "#27ae60" : primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 12,
                  transition: "all 0.2s ease",
                  padding: 0,
                }}
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </Tooltip>
          </div>

          <div style={{ height: 20 }} />
        </div>

        {/* ── Action footer ── */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid rgba(133,74,154,0.1)",
            background: "#faf8fc",
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <Button
            icon={<LinkOutlined />}
            block
            className="mp-open-btn"
            type="primary"
            href={content.url}
            target="_blank"
            style={{
              flex: 1,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.04em",
              background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
              border: "none",
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(133,74,154,0.3)",
              transition: "all 0.22s ease",
            }}
          >
            View
          </Button>
        </div>
      </div>
    </>
  );
}

export default MediaPreview;

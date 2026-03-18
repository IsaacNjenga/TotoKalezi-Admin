import axios from "axios";
import { Avatar, Tooltip, Image } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  TagOutlined,
  PlayCircleFilled,
  FileImageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const cloudinaryUpload = axios.create({
  withCredentials: false,
});

export const cloudName = process.env.REACT_APP_CLOUD_NAME;
export const presetKey = process.env.REACT_APP_PRESET_KEY;

export const ACCEPTED_IMAGE = ".jpg,.jpeg,.png,.webp,.gif";
export const ACCEPTED_VIDEO = ".mp4,.mov,.avi,.webm,.mkv";

// ── Tokens ──────────────────────────────────────────────────────
export const sidebarBg = "rgb(7, 20, 60)";
export const primary = "#854a9a";
export const primaryGlow = "rgba(133,74,154,0.35)";
export const primaryDim = "rgba(133,74,154,0.12)";
export const primaryMid = "rgba(133,74,154,0.25)";
export const accent = "#fea549";
export const accentDim = "rgba(254,165,73,0.12)";
export const accentMid = "rgba(254,165,73,0.25)";
export const green = "#27ae60";
export const greenDim = "rgba(39,174,96,0.1)";
export const blue = "#2980b9";
export const blueDim = "rgba(41,128,185,0.1)";
export const dark = "rgb(7,20,60)";

// ── Masonry grid ─────────────────────────────────────────────────
export const Masonry = ({ items, columns = 4, gap = 14, renderItem }) => {
  const cols = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));
  return (
    <div style={{ display: "flex", gap, alignItems: "flex-start" }}>
      {cols.map((col, ci) => (
        <div
          key={ci}
          style={{ flex: 1, display: "flex", flexDirection: "column", gap }}
        >
          {col.map((item) => renderItem(item))}
        </div>
      ))}
    </div>
  );
};

// ── Media card ───────────────────────────────────────────────────
export const MediaCard = ({ item, onDelete }) => {
  const navigate = useNavigate();
  const isVideo = item.type === "video";
  const date = new Date(item.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Image.PreviewGroup>
      <div className="media-card-wrap">
        {isVideo ? (
          <>
            <video
              src={item.url}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 10,
              }}
              muted
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 40,
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
              }}
            >
              <PlayCircleFilled />
            </div>
          </>
        ) : (
          <Image
            src={item.url}
            alt={item.title}
            style={{
              width: "100%",
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
            }}
            preview={{
              cover: <EyeOutlined style={{ fontSize: 20 }} />,
            }}
          />
        )}

        {/* Hover overlay */}
        <div className="media-overlay">
          {/* Banner tag */}
          {item.banner && (
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accent,
                  background: accentDim,
                  border: `1px solid rgba(254,165,73,0.3)`,
                  borderRadius: 20,
                  padding: "2px 10px",
                }}
              >
                <TagOutlined style={{ marginRight: 4 }} />
                {item.banner}
              </span>
            </div>
          )}

          {/* Title */}
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </p>

          {/* Description */}
          {item.description && (
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.55)",
                margin: "0 0 10px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.description}
            </p>
          )}

          {/* Author row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar
                src={item.createdBy?.avatar}
                size={24}
                style={{ border: `1px solid ${primaryMid}`, flexShrink: 0 }}
              >
                {item.createdBy?.username?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    margin: 0,
                  }}
                >
                  {item.createdBy?.username}
                </p>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  {date}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6 }}>
              <Tooltip title="Edit">
                <button
                  className="media-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/media/edit/${item._id}`);
                  }}
                >
                  <EditOutlined />
                </button>
              </Tooltip>
              <Tooltip title="Delete">
                <button
                  className="media-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                  }}
                >
                  <DeleteOutlined />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Image.PreviewGroup>
  );
};

export const AlbumPageMediaCard = ({ item, onDelete }) => {
  const isVideo = item.type === "video";

  return (
    <Image.PreviewGroup>
      <div className="media-card-wrap">
        {isVideo ? (
          <>
            <video
              src={item.url}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 10,
              }}
              muted
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 40,
                pointerEvents: "none",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))",
              }}
            >
              <PlayCircleFilled />
            </div>
          </>
        ) : (
          <Image
            src={item.url}
            alt={item.title}
            style={{
              width: "100%",
              objectFit: "cover",
              borderRadius: 10,
              display: "block",
            }}
            preview={{
              cover: <EyeOutlined style={{ fontSize: 20 }} />,
            }}
          />
        )}

        {/* Hover overlay */}
        <div className="media-overlay">
          {/* Title */}
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 4px",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </p>

          {/* Delete row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6 }}>
              <Tooltip title="Remove from album">
                <button
                  className="media-action-btn delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(item);
                  }}
                >
                  <DeleteOutlined />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Image.PreviewGroup>
  );
};

// ── Stat card ────────────────────────────────────────────────────
export const MediaStatCard = ({ icon, value, label, color }) => {
  return (
    <div
      className="stat-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.25s ease",
        cursor: "default",
        flex: 1,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: 18,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: "#999",
            margin: "4px 0 0",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export const VolunteerStatCard = ({ icon, value, label, color, sub }) => {
  return (
    <div
      className="stat-card"
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.25s ease",
        flex: 1,
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: 20,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#aaa",
            margin: "4px 0 0",
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
              color: color,
              margin: "2px 0 0",
              fontWeight: 500,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
};

export const AlbumStatCard = ({ icon, value, label, color }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flex: 1,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          flexShrink: 0,
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
      <div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#aaa",
            margin: "4px 0 0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export const AlbumCard = ({ album, onView, onDelete, delay = 1 }) => {
  const date = new Date(album.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="album-card album-grid-item"
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Cover image */}
      <div
        style={{
          position: "relative",
          height: 160,
          overflow: "hidden",
          background: "#0d0814",
        }}
        onClick={() => onView(album)}
      >
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            className="album-cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.35s ease",
            }}
          />
        ) : (
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
            <FileImageOutlined
              style={{ color: primary, fontSize: 32, opacity: 0.4 }}
            />
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="album-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,2,14,0.85) 0%, rgba(5,2,14,0.2) 60%, transparent 100%)",
            opacity: 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "flex-end",
            padding: "14px",
          }}
        ></div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {album.title}
        </p>
        {album.description && (
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "#999",
              margin: "0 0 12px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: 30,
            }}
          >
            {album.description}
          </p>
        )}

        {/* Author + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Avatar
            src={album.createdBy?.avatar}
            size={22}
            style={{ border: `1px solid ${primaryMid}`, flexShrink: 0 }}
          >
            {album.createdBy?.username?.[0]?.toUpperCase()}
          </Avatar>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              color: "#aaa",
              margin: 0,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {album.createdBy?.username}
          </p>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10,
              color: "#ccc",
              flexShrink: 0,
            }}
          >
            {date}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 6,
            borderTop: "1px solid rgba(133,74,154,0.07)",
            paddingTop: 10,
          }}
        >
          <button
            className="album-action-btn"
            onClick={() => onView(album)}
            style={{
              flex: 1,
              height: 30,
              borderRadius: 7,
              border: "1px solid rgba(133,74,154,0.15)",
              background: "transparent",
              color: primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              transition: "all 0.2s ease",
            }}
          >
            Open
          </button>
          <Tooltip title="Edit">
            <button
              className="album-action-btn"
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1px solid rgba(133,74,154,0.15)",
                background: "transparent",
                color: "#aaa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.2s ease",
                padding: 0,
              }}
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="album-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(album);
              }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1px solid rgba(231,76,60,0.15)",
                background: "transparent",
                color: "#e74c3c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 13,
                transition: "all 0.2s ease",
                padding: 0,
              }}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// ── Album row (list view) ─────────────────────────────────────────
export const AlbumRow = ({ album, onView, onDelete }) => {
  const date = new Date(album.createdAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onView(album)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        cursor: "pointer",
        borderBottom: "1px solid rgba(133,74,154,0.06)",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = primaryDim)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
          background: "#0d0814",
        }}
      >
        {album.cover ? (
          <img
            src={album.cover}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
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
            <FileImageOutlined style={{ color: primary, fontSize: 16 }} />
          </div>
        )}
      </div>

      {/* Title + desc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: "0 0 2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {album.title}
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
          {album.description || "No description"}
        </p>
      </div>

      {/* Author */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
      >
        <Avatar
          src={album.createdBy?.avatar}
          size={20}
          style={{ border: `1px solid ${primaryMid}` }}
        >
          {album.createdBy?.username?.[0]?.toUpperCase()}
        </Avatar>
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color: "#888",
          }}
        >
          {album.createdBy?.username}
        </span>
      </div>

      {/* Date */}
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          color: "#ccc",
          flexShrink: 0,
          width: 90,
          textAlign: "right",
        }}
      >
        {date}
      </span>

      {/* Actions */}
      <div
        style={{ display: "flex", gap: 6, flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip title="Edit">
          <button
            className="album-action-btn"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid rgba(133,74,154,0.15)",
              background: "transparent",
              color: "#aaa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
              padding: 0,
              transition: "all 0.2s ease",
            }}
          >
            <EditOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Delete">
          <button
            className="album-delete-btn"
            onClick={() => onDelete(album)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "1px solid rgba(231,76,60,0.15)",
              background: "transparent",
              color: "#e74c3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 12,
              padding: 0,
              transition: "all 0.2s ease",
            }}
          >
            <DeleteOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export const volunteerTableCollapseStyles = `
  .vol-collapse .ant-collapse-item {
    border-bottom: 1px solid rgba(133,74,154,0.08) !important;
  }
  .vol-collapse .ant-collapse-item:last-child {
    border-bottom: none !important;
  }
  .vol-collapse .ant-collapse-header {
    background: #faf8fc !important;
    transition: background 0.2s ease !important;
  }
  .vol-collapse .ant-collapse-header:hover {
    background: ${primaryDim} !important;
  }
  .vol-collapse .ant-collapse-item-active .ant-collapse-header {
    background: ${primaryDim} !important;
    border-bottom: 1px solid ${primaryMid} !important;
  }
  .vol-collapse .ant-collapse-arrow {
    color: ${primary} !important;
  }
`;

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

  .media-card-wrap { position: relative; border-radius: 10px; overflow: hidden; cursor: pointer; break-inside: avoid; margin-bottom: 14px; }
  .media-card-wrap img,
  .media-card-wrap video { display: block; width: 100%; transition: transform 0.4s ease; border-radius: 10px; }
  .media-card-wrap:hover img,
  .media-card-wrap:hover video { transform: scale(1.04); }

  .media-overlay {
    position: absolute; inset: 0; border-radius: 10px;
    background: linear-gradient(to top, rgba(5,3,15,0.92) 0%, rgba(5,3,15,0.4) 50%, transparent 100%);
    opacity: 0; transition: opacity 0.3s ease;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 16px;
  }
  .media-card-wrap:hover .media-overlay { opacity: 1; }

  .media-action-btn {
    width: 30px; height: 30px;
    border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.8);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px;
    transition: all 0.2s ease;
    padding: 0;
  }
  .media-action-btn:hover { background: ${primary}; border-color: ${primary}; color: #fff; }
  .delete-btn:hover { background: #e74c3c !important; border-color: #e74c3c !important; }

  .upload-btn:hover { background: #6a3a7e !important; transform: translateY(-1px) !important; box-shadow: 0 6px 18px rgba(133,74,154,0.4) !important; }

  .stat-card:hover { border-color: ${primaryMid} !important; transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(133,74,154,0.2) !important; }

  .media-tabs .ant-tabs-tab { font-family: 'Outfit', sans-serif !important; font-weight: 500 !important; font-size: 13px !important; }
  .media-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: ${primary} !important; }
  .media-tabs .ant-tabs-ink-bar { background: ${primary} !important; }
  .media-tabs .ant-tabs-nav::before { border-color: rgba(133,74,154,0.12) !important; }

  .filter-select .ant-select-selector { border-color: rgba(133,74,154,0.2) !important; border-radius: 8px !important; font-family: 'Outfit', sans-serif !important; }
  .filter-select .ant-select-selector:hover { border-color: ${primary} !important; }

  .search-input .ant-input { font-family: 'Outfit', sans-serif !important; font-size: 13px !important; }
  .search-input .ant-input-prefix { color: rgba(133,74,154,0.5) !important; }
  .search-input .ant-input-affix-wrapper { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; }
  .search-input .ant-input-affix-wrapper:focus-within { border-color: ${primary} !important; box-shadow: 0 0 0 2px ${primaryDim} !important; }

  .cm-form .ant-form-item-label > label {
      font-family: 'Outfit', sans-serif !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      color: #555 !important;
    }
    .cm-form .ant-input,
    .cm-form .ant-input-affix-wrapper,
    .cm-form textarea.ant-input,
    .cm-form .ant-select-selector {
      font-family: 'Outfit', sans-serif !important;
      font-size: 14px !important;
      border-color: rgba(133,74,154,0.2) !important;
      border-radius: 8px !important;
      transition: all 0.25s ease !important;
    }
    .cm-form .ant-input:focus,
    .cm-form .ant-input-affix-wrapper-focused,
    .cm-form .ant-select-focused .ant-select-selector {
      border-color: ${primary} !important;
      box-shadow: 0 0 0 3px ${primaryDim} !important;
    }
    .cm-form .ant-input-prefix { color: rgba(133,74,154,0.5) !important; }
    .cm-form .ant-form-item-explain-error {
      font-family: 'Outfit', sans-serif !important;
      font-size: 12px !important;
    }
    .cm-form .ant-select-selector {
      border-radius: 8px !important;
    }
    .cm-form .ant-select:hover .ant-select-selector {
      border-color: ${primary} !important;
    }
  
    /* Dragger */
    .cm-dragger .ant-upload-drag {
      border: 2px dashed rgba(133,74,154,0.28) !important;
      border-radius: 12px !important;
      background: ${primaryDim} !important;
      transition: all 0.25s ease !important;
    }
    .cm-dragger .ant-upload-drag:hover,
    .cm-dragger .ant-upload-drag-hover {
      border-color: ${primary} !important;
      background: rgba(133,74,154,0.15) !important;
    }
    .cm-dragger .ant-upload-drag-icon { margin-bottom: 8px !important; }
  
    .submit-btn:hover {
      background: #6a3a7e !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 24px ${primaryGlow} !important;
    }
    .reset-btn:hover {
      border-color: ${primary} !important;
      color: ${primary} !important;
    }
    .preview-remove:hover {
      background: rgba(231,76,60,0.12) !important;
      border-color: #e74c3c !important;
      color: #e74c3c !important;
    }

      /* Sidebar menu item hover & selected */
  .admin-menu .ant-menu-item:hover,
  .admin-menu .ant-menu-submenu-title:hover {
    background: ${accentDim} !important;
    border-radius: 8px !important;
  }
  .admin-menu .ant-menu-item-selected {
    background: ${accentDim} !important;
    border-radius: 8px !important;
    border-left: 3px solid ${accent} !important;
  }
  .admin-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: ${accent} !important;
  }
  .admin-menu .ant-menu-sub {
    background: rgba(0,0,0,0.2) !important;
    border-radius: 8px !important;
    margin: 2px 4px !important;
  }
  .admin-menu .ant-menu-item,
  .admin-menu .ant-menu-submenu-title {
    border-radius: 8px !important;
    margin: 3px 4px !important;
    height: auto !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }
  .admin-menu .ant-menu-item .ant-menu-item-icon,
  .admin-menu .ant-menu-submenu-title .ant-menu-item-icon {
    min-width: 22px !important;
    font-size: 18px !important;
    color: rgba(255,255,255,0.7) !important;
    vertical-align: middle !important;
    line-height: 1 !important;
  }
  .admin-menu .ant-menu-item-selected .ant-menu-item-icon,
  .admin-menu .ant-menu-item:hover .ant-menu-item-icon {
    color: ${accent} !important;
  }
  .admin-menu .ant-menu-submenu-arrow {
    color: rgba(255,255,255,0.4) !important;
  }
  .admin-menu .ant-menu-inline.ant-menu-sub .ant-menu-item {
    padding-left: 44px !important;
  }

  .plus-btn:hover {
    background: ${accentMid} !important;
    border-color: ${accent} !important;
    color: ${accent} !important;
    transform: scale(1.1) !important;
  }

  .header-icon-btn:hover {
    background: rgba(255,255,255,0.1) !important;
    color: #fff !important;
  }

  .logout-btn:hover {
    transform: scale(1.05) !important;
  }

  .collapse-toggle:hover {
    background: ${accentDim} !important;
    border-color: ${accentMid} !important;
    color: ${accent} !important;
  }

   .mp-copy-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; }
  .mp-edit-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; transform: translateY(-1px) !important; }
  .mp-delete-btn:hover { background: rgba(231,76,60,0.1) !important; border-color: #e74c3c !important; color: #e74c3c !important; transform: translateY(-1px) !important; }
  .mp-open-btn:hover { background: #6a3a7e !important; transform: translateY(-1px) !important; box-shadow: 0 6px 18px rgba(133,74,154,0.4) !important; }
  .mp-meta-row:hover { background: ${primaryDim} !important; border-radius: 8px !important; }

  /* Make scrollbar paper-thin and minimal */
::-webkit-scrollbar {    
  height: 2px; /* Use height for horizontal scrolling */
  width: 2px;  /* Keep this too, for vertical scroll areas */
}

::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2);
}

::-webkit-scrollbar-thumb {
  background: rgb(144, 137, 137);
  border-radius: 1px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0);
}

::-webkit-scrollbar-button {
  display: none;
}

 .vol-table .ant-table { font-family: 'Outfit', sans-serif !important; overflow: hidden !important; }
  .vol-table .ant-table-thead > tr > th {
    font-family: 'Outfit', sans-serif !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.1em !important; text-transform: uppercase !important;
    color: #888 !important;
    background: #faf8fc !important;
    border-bottom: 1px solid rgba(133,74,154,0.1) !important;
    padding: 14px 16px !important;
  }
  .vol-table .ant-table-tbody > tr > td {
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important;
    padding: 6px 16px !important;
    border-bottom: 1px solid rgba(133,74,154,0.06) !important;
    transition: background 0.2s ease !important;
  }
  .vol-table .ant-table-tbody > tr:hover > td { background: ${primaryDim} !important; }
  .vol-table .ant-table-tbody > tr.unread-row > td { background: rgba(118, 73, 134, 0.04) !important; }
  .vol-table .ant-table-tbody > tr.unread-row:hover > td { background: ${primaryDim} !important; }
  .vol-table .ant-pagination { font-family: 'Outfit', sans-serif !important;  }
  .vol-table .ant-pagination-item-active { border-color: ${primary} !important; }
  .vol-table .ant-pagination-item-active a { color: ${primary} !important; }

  .mark-read-btn:hover { background: rgba(39,174,96,0.1) !important; border-color: #27ae60 !important; color: #27ae60 !important; }

  .stat-card:hover { border-color: ${primaryMid} !important; transform: translateY(-2px) !important; box-shadow: 0 8px 24px rgba(133,74,154,0.15) !important; }

  .filter-select .ant-select-selector { border-color: rgba(133,74,154,0.2) !important; border-radius: 8px !important; font-family: 'Outfit', sans-serif !important; }
  .filter-select .ant-select-selector:hover,
  .filter-select.ant-select-focused .ant-select-selector { border-color: ${primary} !important; }

  .search-wrap .ant-input-affix-wrapper { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; font-family: 'Outfit', sans-serif !important; }
  .search-wrap .ant-input-affix-wrapper:focus-within { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${primaryDim} !important; }
  .search-wrap .ant-input-prefix { color: rgba(133,74,154,0.45) !important; }


   .vol-collapse .ant-collapse-item {
    border-bottom: 1px solid rgba(133,74,154,0.08) !important;
  }
  .vol-collapse .ant-collapse-item:last-child {
    border-bottom: none !important;
  }
  .vol-collapse .ant-collapse-header {
    background: #faf8fc !important;
    transition: background 0.2s ease !important;
  }
  .vol-collapse .ant-collapse-header:hover {
    background: ${primaryDim} !important;
  }
  .vol-collapse .ant-collapse-item-active .ant-collapse-header {
    background: ${primaryDim} !important;
    border-bottom: 1px solid ${primaryMid} !important;
  }
  .vol-collapse .ant-collapse-arrow {
    color: ${primary} !important;
  }

  .vol-table .ant-pagination {
  font-size: 12px;
}

.vol-table .ant-pagination-item {
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 10px;
}

.vol-table .ant-pagination-prev,
.vol-table .ant-pagination-next {
  min-width: 26px;
  height: 26px;
  line-height: 24px;
}

.vol-table .ant-pagination-options {
  font-size: 12px;
}

.vol-table .ant-select-selector {
  height: 12px !important;
}

 .don-table .ant-table { font-family: 'Outfit', sans-serif !important; }
  .don-table .ant-table-thead > tr > th {
    font-family: 'Outfit', sans-serif !important;
    font-size: 11px !important; font-weight: 700 !important;
    letter-spacing: 0.1em !important; text-transform: uppercase !important;
    color: #888 !important; background: #faf8fc !important;
    border-bottom: 1px solid rgba(133,74,154,0.1) !important;
    padding: 12px 16px !important;
  }
  .don-table .ant-table-tbody > tr > td {
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important; padding: 12px 16px !important;
    border-bottom: 1px solid rgba(133,74,154,0.06) !important;
    transition: background 0.2s ease !important;
  }
  .don-table .ant-table-tbody > tr:hover > td { background: ${primaryDim} !important; }
  .don-table .ant-table-tbody > tr.unread-row > td { background: rgba(133,74,154,0.03) !important; }
  .don-table .ant-table-tbody > tr.unread-row:hover > td { background: ${primaryDim} !important; }
  .don-table .ant-pagination { font-family: 'Outfit', sans-serif !important; padding: 12px 16px !important; }
  .don-table .ant-pagination-item-active { border-color: ${primary} !important; }
  .don-table .ant-pagination-item-active a { color: ${primary} !important; }

  .don-collapse .ant-collapse-item {
    border-bottom: 1px solid rgba(133,74,154,0.08) !important;
  }
  .don-collapse .ant-collapse-item:last-child { border-bottom: none !important; }
  .don-collapse .ant-collapse-header {
    background: #faf8fc !important;
    transition: background 0.2s ease !important;
  }
  .don-collapse .ant-collapse-header:hover { background: ${primaryDim} !important; }
  .don-collapse .ant-collapse-item-active .ant-collapse-header {
    background: ${primaryDim} !important;
    border-bottom: 1px solid ${primaryMid} !important;
  }
  .don-collapse .ant-collapse-arrow { color: ${primary} !important; }

  .don-search .ant-input-affix-wrapper {
    border-radius: 8px !important;
    border-color: rgba(133,74,154,0.2) !important;
    font-family: 'Outfit', sans-serif !important;
  }
  .don-search .ant-input-affix-wrapper:focus-within {
    border-color: ${primary} !important;
    box-shadow: 0 0 0 3px ${primaryDim} !important;
  }
  .don-search .ant-input-prefix { color: rgba(133,74,154,0.45) !important; }
  .don-filter .ant-select-selector {
    border-color: rgba(133,74,154,0.2) !important;
    border-radius: 8px !important;
    font-family: 'Outfit', sans-serif !important;
  }
  .don-filter.ant-select-focused .ant-select-selector,
  .don-filter .ant-select-selector:hover { border-color: ${primary} !important; }

   @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }

  .dash-stat-card { transition: all 0.25s ease !important; animation: fadeUp 0.5s ease both; }
  .dash-stat-card:hover { transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
  .dash-activity-row { transition: background 0.2s ease; border-radius: 8px; }
  .dash-activity-row:hover { background: ${primaryDim} !important; }
  .dash-bar { transition: filter 0.2s ease, opacity 0.2s ease; }
  .dash-bar:hover { filter: brightness(1.15) !important; opacity: 0.9; }
  .media-thumb:hover .media-thumb-overlay { opacity: 1 !important; }

  .album-card { transition: all 0.25s ease; cursor: pointer; }
    .album-card:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(133,74,154,0.18) !important; border-color: ${primaryMid} !important; }
    .album-card:hover .album-cover { transform: scale(1.04); }
    .album-card:hover .album-overlay { opacity: 1 !important; }
  
    .album-action-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; }
    .album-delete-btn:hover { background: rgba(231,76,60,0.1) !important; border-color: #e74c3c !important; color: #e74c3c !important; }
    .add-album-btn:hover { background: #6a3a7e !important; transform: translateY(-1px) !important; box-shadow: 0 8px 20px rgba(133,74,154,0.4) !important; }
  
    .don-search .ant-input-affix-wrapper { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; font-family: 'Outfit', sans-serif !important; }
    .don-search .ant-input-affix-wrapper:focus-within { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${primaryDim} !important; }
    .don-search .ant-input-prefix { color: rgba(133,74,154,0.45) !important; }
    .don-filter .ant-select-selector { border-color: rgba(133,74,154,0.2) !important; border-radius: 8px !important; font-family: 'Outfit', sans-serif !important; }
    .don-filter.ant-select-focused .ant-select-selector,
    .don-filter .ant-select-selector:hover { border-color: ${primary} !important; }
  
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .album-grid-item { animation: fadeUp 0.4s ease both; }


     @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
    
      .ap-media-card { break-inside: avoid; margin-bottom: 12px; cursor: pointer; }
      .ap-media-card .ap-img { display: block; width: 100%; border-radius: 10px; transition: transform 0.35s ease; }
      .ap-media-card:hover .ap-img { transform: scale(1.03); }
      .ap-media-card:hover .ap-overlay { opacity: 1 !important; }
    
      .ap-filter-select .ant-select-selector { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; font-family: 'Outfit', sans-serif !important; }
      .ap-filter-select.ant-select-focused .ant-select-selector,
      .ap-filter-select .ant-select-selector:hover { border-color: ${primary} !important; }
      .ap-search .ant-input-affix-wrapper { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; font-family: 'Outfit', sans-serif !important; }
      .ap-search .ant-input-affix-wrapper:focus-within { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${primaryDim} !important; }
      .ap-search .ant-input-prefix { color: rgba(133,74,154,0.4) !important; }
    
      .ap-back-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; }
      .ap-action-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; }
      .ap-delete-btn:hover { background: rgba(231,76,60,0.1) !important; border-color: #e74c3c !important; color: #e74c3c !important; }
    
      .view-toggle-btn { transition: all 0.2s ease; }
      .view-toggle-btn:hover { color: ${primary} !important; }

        .amp-item { position: relative; cursor: pointer; border-radius: 9px; overflow: hidden; background: #0d0814; }
        .amp-item img,
        .amp-item video { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .amp-item:hover img,
        .amp-item:hover video { transform: scale(1.05); }
        .amp-item .amp-hover { opacity: 0; transition: opacity 0.22s ease; }
        .amp-item:hover .amp-hover { opacity: 1; }
        .amp-item.selected { outline: 2.5px solid ${primary}; outline-offset: 0px; }
        .amp-item.selected img,
        .amp-item.selected video { transform: scale(1.03); }
      
        .amp-search .ant-input-affix-wrapper { border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; font-family: 'Outfit', sans-serif !important; font-size: 13px !important; }
        .amp-search .ant-input-affix-wrapper:focus-within { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${primaryDim} !important; }
        .amp-search .ant-input-prefix { color: rgba(133,74,154,0.4) !important; }
      
        .amp-clear-btn:hover { border-color: #e74c3c !important; color: #e74c3c !important; background: rgba(231,76,60,0.06) !important; }
        .amp-copy-btn:hover { border-color: ${primary} !important; color: ${primary} !important; background: ${primaryDim} !important; }
      
 @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }

  .wp-page-card { transition: all 0.25s ease !important; animation: fadeUp 0.4s ease both; }
  .wp-page-card:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 30px rgba(133,74,154,0.15) !important; border-color: ${primaryMid} !important; }

  .wp-edit-btn:hover { background: ${primaryDim} !important; border-color: ${primaryMid} !important; color: ${primary} !important; }
  .wp-save-btn:hover { background: #6a3a7e !important; transform: translateY(-1px) !important; box-shadow: 0 6px 18px rgba(133,74,154,0.4) !important; }
  .wp-cancel-btn:hover { border-color: #e74c3c !important; color: #e74c3c !important; }
  .wp-upload-zone:hover { border-color: ${primary} !important; background: rgba(133,74,154,0.08) !important; }

  .wp-url-input .ant-input { font-family: 'Outfit', sans-serif !important; font-size: 13px !important; border-radius: 8px !important; border-color: rgba(133,74,154,0.2) !important; }
  .wp-url-input .ant-input:focus { border-color: ${primary} !important; box-shadow: 0 0 0 3px ${primaryDim} !important; }
  .wp-url-input .ant-input-prefix { color: rgba(133,74,154,0.4) !important; }

  .wp-progress-bar {
    height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, ${primary}, #a066bc, ${accent});
    background-size: 400px 100%;
    animation: shimmer 1.5s infinite linear;
  }

  `;

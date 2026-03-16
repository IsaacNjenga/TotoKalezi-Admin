import  { useState, useMemo } from "react";
import {
  Avatar,
  Button,
  Input,
  Select,
  Tooltip,
  Empty,
  Modal,
    Divider,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  FileImageOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetchAllAlbums from "../hooks/fetchAllAlbums";
import LoadingComponent from "../components/LoadingComponent";
import {
  globalStyles,
  primary,
  primaryDim,
  primaryMid,
  accent,
} from "../utils/uiHelpers";

// ── Extra styles ─────────────────────────────────────────────────
const albumStyles = `
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
`;

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({ icon, value, label, color }) {
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
}

// ── Album card (grid) ─────────────────────────────────────────────
function AlbumCard({ album, onView, onDelete, delay = 0 }) {
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
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <EyeOutlined style={{ color: "#fff", fontSize: 12 }} />
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              View Album
            </span>
          </div>
        </div>
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
            <EyeOutlined style={{ fontSize: 12 }} /> View
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
}

// ── Album row (list view) ─────────────────────────────────────────
function AlbumRow({ album, onView, onDelete }) {
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
}

// ── Album detail modal content ────────────────────────────────────
function AlbumDetail({ album }) {
  if (!album) return null;

  const date = new Date(album.createdAt).toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = new Date(album.createdAt).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: 200,
          background: "#0d0814",
          overflow: "hidden",
        }}
      >
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
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
            <FileImageOutlined style={{ color: primary, fontSize: 40 }} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,2,14,0.8) 0%, transparent 60%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 16, left: 20 }}>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
            }}
          >
            {album.title}
          </h3>
        </div>
      </div>

      <div style={{ padding: "20px 24px 24px" }}>
        {album.description && (
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#666",
              lineHeight: 1.7,
              margin: "0 0 18px",
            }}
          >
            {album.description}
          </p>
        )}

        <Divider
          style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 16px" }}
        />

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            borderRadius: 10,
            background: primaryDim,
            border: `1px solid ${primaryMid}`,
            marginBottom: 12,
          }}
        >
          <Avatar
            src={album.createdBy?.avatar}
            size={36}
            style={{ border: `2px solid ${primaryMid}`, flexShrink: 0 }}
          >
            {album.createdBy?.username?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: primary,
                margin: 0,
              }}
            >
              {album.createdBy?.username}
            </p>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "#aaa",
                margin: 0,
              }}
            >
              {album.createdBy?.email}
            </p>
          </div>
        </div>

        {/* Meta */}
        {[
          {
            icon: <CalendarOutlined />,
            label: "Created",
            value: `${date} at ${time}`,
          },
          { icon: <UserOutlined />, label: "ID", value: album._id },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 7,
              marginBottom: 2,
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
                marginTop: 2,
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
                  fontSize: label === "ID" ? 11 : 13,
                  fontWeight: 500,
                  color: "#333",
                  margin: 0,
                  fontFamily:
                    label === "ID"
                      ? "'Courier New', monospace"
                      : "'Outfit', sans-serif",
                }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
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
            Edit Album
          </Button>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              style={{
                borderRadius: 7,
                border: "1px solid rgba(231,76,60,0.2)",
                color: "#e74c3c",
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
function Album() {
  const { albums, loading, refresh } = useFetchAllAlbums();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const contributors = useMemo(
    () => new Set(albums?.map((a) => a.createdBy?._id)).size,
    [albums],
  );

  const filtered = useMemo(() => {
    let base = albums ?? [];
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.createdBy?.username?.toLowerCase().includes(q),
      );
    }
    if (sortBy === "newest")
      base = [...base].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    if (sortBy === "oldest")
      base = [...base].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    if (sortBy === "title")
      base = [...base].sort((a, b) => a.title?.localeCompare(b.title));
    return base;
  }, [albums, search, sortBy]);

  const openView = (album) => {
    setSelected(album);
    setModalOpen(true);
  };

  if (loading) return <LoadingComponent />;

  return (
    <>
      <style>
        {globalStyles}
        {albumStyles}
      </style>
      <div style={{ padding: "0 0 40px", fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 2px",
              }}
            >
              Albums
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Manage photo albums displayed on the website.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Tooltip title="Refresh">
              <Button
                icon={<ReloadOutlined />}
                onClick={refresh}
                style={{
                  borderRadius: 8,
                  borderColor: "rgba(133,74,154,0.2)",
                  color: primary,
                }}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="add-album-btn"
              onClick={() => navigate("/albums/create")}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
                border: "none",
                borderRadius: 8,
                boxShadow: "0 2px 12px rgba(133,74,154,0.3)",
                transition: "all 0.25s ease",
              }}
            >
              New Album
            </Button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          <StatCard
            icon={<FileImageOutlined />}
            value={albums?.length ?? 0}
            label="Total Albums"
            color={primary}
          />
          <StatCard
            icon={<UserOutlined />}
            value={contributors}
            label="Contributors"
            color={accent}
          />
          <StatCard
            icon={<CalendarOutlined />}
            value={
              albums?.length
                ? new Date(
                    Math.max(...albums.map((a) => new Date(a.createdAt))),
                  ).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "short",
                  })
                : "—"
            }
            label="Latest Upload"
            color="#27ae60"
          />
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 10, flex: 1 }}>
            <div className="don-search" style={{ flex: 1, maxWidth: 280 }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search albums…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </div>
            <Select
              className="don-filter"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 140 }}
              options={[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
                { label: "Title A–Z", value: "title" },
              ]}
            />
          </div>

          {/* View toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "3px",
              borderRadius: 8,
              background: "rgba(133,74,154,0.07)",
              border: "1px solid rgba(133,74,154,0.1)",
            }}
          >
            {[
              { mode: "grid", icon: <AppstoreOutlined /> },
              { mode: "list", icon: <UnorderedListOutlined /> },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 30,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: viewMode === mode ? "#fff" : "transparent",
                  color: viewMode === mode ? primary : "#aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 14,
                  boxShadow:
                    viewMode === mode ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Count bar ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px 12px 0 0",
            border: "1px solid rgba(133,74,154,0.08)",
            borderBottom: "1px solid rgba(133,74,154,0.07)",
            padding: "8px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "#bbb",
              margin: 0,
            }}
          >
            Showing <strong style={{ color: "#666" }}>{filtered.length}</strong>{" "}
            of <strong style={{ color: "#666" }}>{albums?.length ?? 0}</strong>{" "}
            albums
          </p>
        </div>

        {/* ── Content ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(133,74,154,0.08)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            overflow: "hidden",
            padding: viewMode === "grid" ? "16px" : 0,
            minHeight: 200,
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: "60px 20px" }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      color: "#bbb",
                    }}
                  >
                    No albums found
                  </span>
                }
              />
            </div>
          ) : viewMode === "grid" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              {filtered.map((album, i) => (
                <AlbumCard
                  key={album._id}
                  album={album}
                  delay={i * 50}
                  onView={openView}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            <div>
              {filtered.map((album) => (
                <AlbumRow
                  key={album._id}
                  album={album}
                  onView={openView}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail modal ── */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        centered
        footer={null}
        width={460}
        closeIcon={
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: `1px solid ${primaryMid}`,
              background: primaryDim,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: primary,
              fontSize: 12,
            }}
          >
            ✕
          </div>
        }
        styles={{
          content: {
            padding: 0,
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${primaryMid}`,
          },
          header: { display: "none" },
          body: { padding: 0 },
          mask: {
            backdropFilter: "blur(4px)",
            background: "rgba(10,5,20,0.5)",
          },
        }}
      >
        <AlbumDetail album={selected} />
      </Modal>

      {/* ── Delete confirm modal ── */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={() => {
          /* wire delete API */ setDeleteTarget(null);
        }}
        centered
        okText="Delete"
        okButtonProps={{
          danger: true,
          style: {
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            borderRadius: 8,
          },
        }}
        cancelButtonProps={{
          style: { fontFamily: "'Outfit', sans-serif", borderRadius: 8 },
        }}
        title={
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
            Delete Album
          </span>
        }
      >
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: "#555",
          }}
        >
          Are you sure you want to delete{" "}
          <strong>"{deleteTarget?.title}"</strong>? This cannot be undone.
        </p>
        {deleteTarget?.cover && (
          <img
            src={deleteTarget.cover}
            alt=""
            style={{
              width: "100%",
              maxHeight: 140,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default Album;

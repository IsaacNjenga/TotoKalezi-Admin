import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchAlbum from "../hooks/fetchAlbum";
import { Avatar, Image, Input, Select, Empty, Button } from "antd";
import {
  ArrowLeftOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  TagOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileAddFilled,
} from "@ant-design/icons";
import {
  primary,
  primaryDim,
  primaryMid,
  accent,
  globalStyles,
  Masonry,
  AlbumPageMediaCard,
} from "../utils/uiHelpers";
import LoadingComponent from "../components/LoadingComponent";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import DeleteModal from "../components/DeleteModal";
import AllMediaPreview from "../components/AllMediaPreview";
import DetailsModal from "../components/DetailsModal";

function AlbumPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const openNotification = useNotification();
  const { album, loading, fetchAlbum } = useFetchAlbum();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (id) fetchAlbum(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, refreshKey]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const media = album?.media ?? [];

  const images = useMemo(
    () => media.filter((m) => m.type === "image"),
    [media],
  );
  const videos = useMemo(
    () => media.filter((m) => m.type === "video"),
    [media],
  );
  const banners = useMemo(
    () => [...new Set(media.map((m) => m.banner).filter(Boolean))],
    [media],
  );

  const filtered = useMemo(() => {
    let base = media;
    if (typeFilter !== "all") base = base.filter((m) => m.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.banner?.toLowerCase().includes(q),
      );
    }
    return base;
  }, [media, typeFilter, search]);

  const date = album
    ? new Date(album.createdAt).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`delete-album/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        openNotification("success", "Deleted successfully", "Done!");
        navigate("/media/albums");
      }
    } catch (error) {
      console.error("Error deleting album", error);
      openNotification(
        "Error deleting media",
        "An error occurred while trying to delete the album. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRemove = async (_id) => {
    setDeleteLoading(true);
    try {
      const mediaId = _id._id;
      const res = await axios.delete(
        `delete-album-media/${id}?mediaId=${mediaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        // openNotification("success", "Removed successfully", "Done!");
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error removing media", error);
      openNotification(
        "Error removing media",
        "An error occurred while trying to remove the media. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 48px", fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Back button ── */}
        <button
          className="ap-back-btn"
          onClick={() => navigate(-1)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid rgba(133,74,154,0.2)",
            background: "transparent",
            color: "#777",
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeftOutlined style={{ fontSize: 13 }} /> Back to Albums
        </button>

        {/* ── Hero ── */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 24,
            position: "relative",
            background: "#0d0814",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            animation: "fadeIn 0.6s ease both",
          }}
        >
          {/* Cover */}
          {album?.cover && (
            <img
              src={album.cover}
              alt={album.title}
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                display: "block",
                opacity: 0.6,
              }}
            />
          )}

          {/* Gradient overlays */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,2,14,0.97) 0%, rgba(5,2,14,0.4) 60%, transparent 100%)",
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

          {/* Content */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "28px 32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                {/* Stats pills */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    {
                      icon: <PictureOutlined />,
                      label: `${images.length} images`,
                      color: primary,
                    },
                    {
                      icon: <VideoCameraOutlined />,
                      label: `${videos.length} videos`,
                      color: accent,
                    },
                    ...banners.slice(0, 3).map((b) => ({
                      icon: <TagOutlined />,
                      label: b,
                      color: "#2980b9",
                    })),
                  ].map(({ icon, label, color }) => (
                    <span
                      key={label}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: `${color}22`,
                        border: `1px solid ${color}44`,
                        color,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {icon}
                      {label}
                    </span>
                  ))}
                </div>

                <h1
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  {album?.title}
                </h1>
                {album?.description && (
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      margin: 0,
                      maxWidth: 560,
                      ellipsis: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {album.description}
                  </p>
                )}
              </div>

              {/* Author + actions */}
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.8)",
                        margin: 0,
                      }}
                    >
                      {album?.createdBy?.username}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.35)",
                        margin: 0,
                      }}
                    >
                      {date}
                    </p>
                  </div>
                  <Avatar
                    src={album?.createdBy?.avatar}
                    size={36}
                    style={{
                      border: `2px solid rgba(133,74,154,0.4)`,
                      flexShrink: 0,
                    }}
                  >
                    {album?.createdBy?.username?.[0]?.toUpperCase()}
                  </Avatar>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="ap-action-btn"
                    onClick={() => navigate(`/media/edit-album/${album._id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 14px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <EditOutlined style={{ fontSize: 12 }} />
                  </button>
                  <button
                    className="ap-delete-btn"
                    onClick={() => {
                      setDeleteTarget(album);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid rgba(231,76,60,0.25)",
                      background: "rgba(231,76,60,0.1)",
                      color: "#e74c3c",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      padding: 0,
                    }}
                  >
                    <DeleteOutlined style={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Media section ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(133,74,154,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                Media
              </p>
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 8px",
                  borderRadius: 20,
                  background: primaryDim,
                  border: `1px solid ${primaryMid}`,
                  color: primary,
                }}
              >
                {filtered.length}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button
                icon={<FileAddFilled />}
                type={"primary"}
                style={{
                  background: primary,
                  border: `1px solid ${primary}`,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onClick={() => setOpenMediaModal(true)}
              >
                Add Media
              </Button>
              {/* Search */}
              <div className="ap-search">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search media…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  allowClear
                  style={{ width: 200 }}
                />
              </div>

              {/* Type filter */}
              <Select
                className="ap-filter-select"
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
                options={[
                  { label: "All", value: "all" },
                  { label: "Images", value: "image" },
                  { label: "Videos", value: "video" },
                ]}
              />
            </div>
          </div>

          {/* Media content */}
          <div style={{ padding: 16 }}>
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
                      No media in this album
                    </span>
                  }
                />
              </div>
            ) : (
              <Image.PreviewGroup>
                <Masonry
                  items={filtered}
                  columns={4}
                  renderItem={(item) => (
                    <AlbumPageMediaCard
                      key={item._id}
                      item={item}
                      onDelete={handleRemove}
                    />
                  )}
                />
              </Image.PreviewGroup>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        handleDelete={handleDelete}
        deleteLoading={deleteLoading}
      />

      <DetailsModal
        open={openMediaModal}
        setOpen={setOpenMediaModal}
        width={1000}
        component={
          <AllMediaPreview
            id={id}
            setOpenMediaModal={setOpenMediaModal}
            setRefreshKey={setRefreshKey}
          />
        }
      />
    </>
  );
}

export default AlbumPage;

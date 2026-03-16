import { useState, useMemo } from "react";
import { Tabs, Input, Select, Empty, Tooltip, Tag, Button, Modal } from "antd";
import {
  PictureOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  UserOutlined,
  PlusOutlined,
  ReloadOutlined,
  TagOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetchAllMedia from "../hooks/fetchAllMedia.js";
import LoadingComponent from "../components/LoadingComponent.js";
import { useNotification } from "../contexts/NotificationContext/index.js";
import { useAuth } from "../contexts/AuthContext/index.js";
import axios from "axios";
import MediaPreview from "../components/MediaPreview.js";
import DetailsDrawer from "../components/DetailsDrawer.js";
import {
  primary,
  accent,
  globalStyles,
  MediaStatCard,
  MediaCard,
  Masonry,
} from "../utils/uiHelpers";

// ── Main ─────────────────────────────────────────────────────────
function Media() {
  const { token } = useAuth();
  const openNotification = useNotification();
  const navigate = useNavigate();

  const { media, loading, refresh } = useFetchAllMedia();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mediaContent, setMediaContent] = useState(null);

  const toggleDrawer = () => setOpen((o) => !o);

  const handleMediaDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`delete-media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        openNotification("success", "Deleted successfully", "Done!");
      }
    } catch (error) {
      console.error("Error deleting media", error);
      openNotification(
        "Error deleting media",
        "An error occurred while trying to delete the media. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const images = useMemo(
    () => media?.filter((m) => m.type === "image") ?? [],
    [media],
  );
  const videos = useMemo(
    () => media?.filter((m) => m.type === "video") ?? [],
    [media],
  );

  const filtered = useMemo(() => {
    let base =
      activeTab === "images"
        ? images
        : activeTab === "videos"
          ? videos
          : (media ?? []);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.banner?.toLowerCase().includes(q) ||
          m.createdBy?.username?.toLowerCase().includes(q),
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
  }, [media, images, videos, activeTab, search, sortBy]);

  if (loading) return <LoadingComponent />;

  const tabItems = [
    {
      key: "all",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          All
          <Tag
            color={primary}
            style={{
              margin: 0,
              fontSize: 10,
              padding: "0 6px",
              lineHeight: "18px",
            }}
          >
            {media?.length ?? 0}
          </Tag>
        </span>
      ),
    },
    {
      key: "images",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <PictureOutlined /> Images
          <Tag
            color="default"
            style={{
              margin: 0,
              fontSize: 10,
              padding: "0 6px",
              lineHeight: "18px",
            }}
          >
            {images.length}
          </Tag>
        </span>
      ),
    },
    {
      key: "videos",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <VideoCameraOutlined /> Videos
          <Tag
            color="default"
            style={{
              margin: 0,
              fontSize: 10,
              padding: "0 6px",
              lineHeight: "18px",
            }}
          >
            {videos.length}
          </Tag>
        </span>
      ),
    },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 40px", fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Top bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
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
              Media Library
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Manage all images and videos for the foundation website.
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
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="upload-btn"
              onClick={() => navigate("/media/create")}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.04em",
                background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
                border: "none",
                borderRadius: 8,
                boxShadow: "0 2px 12px rgba(133,74,154,0.3)",
                transition: "all 0.25s ease",
              }}
            >
              Upload Media
            </Button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          <MediaStatCard
            icon={<PictureOutlined />}
            value={images.length}
            label="Total Images"
            color={primary}
          />
          <MediaStatCard
            icon={<VideoCameraOutlined />}
            value={videos.length}
            label="Total Videos"
            color="#3498db"
          />
          <MediaStatCard
            icon={<UserOutlined />}
            value={new Set(media?.map((m) => m.createdBy?._id)).size}
            label="Contributors"
            color={accent}
          />
          <MediaStatCard
            icon={<TagOutlined />}
            value={new Set(media?.map((m) => m.banner).filter(Boolean)).size}
            label="Banners / Tags"
            color="#27ae60"
          />
        </div>

        {/* ── Filters bar ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="media-tabs"
            style={{ marginBottom: 0, flex: 1 }}
            tabBarStyle={{ marginBottom: 0 }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <Input
              className="search-input"
              prefix={<SearchOutlined />}
              placeholder="Search by title, author, tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              style={{ width: 240 }}
            />
            <Select
              className="filter-select"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
                { label: "Title A–Z", value: "title" },
              ]}
              style={{ width: 140 }}
            />
          </div>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(133,74,154,0.08)",
              padding: "80px 20px",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span
                  style={{ fontFamily: "'Outfit', sans-serif", color: "#aaa" }}
                >
                  No media found
                </span>
              }
            />
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(133,74,154,0.08)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  color: "#bbb",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                Showing{" "}
                <strong style={{ color: "#666" }}>{filtered.length}</strong>{" "}
                items
              </p>
            </div>

            <Masonry
              items={filtered}
              columns={4}
              gap={14}
              renderItem={(item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    toggleDrawer();
                    setMediaContent(item);
                  }}
                >
                  <MediaCard item={item} onDelete={setDeleteTarget} />
                </div>
              )}
            />
          </div>
        )}

        {/* ── Delete confirmation modal ── */}
        <Modal
          open={!!deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onOk={async () => {
            handleMediaDelete(deleteTarget._id);
            setDeleteTarget(null);
            setTimeout(() => {
              refresh();
            }, 1000);
          }}
          okText={deleteLoading ? <LoadingOutlined /> : "Delete"}
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
            <span
              style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
            >
              Delete Media
            </span>
          }
          centered
        >
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              color: "#555",
            }}
          >
            Are you sure you want to delete{" "}
            <strong>"{deleteTarget?.title}"</strong>? This action cannot be
            undone.
          </p>
          {deleteTarget?.url && (
            <img
              src={deleteTarget.url}
              alt=""
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}
        </Modal>

        {/* ── Media preview modal ── */}
        {mediaContent && (
          <DetailsDrawer
            open={open}
            title={mediaContent.title}
            toggleDrawer={toggleDrawer}
            component={<MediaPreview content={mediaContent} />}
          />
        )}
      </div>
    </>
  );
}

export default Media;

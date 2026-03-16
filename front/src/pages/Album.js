import { useState, useMemo } from "react";
import { Button, Input, Select, Tooltip, Empty, Modal } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  FileImageOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetchAllAlbums from "../hooks/fetchAllAlbums";
import LoadingComponent from "../components/LoadingComponent";
import {
  globalStyles,
  primary,
  accent,
  AlbumStatCard,
  AlbumCard,
  AlbumRow,
} from "../utils/uiHelpers";
import { AlbumDetail } from "../components/AlbumPreview";
import DetailsModal from "../components/DetailsModal";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";

function Album() {
  const { albums, loading, refresh } = useFetchAllAlbums();
  const { token } = useAuth();
  const openNotification = useNotification();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list"); // "grid" | "list"
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleMediaDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`delete-album/${id}`, {
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
    navigate(`/media/album/${album._id}`)
    setSelected(album);
  };

  if (loading) return <LoadingComponent />;

  return (
    <>
      <style>{globalStyles}</style>
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
          <AlbumStatCard
            icon={<FileImageOutlined />}
            value={albums?.length ?? 0}
            label="Total Albums"
            color={primary}
          />
          <AlbumStatCard
            icon={<UserOutlined />}
            value={contributors}
            label="Contributors"
            color={accent}
          />
          <AlbumStatCard
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

      <DetailsModal
        open={!!selected}
        setOpen={setSelected}
        component={<AlbumDetail album={selected} setDeleteTarget={setDeleteTarget}/>}
        refresh={refresh}width={800}
      />

      {/* ── Delete confirm modal ── */}
      <Modal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={() => {
          handleMediaDelete(deleteTarget._id);
          setDeleteTarget(null);
        }}
        centered
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
          Are you sure you want to delete? This action cannot be undone.
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

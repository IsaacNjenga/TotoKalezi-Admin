import React, { useState, useMemo } from "react";
import { Input, Spin, Empty, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  CheckOutlined,
  SearchOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import useFetchAllMedia from "../hooks/fetchAllMedia";
import {
  primary,
  primaryDim,
  primaryMid,
  accent,
  globalStyles,
} from "../utils/uiHelpers";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import LoadingComponent from "./LoadingComponent";

function AllMediaPreview({ id, setOpenMediaModal, setRefreshKey }) {
  const { token } = useAuth();
  const { media, loading } = useFetchAllMedia();
  const { openNotification } = useNotification();
  const [selected, setSelected] = useState([]); // array of _id's
  const [search, setSearch] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return media ?? [];
    const q = search.toLowerCase();
    return (media ?? []).filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.banner?.toLowerCase().includes(q) ||
        m.type?.toLowerCase().includes(q),
    );
  }, [media, search]);

  const toggle = (_id) => {
    const item = media?.find((m) => m._id === _id);
    if (!item || item?.albumId?._id === id) return; 
    setSelected((prev) =>
      prev.includes(_id) ? prev.filter((u) => u !== _id) : [...prev, _id],
    );
  };

  const clearAll = () => {
    setSelected([]);
  };

  //   const copyAll = () => {
  //     navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   };

  const handleSubmit = async () => {
    setUploadLoading(true);
    try {
      const payload = {
        media: selected,
      };
      const res = await axios.put(`update-album-media/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        // openNotification("success", "Album updated successfully!", "Success");
        setOpenMediaModal(false);
        setSelected([]);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("There was an error on submission", error);
      openNotification(
        "error",
        "There was an error on submission. Please try again, or contact support.",
        "Error",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  if (uploadLoading) {
    return <LoadingComponent />;
  }

  if (!id) return;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Toolbar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div className="amp-search" style={{ flex: 1, maxWidth: 260 }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search media…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {selected.length > 0 && (
              <Button
                size="small"
                icon={<PlusOutlined />}
                className="amp-clear-btn"
                onClick={handleSubmit}
                style={{
                  borderRadius: 7,
                  fontSize: 12,
                  fontFamily: "'Outfit', sans-serif",
                  color: "#fff",
                  borderColor: primaryMid,
                  transition: "all 0.2s ease",
                  background: primary,
                }}
              >
                Add To Album
              </Button>
            )}

            {/* Selected count */}
            {selected.length > 0 && (
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: primaryDim,
                  border: `1px solid ${primaryMid}`,
                  color: primary,
                }}
              >
                {selected.length} selected
              </span>
            )}

            {selected.length > 0 && (
              <Tooltip title="Clear selection">
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  className="amp-clear-btn"
                  disabled={selected.length === 0}
                  onClick={clearAll}
                  style={{
                    borderRadius: 7,
                    fontSize: 12,
                    fontFamily: "'Outfit', sans-serif",
                    color: "#aaa",
                    borderColor: "rgba(133,74,154,0.2)",
                    transition: "all 0.2s ease",
                  }}
                >
                  Clear
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* ── Count ── */}
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            color: "#bbb",
            margin: "0 0 10px",
          }}
        >
          {filtered.length} items
        </p>

        {/* ── Grid ── */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            <Spin description="Loading..." />
          </div>
        ) : filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "#bbb",
                  fontSize: 12,
                }}
              >
                No media found
              </span>
            }
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: 8,
            }}
          >
            {filtered.map((item) => {
              const isSelected = selected.includes(item._id);
              const itExists = item?.albumId?._id === id;
              const isVideo = item.type === "video";

              return (
                <Tooltip
                  key={item._id}
                  title={itExists ? "Already in this album" : item.title}
                  placement="top"
                >
                  <div
                    className={`amp-item${isSelected ? " selected" : ""}`}
                    style={{
                      aspectRatio: "1",
                      opacity: itExists ? 0.5 : 1,
                      cursor: itExists ? "not-allowed" : "pointer",
                    }}
                    onClick={() => !itExists && toggle(item._id)}
                  >
                    {/* Media */}
                    {isVideo ? (
                      <video src={item.url} muted style={{ borderRadius: 9 }} />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        style={{ borderRadius: 9 }}
                      />
                    )}

                    {/* ── Hard block overlay for existing items ── */}
                    {itExists && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 9,
                          zIndex: 10, // sits above everything including amp-hover
                          cursor: "not-allowed",
                          background: "transparent",
                        }}
                      />
                    )}

                    {/* Hover overlay */}
                    <div
                      className="amp-hover"
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 9,
                        background: isSelected
                          ? "rgba(133,74,154,0.5)"
                          : "rgba(5,2,14,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected || itExists ? (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: primary,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(133,74,154,0.5)",
                          }}
                        >
                          <CheckOutlined
                            style={{ color: "#fff", fontSize: 13 }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.15)",
                            border: "1.5px solid rgba(255,255,255,0.6)",
                            backdropFilter: "blur(4px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PlusOutlined
                            style={{ color: "#fff", fontSize: 13 }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Type badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 5,
                        left: 5,
                        padding: "1px 6px",
                        borderRadius: 20,
                        background: "rgba(10,5,20,0.75)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      {isVideo ? (
                        <VideoCameraOutlined
                          style={{ color: accent, fontSize: 8 }}
                        />
                      ) : (
                        <PictureOutlined
                          style={{ color: "#c08adb", fontSize: 8 }}
                        />
                      )}
                    </div>

                    {/* Selected tick corner */}
                    {(isSelected || itExists) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 5,
                          right: 5,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 1px 4px rgba(133,74,154,0.5)",
                        }}
                      >
                        <CheckOutlined style={{ color: "#fff", fontSize: 8 }} />
                      </div>
                    )}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default AllMediaPreview;

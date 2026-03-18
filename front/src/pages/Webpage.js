import React, { useState, useEffect } from "react";
import { Button, Input, Tooltip, Spin, Empty, Tag, Divider, Modal } from "antd";
import {
  GlobalOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  EyeOutlined,
  LinkOutlined,
  CalendarOutlined,
  ReloadOutlined,
  PictureOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import {
  primary,
  primaryDim,
  primaryMid,
  globalStyles,
  green,
  greenDim,
} from "../utils/uiHelpers";
import useFetchWebsite from "../hooks/fetchWebsite";

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const presetKey = process.env.REACT_APP_PRESET_KEY;

// ── Skeleton loader ───────────────────────────────────────────────
function PageCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(133,74,154,0.08)",
        overflow: "hidden",
        padding: 0,
      }}
    >
      <div
        style={{
          height: 160,
          background:
            "linear-gradient(90deg, #f5f0fa 25%, #ede5f7 50%, #f5f0fa 75%)",
          backgroundSize: "400px 100%",
          animation: "shimmer 1.5s infinite linear",
        }}
      />
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            height: 14,
            width: "60%",
            borderRadius: 6,
            background: "#f0eaf7",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            height: 11,
            width: "40%",
            borderRadius: 6,
            background: "#f5f2fa",
          }}
        />
      </div>
    </div>
  );
}

// ── Page card ─────────────────────────────────────────────────────
function PageCard({ page, onEdit }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const date = new Date(page.updatedAt).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <div
        className="wp-page-card"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid rgba(133,74,154,0.08)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Hero image preview */}
        <div
          style={{
            position: "relative",
            height: 170,
            background: "#0d0814",
            overflow: "hidden",
          }}
        >
          <img
            src={page.heroImg}
            alt={page.pageName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,2,14,0.7) 0%, transparent 55%)",
            }}
          />

          {/* Page name over image */}
          <div style={{ position: "absolute", bottom: 10, left: 14 }}>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "2px 10px",
                borderRadius: 20,
                background: "rgba(133,74,154,0.3)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(133,74,154,0.4)",
                color: "#d4a8e8",
              }}
            >
              {page.pageName}
            </span>
          </div>

          {/* Preview button */}
          <button
            onClick={() => setPreviewOpen(true)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(10,5,20,0.6)",
              backdropFilter: "blur(6px)",
              color: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = primaryDim;
              e.currentTarget.style.borderColor = primaryMid;
              e.currentTarget.style.color = primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(10,5,20,0.6)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            }}
          >
            <EyeOutlined />
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: "14px 16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: "0 0 2px",
                }}
              >
                {page.pageName}
              </p>
              <a
                href={page.pageUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: primary,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <LinkOutlined style={{ fontSize: 10 }} />
                {page.pageUrl}
              </a>
            </div>
            <Tooltip title="Edit hero image">
              <button
                className="wp-edit-btn"
                onClick={() => onEdit(page)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid rgba(133,74,154,0.18)",
                  background: "transparent",
                  color: "#aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 14,
                  padding: 0,
                  transition: "all 0.2s ease",
                }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
          </div>

          <Divider
            style={{ borderColor: "rgba(133,74,154,0.08)", margin: "8px 0" }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "#bbb",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <CalendarOutlined style={{ fontSize: 10 }} /> Updated {date}
            </span>
            <Tag
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "1px 8px",
                borderRadius: 20,
                margin: 0,
                background: greenDim,
                border: "1px solid rgba(39,174,96,0.25)",
                color: green,
              }}
            >
              Live
            </Tag>
          </div>
        </div>
      </div>

      {/* Full preview modal */}
      <Modal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        centered
        width={800}
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
            background: "rgba(10,5,20,0.55)",
          },
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            src={page.heroImg}
            alt={page.pageName}
            style={{
              width: "100%",
              maxHeight: 500,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(5,2,14,0.8) 0%, transparent 50%)",
            }}
          />
          <div style={{ position: "absolute", bottom: 20, left: 24 }}>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#fff",
                margin: 0,
              }}
            >
              {page.pageName}
            </p>
            <a
              href={page.pageUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
              }}
            >
              {page.pageUrl}
            </a>
          </div>
          <button
            onClick={() => setPreviewOpen(false)}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 30,
              height: 30,
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(10,5,20,0.6)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
            }}
          >
            <CloseOutlined />
          </button>
        </div>
      </Modal>
    </>
  );
}

// ── Edit modal ────────────────────────────────────────────────────
function EditHeroModal({ page, open, onClose, onSaved }) {
  const { token } = useAuth();
  const { openNotification } = useNotification();
  const [mode, setMode] = useState("url"); // "url" | "upload"
  const [urlInput, setUrlInput] = useState(page?.heroImg ?? "");
  const [preview, setPreview] = useState(page?.heroImg ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (page) {
      setUrlInput(page.heroImg);
      setPreview(page.heroImg);
    }
  }, [page]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      openNotification("error", "File must be under 10MB", "Too large");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", presetKey);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        fd,
        {
          withCredentials: false,
          onUploadProgress: (ev) =>
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100)),
        },
      );
      const cdnUrl = res.data.secure_url;
      setPreview(cdnUrl);
      setUrlInput(cdnUrl);
      openNotification("success", "Image uploaded to CDN", "Done");
    } catch {
      openNotification("error", "Upload failed. Try again.", "Error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSave = async () => {
    if (!urlInput.trim()) {
      openNotification("warning", "Please provide an image URL", "Missing");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(
        `/website/${page._id}`,
        { heroImg: urlInput.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        openNotification(
          "success",
          `"${page.pageName}" hero updated!`,
          "Saved",
        );
        onSaved();
        onClose();
      }
    } catch {
      openNotification("error", "Failed to save. Please try again.", "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={560}
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${primaryMid}`,
        },
        header: { display: "none" },
        body: { padding: 0 },
        mask: { backdropFilter: "blur(4px)", background: "rgba(10,5,20,0.55)" },
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 22px",
          borderBottom: "1px solid rgba(133,74,154,0.1)",
          background: primaryDim,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <PictureOutlined style={{ color: primary, fontSize: 16 }} />
          <div>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#333",
                margin: 0,
              }}
            >
              Edit Hero Image
            </p>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "#aaa",
                margin: 0,
              }}
            >
              {page?.pageName}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            border: `1px solid ${primaryMid}`,
            background: "#fff",
            color: primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 12,
            padding: 0,
          }}
        >
          <CloseOutlined />
        </button>
      </div>

      <div style={{ padding: "20px 22px 24px" }}>
        {/* Current preview */}
        <div style={{ marginBottom: 18 }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#bbb",
              margin: "0 0 8px",
            }}
          >
            Preview
          </p>
          <div
            style={{
              position: "relative",
              height: 180,
              borderRadius: 10,
              overflow: "hidden",
              background: "#0d0814",
              border: `1px solid ${primaryMid}`,
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={() => setPreview("")}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <PictureOutlined
                  style={{ color: "rgba(133,74,154,0.3)", fontSize: 32 }}
                />
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.2)",
                    margin: 0,
                  }}
                >
                  No preview
                </p>
              </div>
            )}
            {preview && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(5,2,14,0.6) 0%, transparent 60%)",
                }}
              />
            )}
          </div>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            padding: "3px",
            borderRadius: 9,
            background: "rgba(133,74,154,0.07)",
            border: "1px solid rgba(133,74,154,0.1)",
          }}
        >
          {[
            { key: "url", label: "Paste URL", icon: <LinkOutlined /> },
            {
              key: "upload",
              label: "Upload File",
              icon: <CloudUploadOutlined />,
            },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                flex: 1,
                height: 30,
                borderRadius: 7,
                border: "none",
                background: mode === key ? "#fff" : "transparent",
                color: mode === key ? primary : "#aaa",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
                boxShadow: mode === key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Input area */}
        {mode === "url" ? (
          <div className="wp-url-input" style={{ marginBottom: 16 }}>
            <Input
              prefix={<LinkOutlined />}
              placeholder="https://example.com/hero-image.jpg"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setPreview(e.target.value);
              }}
              size="large"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                color: "#bbb",
                margin: "6px 0 0",
              }}
            >
              Paste any publicly accessible image URL. The preview above updates
              live.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <label
              className="wp-upload-zone"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                height: 100,
                borderRadius: 10,
                cursor: "pointer",
                border: "2px dashed rgba(133,74,154,0.25)",
                background: primaryDim,
                transition: "all 0.22s ease",
                position: "relative",
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <Spin size="small" />
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12,
                      color: primary,
                      margin: 0,
                    }}
                  >
                    Uploading… {uploadProgress}%
                  </p>
                  {/* Progress bar */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      borderRadius: "0 0 10px 10px",
                      background: "rgba(133,74,154,0.1)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${uploadProgress}%`,
                        background: `linear-gradient(90deg, ${primary}, #a066bc)`,
                        borderRadius: "0 0 10px 10px",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <CloudUploadOutlined
                    style={{ fontSize: 24, color: primary }}
                  />
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12,
                      color: "#888",
                      margin: 0,
                    }}
                  >
                    Click to upload · JPG, PNG, WEBP · Max 10MB
                  </p>
                </>
              )}
            </label>
            {urlInput && urlInput !== page?.heroImg && (
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: green,
                  margin: "6px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <CheckOutlined style={{ fontSize: 10 }} /> Uploaded to CDN
              </p>
            )}
          </div>
        )}

        <Divider
          style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 16px" }}
        />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            className="wp-save-btn"
            style={{
              flex: 1,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
              border: "none",
              borderRadius: 8,
              boxShadow: "0 2px 12px rgba(133,74,154,0.3)",
              transition: "all 0.25s ease",
            }}
          >
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            className="wp-cancel-btn"
            style={{
              borderRadius: 8,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              borderColor: "rgba(133,74,154,0.2)",
              color: "#888",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ── Main ─────────────────────────────────────────────────────────
function Webpage() {
  const { website, loading, refresh } = useFetchWebsite();
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  console.log(website);

  const openEdit = (page) => {
    setEditing(page);
    setEditOpen(true);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 48px", fontFamily: "'Outfit', sans-serif" }}>
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
              Website Pages
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Manage hero images for each page of the Toto Kalezi website.
            </p>
          </div>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refresh()}
              style={{
                borderRadius: 8,
                borderColor: "rgba(133,74,154,0.2)",
                color: primary,
              }}
            />
          </Tooltip>
        </div>

        {/* ── Stats bar ── */}
        {!loading && website.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(133,74,154,0.08)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              padding: "14px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 24,
              animation: "fadeUp 0.4s ease both",
            }}
          >
            {[
              {
                label: "Total Pages",
                value: website.length,
                color: primary,
                icon: <GlobalOutlined />,
              },
              {
                label: "With Hero Images",
                value: website.filter((p) => p.heroImg).length,
                color: green,
                icon: <PictureOutlined />,
              },
            ].map(({ label, value, color, icon }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: `${color}18`,
                    border: `1px solid ${color}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: 15,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "1.1rem",
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
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#aaa",
                      margin: "2px 0 0",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}

            <Divider
              orientation="vertical"
              style={{
                height: 32,
                borderColor: "rgba(133,74,154,0.12)",
                margin: "0 4px",
              }}
            />

            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                color: "#bbb",
                margin: 0,
              }}
            >
              Click the <EditOutlined style={{ color: primary }} /> icon on any
              page card to update its hero image.
            </p>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <PageCardSkeleton key={i} />
            ))}
          </div>
        ) : website.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid rgba(133,74,154,0.08)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: "60px 20px",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span
                  style={{ fontFamily: "'Outfit', sans-serif", color: "#bbb" }}
                >
                  No pages found
                </span>
              }
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {website.map((page, i) => (
              <div key={page._id} style={{ animationDelay: `${i * 60}ms` }}>
                <PageCard page={page} onEdit={openEdit} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <EditHeroModal
          page={editing}
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          onSaved={refresh}
        />
      )}
    </>
  );
}

export default Webpage;

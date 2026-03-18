import { useState, useEffect } from "react";
import { Button, Input, Spin, Divider } from "antd";
import {
  CheckOutlined,
  CloudUploadOutlined,
  LinkOutlined,
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
  green,
  cloudName,
  presetKey,
} from "../utils/uiHelpers";

export default function EditHeroModal({ page, open, onClose, onSaved }) {
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
    <>
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
    </>
  );
}

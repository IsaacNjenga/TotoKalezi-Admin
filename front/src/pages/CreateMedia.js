import React, { useState } from "react";
import { Form, Button } from "antd";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  ACCEPTED_IMAGE,
  ACCEPTED_VIDEO,
  primary,
  globalStyles,
} from "../utils/uiHelpers";
import MediaForm from "../components/MediaForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useMediaUpload from "../hooks/useMediaUpload";

function CreateMedia() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [form] = Form.useForm();
  const openNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const {
    selectedFile,
    previewUrl,
    fileList,
    mediaType,
    uploadProgress,
    setMediaType,
    setPreviewUrl,
    setFileList,
    handleFileChange,
    handleRemoveFile,
    uploadToCloudinary,
    setUploadProgress,
    setSelectedFile,
  } = useMediaUpload();

  const handleSubmit = async (values) => {
    if (!selectedFile) {
      openNotification("warning", "Please upload a file", "No media selected");
      return;
    }

    setLoading(true);

    try {
      const mediaUrl = await uploadToCloudinary();

      const payload = {
        ...values,
        url: mediaUrl,
        createdBy: user._id,
      };

      const res = await axios.post("/create-media", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        openNotification("success", "Media uploaded", "Success");
        // setTimeout(() => {
        //   navigate("/media");
        // }, 1200);
      }
    } catch (err) {
      openNotification("error", err.message, "Upload failed");
    } finally {
      setLoading(false);
      form.resetFields();
      setFileList([]);
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  };

  const accepted =
    mediaType === "video"
      ? ACCEPTED_VIDEO
      : mediaType === "image"
        ? ACCEPTED_IMAGE
        : `${ACCEPTED_IMAGE},${ACCEPTED_VIDEO}`;

  return (
    <>
      <style>{globalStyles}</style>

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "4px 0 40px",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {" "}
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 4px",
              }}
            >
              Upload Media
            </h2>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              Add images or videos to the foundation's media library.
            </p>
          </div>
          <div>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              className="back-btn"
              onClick={() => navigate("/media")}
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
              Back to Media
            </Button>
          </div>
        </div>

        <MediaForm
          form={form}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          previewUrl={previewUrl}
          fileList={fileList}
          accepted={accepted}
          mediaType={mediaType}
          handleRemoveFile={handleRemoveFile}
          uploadProgress={uploadProgress}
          setMediaType={setMediaType}
          loading={loading}
          setFileList={setFileList}
          setPreviewUrl={setPreviewUrl}
          setUploadProgress={setUploadProgress}
          buttonText={"Upload"}
        />
      </div>
    </>
  );
}

export default CreateMedia;

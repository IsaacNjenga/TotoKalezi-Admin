import React, { useState } from "react";
import { Form, Button } from "antd";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ACCEPTED_IMAGE, primary, globalStyles } from "../utils/uiHelpers";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useMediaUpload from "../hooks/useMediaUpload";
import AlbumForm from "../components/AlbumForm";

function CreateAlbum() {
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
        cover: mediaUrl,
        createdBy: user._id,
      };

      const res = await axios.post("/create-album", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        openNotification("success", "Album created!", "Success");
        // setTimeout(() => {
        //   navigate("/media");
        // }, 1200);

        form.resetFields();
        setFileList([]);
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    } catch (err) {
      openNotification("error", err.message, "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const accepted = ACCEPTED_IMAGE;

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
              Create an album
            </h2>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              Create your album here
            </p>
          </div>
          <div>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              className="back-btn"
              onClick={() => navigate("/media/albums")}
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
              Back to Albums
            </Button>
          </div>
        </div>

        <AlbumForm
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

export default CreateAlbum;

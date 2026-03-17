import React, { useEffect, useState } from "react";
import { Form, Button } from "antd";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { ACCEPTED_IMAGE, primary, globalStyles } from "../utils/uiHelpers";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useMediaUpload from "../hooks/useMediaUpload";
import AlbumForm from "../components/AlbumForm";
import useFetchAlbum from "../hooks/fetchAlbum";
import LoadingComponent from "../components/LoadingComponent";

function EditAlbum() {
  const { id } = useParams();
  const { album, loading: fetchLoading, fetchAlbum } = useFetchAlbum();
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

  useEffect(() => {
    fetchAlbum(id);
  }, [fetchAlbum, id]);

  useEffect(() => {
    if (album) {
      form.setFieldsValue({
        title: album.title,
        description: album.description,
      });
      setMediaType(album.type);
      setPreviewUrl(album.cover);
      setFileList([
        {
          uid: "-1",
          name: "current-cover",
          status: "done",
          url: album.url,
        },
      ]);
    }
    // eslint-disable-next-line
  }, [form, album]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let mediaUrl = album.cover;

      // upload only if changed
      if (selectedFile) {
        mediaUrl = await uploadToCloudinary();
      }

      const payload = {
        ...values,
        cover: mediaUrl,
        createdBy: user._id,
      };

      const res = await axios.put(`update-album/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        openNotification("success", "Album updated successfully!", "Success");
        setTimeout(() => {
          navigate("/media/albums");
        }, 1200);
        form.resetFields();
        setFileList([]);
        setPreviewUrl(null);
        setSelectedFile(null);
      }
    } catch (err) {
      openNotification("error", err.message, "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const accepted = ACCEPTED_IMAGE;

  if (fetchLoading) return <LoadingComponent />;

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
              Edit album
            </h2>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              Edit your album here
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
          buttonText={"Edit"}
        />
      </div>
    </>
  );
}

export default EditAlbum;

import { useEffect, useState } from "react";
import useFetchMedia from "../hooks/fetchMedia";
import { useParams, useNavigate } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";
import { Form, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
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
import useMediaUpload from "../hooks/useMediaUpload";

function EditMedia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { media, fetchMedia, loading: fetchLoading } = useFetchMedia();
  const { token, user } = useAuth();
  const openNotification = useNotification();
  const [form] = Form.useForm();
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
  } = useMediaUpload();

  useEffect(() => {
    fetchMedia(id);
  }, [fetchMedia, id]);

  useEffect(() => {
    if (media) {
      form.setFieldsValue({
        title: media.title,
        description: media.description,
        banner: media.banner,
        type: media.type,
        url: media.url,
      });

      setMediaType(media.type);
      setPreviewUrl(media.url);

      setFileList([
        {
          uid: "-1",
          name: "current-media",
          status: "done",
          url: media.url,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, media]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      let mediaUrl = media.url;

      // upload only if changed
      if (selectedFile) {
        mediaUrl = await uploadToCloudinary();
      }

      const payload = {
        ...values,
        url: mediaUrl,
        createdBy: user._id,
      };

      const res = await axios.put(`/update-media/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        openNotification("success", "Media updated", "Success");
        setTimeout(() => {
          navigate("/media");
        }, 1200);
      }
    } catch (err) {
      openNotification("error", err.message, "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const accepted =
    mediaType === "video"
      ? ACCEPTED_VIDEO
      : mediaType === "image"
        ? ACCEPTED_IMAGE
        : `${ACCEPTED_IMAGE},${ACCEPTED_VIDEO}`;

  if (fetchLoading) {
    return <LoadingComponent />;
  }

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
              Edit Media
            </h2>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
              Edit images or videos to the foundation's media library.
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
          buttonText={"Edit"}
        />
      </div>
    </>
  );
}

export default EditMedia;

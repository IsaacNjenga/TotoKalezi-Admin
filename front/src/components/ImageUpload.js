import {
  Button,
  Form,
  Input,
  Spin,
  Row,
  Col,
  Image as AntImage,
  Typography,
  Space,
} from "antd";
import { useState } from "react";
import axios from "axios";
import {
  DeleteOutlined,
  CloudUploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const PRIMARY_COLOR = "#fda648";
const LIGHT_BG = "#fff8f0";
const BORDER_COLOR = "#ffe4c4";

const labelStyle = {
  fontFamily: "Raleway",
  fontWeight: 600,
  fontSize: 14,
  color: "#2c3e50",
  marginBottom: 10,
};

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const presetKey = process.env.REACT_APP_PRESET_KEY;

const ImageSection = ({
  setSelectedImage,
  selectedImage,
  openNotification,
}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e) => {
    setImageUploading(true);

    try {
      openNotification("warning", "Please wait", "Uploading...");

      const file = Array.from(e.target.files)[0];
      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        setImageUploading(false);
        return openNotification(
          "error",
          "Please select a file less than 10MB",
          "File exceeds limit!",
        );
      }

      const cloud_name = cloudName;
      const preset_key = presetKey;

      let newImageUrl = "";

      const uploadPromises = [file].map((file) => {
        const formImageData = new FormData();
        formImageData.append("file", file);
        formImageData.append("upload_preset", preset_key);

        return axios
          .post(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            formImageData,
            { withCredentials: false },
          )
          .then((res) => {
            newImageUrl = res.data.secure_url;
          })
          .catch((error) => {
            console.log(error);
            openNotification(
              "error",
              "There was an unexpected error. Please try again",
              "Failed to upload your picture",
            );
          });
      });

      Promise.all(uploadPromises).then(async () => {
        setImageUploading(false);
        openNotification("success", "Image uploaded successfully", "Success!");
        setSelectedImage(newImageUrl);
      });
    } catch (error) {
      console.log(error);
      openNotification(
        "error",
        "There was an unexpected error. Please try again",
        "Failed to upload your picture",
      );
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (e, index) => {
    e.preventDefault();
    setSelectedImage(null);
  };

  return (
    <div
      style={{
        background: LIGHT_BG,
        padding: 24,
        borderRadius: 16,
        border: `2px dashed ${dragActive ? PRIMARY_COLOR : BORDER_COLOR}`,
        transition: "all 0.3s ease",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={() => setDragActive(false)}
    >
      <Space>
        <CloudUploadOutlined style={{ color: PRIMARY_COLOR }} />
        <span style={labelStyle}>Product Images</span>
      </Space>
      <Form.Item name="img" style={{ marginTop: 8 }}>
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            background: "white",
            borderRadius: 12,
            border: `2px dashed ${BORDER_COLOR}`,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <InboxOutlined
            style={{ fontSize: 48, color: PRIMARY_COLOR, marginBottom: 16 }}
          />
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ color: PRIMARY_COLOR }}>
              Click to upload
            </Text>{" "}
            <Text type="secondary">or drag and drop</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            PNG, JPG up to 10MB
          </Text>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>
      </Form.Item>

      <Col span={24}>
        {imageUploading && (
          <div style={{ margin: "24px auto", textAlign: "center" }}>
            <Spin size="large" />
            <div style={{ marginTop: 12, color: PRIMARY_COLOR }}>
              Uploading images...
            </div>
          </div>
        )}
        {selectedImage.length > 0 ? (
          <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
            {selectedImage.map((item, index) => {
              return (
                <Col span={24} key={index}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 12,
                      overflow: "hidden",
                      height: "100%",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      title="Remove Image"
                      shape="circle"
                      size="small"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid #ff4d4f",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      onClick={(e) => removeImage(e, index)}
                    />
                    <AntImage
                      src={item}
                      alt="uploaded_img"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          !imageUploading && (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#999",
                background: "white",
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <InboxOutlined style={{ fontSize: 36, marginBottom: 8 }} />
              <div>No images selected yet</div>
            </div>
          )
        )}
      </Col>
    </div>
  );
};

export default ImageSection;

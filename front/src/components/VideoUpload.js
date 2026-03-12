import { Button, Form, Input, Spin, Row, Col } from "antd";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { DeleteOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useNotification } from "../contexts/NotificationContext";

const labelStyle = {
  fontWeight: 600,
  fontSize: "14px",
  color: "#2c3e50",
  marginBottom: "4px",
  fontFamily: "Raleway",
};

const sectionStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "24px",
  fontWeight: 600,
  fontSize: "15px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const cloudName = process.env.REACT_APP_CLOUD_NAME;
const presetKey = process.env.REACT_APP_PRESET_KEY;

const VideoSection = ({ selectedVideo, setSelectedVideo }) => {
  const openNotification = useNotification();
  const [videoUploading, setVideoUploading] = useState(false);

  const handleVideoUpload = async (e) => {
    Swal.fire({
      title: "Uploading your video...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setVideoUploading(true);
    const file = Array.from(e.target.files)[0];

    const cloud_name = cloudName;
    const preset_key = presetKey;

    let newVideoUrl = "";

    const uploadPromises = [file].map(async (file) => {
      const formVideoData = new FormData();
      formVideoData.append("file", file);
      formVideoData.append("upload_preset", preset_key);
      formVideoData.append("resource_type", "video");

      return axios
        .post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`,
          formVideoData,
          { withCredentials: false },
        )
        .then((res) => {
          newVideoUrl = res.data.secure_url;
        })
        .catch((error) => {
          console.log(error);
          openNotification(
            "error",
            "There was an unexpected error. Please try again",
            "Upload Failed!",
          );
        });
    });

    // After all uploads are done, update the state
    Promise.all(uploadPromises)
      .then(async () => {
        setVideoUploading(false);
        Swal.fire({ icon: "success", title: "Videos set successfully" });
        setSelectedVideo(newVideoUrl);
      })
      .catch((error) => {
        setVideoUploading(false);
        console.error(error);
        openNotification(
          "error",
          "There was an unexpected error. Please try again",
          "Upload Failed!",
        );
      });
  };

  const removeVideo = (e, index) => {
    e.preventDefault();
    setSelectedVideo(null);
  };

  return (
    <div>
      <div style={sectionStyle}>
        <VideoCameraOutlined style={{ fontSize: "18px" }} />
        Video Upload
      </div>
      <Form.Item
        name="vid"
        label={<span style={labelStyle}>Drop your video(s) here</span>}
      >
        <Input
          type="file"
          accept="video/*" // ? mp4
          multiple
          onChange={handleVideoUpload}
        />
      </Form.Item>

      <Col span={24}>
        {videoUploading && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {selectedVideo.length > 0 ? (
          <Row gutter={[24, 24]}>
            {selectedVideo.map((item, index) => {
              return (
                <Col span={12} key={index}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 8,
                      overflow: "hidden",
                      width: 220,
                      height: 220,
                    }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      type="text"
                      danger
                      shape="circle"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        background: "white",
                        border: "1px solid red",
                      }}
                      onClick={(e) => removeVideo(e, index)}
                    />
                    <video height="200" width="200" autoPlay>
                      <source
                        src={item}
                        type="video/mp4"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </video>
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div style={{ padding: 20, color: "#666" }}>
            No videos selected yet.
          </div>
        )}
      </Col>
    </div>
  );
};

export default VideoSection;

import { Form, Input, Button, Upload, Progress } from "antd";
import {
  InboxOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  EyeOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  primary,
  primaryMid,
  primaryDim,
  primaryGlow,
  accent,
} from "../utils/uiHelpers";

const SectionCard = ({ title, icon, children }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(133,74,154,0.1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid rgba(133,74,154,0.08)",
          background: primaryDim,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ color: primary, fontSize: 16 }}>{icon}</span>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: primary,
            margin: 0,
          }}
        >
          {title}
        </p>
      </div>
      <div style={{ padding: "22px 22px 8px" }}>{children}</div>
    </div>
  );
};

const { Dragger } = Upload;
const { TextArea } = Input;

function AlbumForm({
  handleFileChange,
  form,
  handleSubmit,
  previewUrl,
  fileList,
  accepted,
  mediaType,
  handleRemoveFile,
  uploadProgress,
  loading,
  setFileList,
  setPreviewUrl,
  setMediaType,
  setUploadProgress,
  buttonText,
}) {
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="cm-form"
        requiredMark={false}
      >
        {/* ── DROP ZONE ── */}
        <SectionCard title="Cover Upload" icon={<CloudUploadOutlined />}>
          {!previewUrl ? (
            <Dragger
              className="cm-dragger"
              multiple={false}
              fileList={fileList}
              accept={accepted}
              beforeUpload={() => false}
              onChange={handleFileChange}
              showUploadList={false}
              style={{ marginBottom: 8 }}
            >
              <div style={{ padding: "24px 16px" }}>
                <p
                  style={{
                    fontSize: 44,
                    color: primary,
                    marginBottom: 8,
                    lineHeight: 1,
                  }}
                >
                  <InboxOutlined />
                </p>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#333",
                    margin: "0 0 6px",
                  }}
                >
                  Drag & drop your file here
                </p>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "#aaa",
                    margin: 0,
                  }}
                >
                  or{" "}
                  <span style={{ color: primary, fontWeight: 600 }}>
                    click to browse
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    marginTop: 16,
                  }}
                >
                  {[
                    {
                      icon: <PictureOutlined />,
                      label: "Images",
                      sub: "JPG, PNG, WEBP, GIF",
                    },
                  ].map(({ icon, label, sub }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "#fff",
                        border: "1px solid rgba(133,74,154,0.15)",
                      }}
                    >
                      <span style={{ color: primary, fontSize: 16 }}>
                        {icon}
                      </span>
                      <div style={{ textAlign: "left" }}>
                        <p
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#444",
                            margin: 0,
                          }}
                        >
                          {label}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 10,
                            color: "#bbb",
                            margin: 0,
                          }}
                        >
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Dragger>
          ) : (
            /* ── Preview ── */
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: `1px solid ${primaryMid}`,
                background: "#0d0814",
                position: "relative",
              }}
            >
              {/* Success badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(39,174,96,0.15)",
                  border: "1px solid rgba(39,174,96,0.3)",
                }}
              >
                <CheckCircleFilled style={{ color: "#27ae60", fontSize: 12 }} />
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#27ae60",
                  }}
                >
                  File ready
                </span>
              </div>

              {/* Type badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  zIndex: 2,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: "rgba(10,5,20,0.7)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: mediaType === "video" ? accent : "#c08adb",
                  }}
                >
                  {mediaType === "video" ? (
                    <VideoCameraOutlined style={{ marginRight: 5 }} />
                  ) : (
                    <PictureOutlined style={{ marginRight: 5 }} />
                  )}
                  {mediaType}
                </span>
              </div>

              {mediaType === "video" ? (
                <video
                  src={previewUrl}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: 280,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxHeight: 280,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}

              {/* File info bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  background: "rgba(255,255,255,0.04)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.75)",
                      margin: 0,
                    }}
                  >
                    {fileList[0]?.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.35)",
                      margin: 0,
                    }}
                  >
                    {fileList[0]?.size
                      ? `${(fileList[0].size / 1024 / 1024).toFixed(2)} MB`
                      : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Dragger
                    multiple={false}
                    fileList={fileList}
                    accept={accepted}
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    showUploadList={false}
                    style={{
                      border: "none",
                      background: "transparent",
                      // padding: 0,
                    }}
                  >
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11,
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      Change
                    </Button>
                  </Dragger>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    className="preview-remove"
                    onClick={handleRemoveFile}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 11,
                      borderRadius: 6,
                      border: "1px solid rgba(231,76,60,0.2)",
                      background: "transparent",
                      color: "#e74c3c",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Upload progress (shown when submitting) */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ padding: "8px 16px 12px" }}>
                  <Progress
                    percent={uploadProgress}
                    strokeColor={{ from: primary, to: "#a066bc" }}
                    railColor="rgba(255,255,255,0.1)"
                    size="small"
                  />
                </div>
              )}
            </div>
          )}
        </SectionCard>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title" }]}
          style={{ marginBottom: 16 }}
        >
          <Input
            prefix={<FileTextOutlined />}
            placeholder="e.g. Community Feeding Drive 2025"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          style={{ marginBottom: 16 }}
        >
          <TextArea
            placeholder="Give a short description for this album…"
            rows={3}
            style={{ resize: "none" }}
          />
        </Form.Item>

        {/* ── ACTIONS ── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            paddingTop: 4,
          }}
        >
          <Button
            onClick={() => {
              form.resetFields();
              setFileList([]);
              setPreviewUrl(null);
              setMediaType(null);
              setUploadProgress(0);
            }}
            size="large"
            className="reset-btn"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.04em",
              borderRadius: 9,
              borderColor: "rgba(133,74,154,0.2)",
              color: "#888",
              transition: "all 0.22s ease",
              minWidth: 100,
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            icon={<CloudUploadOutlined />}
            className="submit-btn"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.06em",
              background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
              border: "none",
              borderRadius: 9,
              boxShadow: `0 4px 16px ${primaryGlow}`,
              transition: "all 0.25s ease",
              minWidth: 160,
            }}
          >
            {loading ? "Uploading…" : buttonText}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default AlbumForm;

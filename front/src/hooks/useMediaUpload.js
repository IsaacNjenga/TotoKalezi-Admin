import { useState } from "react";
import { cloudName, presetKey, cloudinaryUpload } from "../utils/uiHelpers";

export default function useMediaUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [mediaType, setMediaType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Select File ─────────────────────────────────────
  const handleFileChange = ({ file }, form) => {
    const rawFile = file.originFileObj || file;
    if (!rawFile) return;

    const detectedType = rawFile.type.startsWith("video/") ? "video" : "image";

    setMediaType(detectedType);
    form?.setFieldValue("type", detectedType);

    setSelectedFile(rawFile);
    setFileList([file]);

    const preview = URL.createObjectURL(rawFile);
    setPreviewUrl(preview);
  };

  // ── Remove File ─────────────────────────────────────
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileList([]);
    setMediaType("");
  };

  // ── Upload File ─────────────────────────────────────
  const uploadToCloudinary = async () => {
    if (!selectedFile) return null;

    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("upload_preset", presetKey);

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${mediaType}/upload`;

    const res = await cloudinaryUpload.post(endpoint, fd, {
      onUploadProgress: (e) => {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      },
    });

    return res.data.secure_url;
  };

  return {
    selectedFile,
    previewUrl,
    fileList,
    mediaType,
    uploadProgress,
    setPreviewUrl,
    setFileList,
    setMediaType,
    handleFileChange,
    handleRemoveFile,
    uploadToCloudinary,
    setUploadProgress,
    setSelectedFile,
  };
}

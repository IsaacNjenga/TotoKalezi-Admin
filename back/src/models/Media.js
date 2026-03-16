import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    banner: { type: String, required: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { collection: "media", timestamps: true },
);

const MediaModel = mongoose.model("Media", mediaSchema);

export default MediaModel;

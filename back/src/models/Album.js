import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: false },
    description: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "album", timestamps: true },
);

const AlbumModel = mongoose.model("Album", albumSchema);
export default AlbumModel;

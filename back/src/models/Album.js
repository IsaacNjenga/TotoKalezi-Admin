import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    description: { type: String },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: [],
      },
    ],
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

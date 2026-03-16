import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema(
  {
    pageName: { type: String, required: true, unique: true },
    pageUrl: { type: String, required: true, unique: true },
    heroImg: { type: String, required: true },
  },
  { collection: "website", timestamps: true },
);

const WebsiteModel = mongoose.model("Website", websiteSchema);

export default WebsiteModel;

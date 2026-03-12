import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
  },
  { collections: "volunteers", timestamps: true },
);

const VolunteerModel = mongoose.model("Volunteer", volunteerSchema);

export default VolunteerModel;

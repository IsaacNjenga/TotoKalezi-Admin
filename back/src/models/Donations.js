import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    transactionID: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
  },
  { collection: "donations", timestamps: true },
);

const DonationModel = mongoose.model("Donation", donationSchema);
export default DonationModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8, select: false },
    avatar: { type: String, default: "" },
    passwordReset: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
  },
  { collection: "users", timestamps: true },
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

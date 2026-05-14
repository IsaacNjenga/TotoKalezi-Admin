import bcrypt from "bcryptjs";
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

// Hash password only when it is new or has changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id_name: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema, "User");

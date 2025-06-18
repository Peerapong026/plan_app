import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  Id_title: { type: String, unique: true },
  id_name: String,
  title: String,
  date: Date,
  
});

export default mongoose.models.Plan || mongoose.model("Plan", planSchema, "Plan");

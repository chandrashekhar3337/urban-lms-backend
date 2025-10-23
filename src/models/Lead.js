import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  source: {
    type: String,
    enum: ["Website", "Meta", "Google"],
    default: "Website",
  },
  campaignName: String,
  keyword: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lead", leadSchema);

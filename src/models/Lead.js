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
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  campaignName: String,
  keyword: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Lead", leadSchema);

const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sector",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Walk-in", "Online", "Referral", "Linkedin", "Other"],
      default: "Walk-in",
    },
    applied: {
      type: Boolean,
      default: false,
    },
    response: {
      type: String,
      enum: ["Pending", "Positive", "Negative"],
      default: "Pending",
    },
    process: {
      type: String,
      enum: ["Not Started", "Ongoing", "Selected", "Rejected"],
      default: "Not Started",
    },
    detail: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);

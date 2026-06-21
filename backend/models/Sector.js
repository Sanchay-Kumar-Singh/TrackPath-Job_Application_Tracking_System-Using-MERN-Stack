const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, "Sector name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

sectorSchema.index({ city: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Sector", sectorSchema);

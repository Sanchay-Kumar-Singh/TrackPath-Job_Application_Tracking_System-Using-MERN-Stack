const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent the same user from creating duplicate city names
citySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("City", citySchema);

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadPhoto,
  uploadResume,
  deleteResume,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/photo", protect, upload.single("photo"), uploadPhoto);
router.post("/profile/resume", protect, upload.single("resume"), uploadResume);
router.delete("/profile/resume", protect, deleteResume);

module.exports = router;

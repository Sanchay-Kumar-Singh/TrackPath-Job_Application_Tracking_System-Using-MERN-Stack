const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo") {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Photo must be JPG, PNG, or WEBP"), false);
    }
  } else if (file.fieldname === "resume") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Resume must be PDF"), false);
    }
  } else {
    cb(new Error("Unexpected field"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadsDir = path.join(__dirname, "..", "uploads");
// const photosDir = path.join(uploadsDir, "photos");
// const resumesDir = path.join(uploadsDir, "resumes");

// // Ensure upload directories exist
// [uploadsDir, photosDir, resumesDir].forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "photo") {
//       cb(null, photosDir);
//     } else if (file.fieldname === "resume") {
//       cb(null, resumesDir);
//     } else {
//       cb(new Error("Unexpected field"), null);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
//     cb(null, uniqueSuffix);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "photo") {
//     const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
//     if (allowed.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Photo must be a JPG, PNG or WEBP image"), false);
//     }
//   } else if (file.fieldname === "resume") {
//     if (file.mimetype === "application/pdf") {
//       cb(null, true);
//     } else {
//       cb(new Error("Resume must be a PDF file"), false);
//     }
//   } else {
//     cb(new Error("Unexpected field"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 8 * 1024 * 1024 }, // 8MB max
// });

// module.exports = upload;

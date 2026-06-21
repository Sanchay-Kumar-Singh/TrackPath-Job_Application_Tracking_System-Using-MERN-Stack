const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

/* ---------------- ALLOWED ORIGINS ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://track-path-job-application-tracking-kappa.vercel.app",
];

// Add CLIENT_URL from environment variable if available
if (
  process.env.CLIENT_URL &&
  !allowedOrigins.includes(process.env.CLIENT_URL)
) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("🚀 TrackPath Backend is LIVE");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is LIVE 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/* ---------------- API ROUTES ---------------- */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cities", require("./routes/cityRoutes"));
app.use("/api/sectors", require("./routes/sectorRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));

/* ---------------- ERROR HANDLING ---------------- */
app.use(notFound);
app.use(errorHandler);

/* ---------------- EXPORT FOR VERCEL ---------------- */
module.exports = app;

/* ---------------- LOCAL SERVER ONLY ---------------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("Allowed Origins:", allowedOrigins);
  });
}
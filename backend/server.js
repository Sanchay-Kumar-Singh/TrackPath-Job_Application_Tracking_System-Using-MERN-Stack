const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS (PRODUCTION READY) ---------------- */
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://track-path-job-application-tracking-kappa.vercel.app"
    ],
    credentials: true,
  })
);

/* ---------------- BODY PARSER ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ---------------- STATIC FILES ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.send("🚀 Job Tracker Backend is LIVE");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is LIVE 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cities", require("./routes/cityRoutes"));
app.use("/api/sectors", require("./routes/sectorRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));

/* ---------------- ERROR HANDLING ---------------- */
app.use(notFound);
app.use(errorHandler);

/* ---------------- VERCEL SAFE EXPORT ---------------- */
module.exports = app;

/* ---------------- LOCAL SERVER ONLY ---------------- */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
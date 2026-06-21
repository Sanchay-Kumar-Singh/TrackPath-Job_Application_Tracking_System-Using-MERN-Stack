const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root Route
app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Job Tracker API is Live</h1>
    <p>Backend server is running successfully.</p>
    <p>API Health Check: <a href="/api/health">/api/health</a></p>
  `);
});

// Health Check Route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Job Tracker API is running",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cities", require("./routes/cityRoutes"));
app.use("/api/sectors", require("./routes/sectorRoutes"));
app.use("/api/companies", require("./routes/companyRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
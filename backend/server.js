const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");

dotenv.config();

const app = express();

// ✅ CORS setup
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(pinoHttp({ logger }));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// ✅ Default route to test root
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// ✅ Server startup
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  });
} else {
  module.exports = app;
}

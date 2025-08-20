const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");

dotenv.config();

const app = express();

// ✅ Allow both local + deployed frontend (CORS)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://laibazahid-mern-10pshine.vercel.app", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(pinoHttp({ logger }));
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// ✅ Server + DB Connection
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      logger.info(`🚀 Server running on http://localhost:${PORT}`)
    );
  });
} else {
  module.exports = app;
}

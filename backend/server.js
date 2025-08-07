const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger"); // custom logger

dotenv.config();

const app = express();

// 💡 Pino middleware
app.use(pinoHttp({ logger }));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// Server & DB connect
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () =>
      logger.info(`🚀 Server running on http://localhost:${PORT}`)
    );
  });
} else {
  module.exports = app;
}

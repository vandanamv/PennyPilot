const express = require("express");
const mainRouter = require("./routes/index");
const { connectToDatabase } = require("./db");
require("dotenv").config();
const app = express();
const cors = require("cors");

const allowedOrigins = (
  process.env.FRONTEND_URL || "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true });
});
app.use("/pennypilot", mainRouter);

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

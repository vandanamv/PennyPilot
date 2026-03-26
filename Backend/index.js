const express = require("express");
const mainRouter = require("./routes/index");
const { connectToDatabase } = require("./db");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Replace with your frontend origins
    credentials: true,
  })
);

app.use(express.json());
app.use("/pennypilot", mainRouter);

const PORT = 3002;

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

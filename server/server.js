import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB();

// Middleware
app.use(express.json());

// CORS: allow only your deployed frontend
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., https://snap-resume-1.onrender.com
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// API Routes
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

// Optional: Health check
app.get('/', (req, res) => res.send("Server is live..."));

// Optional: Serve frontend from backend (if you want single URL deployment)
if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

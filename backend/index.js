// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./DB/connect.js";

// Routes
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import guestRoutes from './routes/guest.routes.js';

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express
const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        // allow requests with no origin (like mobile apps, curl)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.set('json spaces', 2);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/guest', guestRoutes);

// Test route
app.get("/test", (req, res) => {
  res.send("Server working");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack); // optional: logs error in backend
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
});

// Connect to MongoDB and start server
const port = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is successfully running on port:", port);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection Error:", error);
  });
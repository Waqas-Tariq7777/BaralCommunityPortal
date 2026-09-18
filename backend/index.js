// index.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";


// Routes
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import guestRoutes from './routes/guest.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';


// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize Express
const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim()) 
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        // Allow all vercel preview/deployment URLs dynamically if needed
        if (origin.endsWith(".vercel.app")) {
          return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "256kb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set('json spaces', 2);

// MongoDB Connection helper for Serverless & Local environments
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MONGODB Connected Successfully !! Host:", connectionInstance.connection.host);
  } catch (error) {
    console.log("MONGODB Connection Error:", error);
    throw error;
  }
};

// Middleware to ensure DB is connected before processing requests on Vercel/Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/complaint', complaintRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Test route
app.get("/test", (req, res) => {
  res.send("Server working");
});

app.get("/", (req, res) => {
  res.send("WAPDA Community Portal API Backend is running");
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

// Start local server if not running on Vercel
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  connectDB().then(() => {
    app.listen(port, () => {
      console.log("Server is successfully running on port:", port);
    });
  }).catch(err => {
    console.error("Failed to start server due to DB connection error:", err);
  });
}

export default app;
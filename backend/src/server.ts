import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as dotenv from "dotenv";
import * as path from "path";
import passport from "passport";

// Import passport configuration
import "./controllers/passport";

// Import routes
import userRoutes from "./routes/users";
import sessionRoutes from "./routes/sessions";
import productRoutes from "./routes/products";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";

// Import middleware
import {
  logRoutes,
  logErrors,
  logDatabaseErrors,
  logAuthErrors,
} from "./middleware";

// Import response helpers
import { sendError } from "./utils/responseHelpers";

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps) or from allowed origins
      if (!origin) return callback(null, true);

      // Allow localhost and ngrok tunnels for development
      if (
        origin.includes("localhost") ||
        origin.includes("ngrok.io") ||
        origin.includes("expo.dev") ||
        origin === process.env.FRONTEND_URL
      ) {
        return callback(null, true);
      }

      // For production, you might want to be more restrictive
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Set CORS and Cross-Origin-Resource-Policy headers for static assets
app.use("/assets", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Serve static files from shared/assets
app.use("/assets", express.static(path.join(__dirname, "../../shared/assets")));

// Passport middleware
// app.use(passport.initialize());

// Logging middleware
app.use(morgan("combined"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Bundle Up API is running!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  sendError(res, "Route not found", 404);
});

// Global error handler middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
);

// Start server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📱 Mobile API URL: http://:${PORT}/api`);
});

export default app;

import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./config/db.js";
import apiRoutes from "./routes/index.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// JSON request handling
app.use(express.json());

// Backend health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    application: "MY TASTE",
    message: "MY TASTE Backend API is running",
  });
});

// Database health check
app.get("/api/v1/database-health", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database_name,
        COUNT(*)::int AS total_tables
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      GROUP BY current_database()
    `);

    const database = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Neon PostgreSQL connected successfully",
      database: database.database_name,
      totalTables: database.total_tables,
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

// Shared Module API Routes - NEW
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

export default app;

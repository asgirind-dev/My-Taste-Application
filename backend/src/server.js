import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";
import { testDatabaseConnection } from "./database/testConnection.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  const connected = await testDatabaseConnection();

  if (!connected) {
    console.error("Server startup stopped: database unavailable.");
    await pool.end();
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, () => {
    console.log("----------------------------------");
    console.log("MY TASTE Backend Server");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/v1`);
    console.log("Database: Neon PostgreSQL Connected");
    console.log("----------------------------------");
  });
}

startServer().catch(async (error) => {
  console.error("Server startup failed:", error);
  await pool.end();
  process.exitCode = 1;
});

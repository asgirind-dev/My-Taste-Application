import pool from "../config/db.js";

export async function testDatabaseConnection() {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        NOW() AS server_time
    `);

    console.log("Neon PostgreSQL connected successfully!");
    console.log("Database:", result.rows[0].database_name);
    console.log("User:", result.rows[0].database_user);
    console.log("Server Time:", result.rows[0].server_time);

    return true;
  } catch (error) {
    console.error("Neon PostgreSQL connection failed:", error.message);
    return false;
  }
}

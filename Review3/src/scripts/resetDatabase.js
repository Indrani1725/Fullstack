import dotenv from "dotenv";
import { pool, testDatabaseConnection } from "../config/db.js";
import { ensureEventsTable } from "../models/eventModel.js";
import { ensureUsersTable } from "../models/userModel.js";
import { ensureTicketingTables } from "../models/ticketModel.js";

dotenv.config();

async function resetDatabase() {
  await testDatabaseConnection();
  await ensureUsersTable();
  await ensureEventsTable();
  await ensureTicketingTables();

  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE attendance");
  await pool.query("TRUNCATE TABLE registrations");
  await pool.query("TRUNCATE TABLE tickets");
  await pool.query("TRUNCATE TABLE events");
  await pool.query("TRUNCATE TABLE users");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
}

resetDatabase()
  .then(async () => {
    console.log("Database reset complete. users, events, tickets, registrations, and attendance are empty.");
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Database reset failed.");
    console.error(error);
    await pool.end();
    process.exit(1);
  });

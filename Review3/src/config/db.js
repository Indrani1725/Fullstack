import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const databaseName = process.env.DB_NAME || "campus_ticket_pro";
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || ""
};

function quoteIdentifier(identifier) {
  return `\`${String(identifier).replaceAll("`", "``")}\``;
}

export const pool = mysql.createPool({
  ...dbConfig,
  database: databaseName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testDatabaseConnection() {
  const setupConnection = await mysql.createConnection(dbConfig);
  await setupConnection.query(`CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(databaseName)}`);
  await setupConnection.end();

  const connection = await pool.getConnection();
  connection.release();
}

import crypto from "crypto";
import { pool } from "../config/db.js";

const passwordKeyLength = 64;
const passwordIterations = 120000;
const passwordDigest = "sha512";
let usersTableReady;

export function ensureUsersTable() {
  if (!usersTableReady) {
    usersTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL UNIQUE,
        password_hash VARCHAR(160) NOT NULL,
        password_salt VARCHAR(64) NOT NULL,
        role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_role (role)
      )
    `);
  }

  return usersTableReady;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(password, salt, passwordIterations, passwordKeyLength, passwordDigest)
    .toString("hex");

  return { hash, salt };
}

function passwordsMatch(password, passwordHash, passwordSalt) {
  const { hash } = hashPassword(password, passwordSalt);
  const suppliedHash = Buffer.from(hash, "hex");
  const storedHash = Buffer.from(passwordHash, "hex");

  return suppliedHash.length === storedHash.length && crypto.timingSafeEqual(suppliedHash, storedHash);
}

function mapUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt
  };
}

export async function findUserByEmail(email) {
  await ensureUsersTable();

  const [rows] = await pool.query(
    `SELECT id, name, email, role, password_hash AS passwordHash, password_salt AS passwordSalt,
            created_at AS createdAt
       FROM users
      WHERE email = ?`,
    [email]
  );

  return rows[0] || null;
}

export async function createUser({ name, email, password, role }) {
  await ensureUsersTable();

  const { hash, salt } = hashPassword(password);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, password_salt, role)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, hash, salt, role]
  );

  const [rows] = await pool.query(
    `SELECT id, name, email, role, created_at AS createdAt
       FROM users
      WHERE id = ?`,
    [result.insertId]
  );

  return mapUser(rows[0]);
}

export async function listUsers() {
  await ensureUsersTable();

  const [rows] = await pool.query(
    `SELECT id, name, email, role, created_at AS createdAt
       FROM users
      ORDER BY created_at DESC, id DESC`
  );

  return rows.map(mapUser);
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user || !passwordsMatch(password, user.passwordHash, user.passwordSalt)) {
    return null;
  }

  return mapUser(user);
}

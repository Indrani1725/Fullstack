import { authenticateUser, createUser, findUserByEmail, listUsers } from "../models/userModel.js";

const allowedRoles = new Set(["student", "faculty", "admin"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export async function signUp(req, res, next) {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;
    const role = normalizeRole(req.body.role);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required." });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    if (!allowedRoles.has(role)) {
      return res.status(400).json({ message: "Role must be Student, Faculty, or Admin." });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await createUser({ name, email, password, role });
    res.status(201).json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function signIn(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ data: { user } });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(_req, res, next) {
  try {
    const users = await listUsers();
    res.json({ data: { users } });
  } catch (error) {
    next(error);
  }
}

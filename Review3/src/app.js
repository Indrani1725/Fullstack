import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigin = process.env.CLIENT_URL;
      const isLocalViteClient = !origin || /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin);

      if (!allowedOrigin || origin === allowedOrigin || isLocalViteClient) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS."));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Department Event Ticket Booking API"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", ticketRoutes);
app.use("/", ticketRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.code === "ER_ACCESS_DENIED_ERROR") {
    return res.status(500).json({ message: "MySQL username or password is incorrect." });
  }

  if (error.code === "ECONNREFUSED") {
    return res.status(500).json({ message: "MySQL server is not running." });
  }

  if (error.code && String(error.code).startsWith("ER_")) {
    return res.status(500).json({ message: "Database error. Please check MySQL setup." });
  }

  res.status(500).json({ message: "Unable to complete this action. Please try again." });
});

export default app;

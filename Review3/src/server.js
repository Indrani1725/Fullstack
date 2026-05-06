import dotenv from "dotenv";
import app from "./app.js";
import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(port, () => {
      console.log(`Department Event Ticket Booking API running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start Department Event Ticket Booking API.");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();

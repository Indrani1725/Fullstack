import { pool } from "../config/db.js";

let eventsTableReady;

export function ensureEventsTable() {
  if (!eventsTableReady) {
    eventsTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(180) NOT NULL,
        department VARCHAR(120) NULL,
        category VARCHAR(80) NULL,
        event_date DATE NULL,
        event_time VARCHAR(40) NULL,
        venue VARCHAR(160) NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        seats INT NOT NULL DEFAULT 0,
        description TEXT NULL,
        banner_url TEXT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'Draft',
        created_by VARCHAR(120) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_events_status (status),
        INDEX idx_events_department (department)
      )
    `);
  }

  return eventsTableReady;
}

function mapEvent(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    department: row.department || "",
    category: row.category || "Event",
    date: row.eventDate ? new Date(row.eventDate).toISOString().slice(0, 10) : "",
    time: row.eventTime || "",
    venue: row.venue || "",
    price: Number(row.price || 0),
    seats: Number(row.seats || 0),
    description: row.description || "",
    bannerUrl: row.bannerUrl || "",
    status: row.status || "Draft",
    createdBy: row.createdBy || "",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export async function listEvents() {
  await ensureEventsTable();

  const [rows] = await pool.query(`
    SELECT id, name, department, category, event_date AS eventDate, event_time AS eventTime,
           venue, price, seats, description, banner_url AS bannerUrl, status,
           created_by AS createdBy, created_at AS createdAt, updated_at AS updatedAt
      FROM events
     ORDER BY created_at DESC, id DESC
  `);

  return rows.map(mapEvent);
}

export async function createEvent(event) {
  await ensureEventsTable();

  const [result] = await pool.query(
    `INSERT INTO events (
       name, department, category, event_date, event_time, venue, price, seats,
       description, banner_url, status, created_by
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.name,
      event.department || null,
      event.category || "Event",
      event.date || null,
      event.time || null,
      event.venue || null,
      event.price || 0,
      event.seats || 0,
      event.description || null,
      event.bannerUrl || null,
      event.status || "Draft",
      event.createdBy || null
    ]
  );

  return findEventById(result.insertId);
}

export async function findEventById(id) {
  await ensureEventsTable();

  const [rows] = await pool.query(
    `SELECT id, name, department, category, event_date AS eventDate, event_time AS eventTime,
            venue, price, seats, description, banner_url AS bannerUrl, status,
            created_by AS createdBy, created_at AS createdAt, updated_at AS updatedAt
       FROM events
      WHERE id = ?`,
    [id]
  );

  return mapEvent(rows[0]);
}

export async function updateEvent(id, event) {
  await ensureEventsTable();

  await pool.query(
    `UPDATE events
        SET name = ?,
            department = ?,
            category = ?,
            event_date = ?,
            event_time = ?,
            venue = ?,
            price = ?,
            seats = ?,
            description = ?,
            banner_url = ?,
            status = ?,
            created_by = ?
      WHERE id = ?`,
    [
      event.name,
      event.department || null,
      event.category || "Event",
      event.date || null,
      event.time || null,
      event.venue || null,
      event.price || 0,
      event.seats || 0,
      event.description || null,
      event.bannerUrl || null,
      event.status || "Draft",
      event.createdBy || null,
      id
    ]
  );

  return findEventById(id);
}

export async function updateEventStatus(id, status) {
  await ensureEventsTable();

  await pool.query("UPDATE events SET status = ? WHERE id = ?", [status, id]);
  return findEventById(id);
}

export async function deleteEvent(id) {
  await ensureEventsTable();

  const [result] = await pool.query("DELETE FROM events WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

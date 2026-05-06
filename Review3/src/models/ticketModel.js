import crypto from "crypto";
import { pool } from "../config/db.js";

let ticketingTablesReady;

const ticketColumns = {
  student_id: "INT NULL",
  event_id: "INT NULL",
  status: "VARCHAR(30) NOT NULL DEFAULT 'confirmed'",
  payment_status: "VARCHAR(30) NOT NULL DEFAULT 'paid'",
  qr_code: "TEXT NULL",
  ticket_code: "VARCHAR(80) NULL",
  student_name: "VARCHAR(120) NULL",
  student_email: "VARCHAR(160) NULL",
  mobile: "VARCHAR(30) NULL",
  event_name: "VARCHAR(180) NULL",
  event_department: "VARCHAR(120) NULL",
  event_category: "VARCHAR(80) NULL",
  event_date: "VARCHAR(40) NULL",
  event_time: "VARCHAR(40) NULL",
  event_venue: "VARCHAR(160) NULL",
  event_price: "DECIMAL(10,2) NOT NULL DEFAULT 0",
  event_seats: "INT NOT NULL DEFAULT 0",
  seat: "VARCHAR(30) NULL",
  payment_method: "VARCHAR(60) NULL",
  title: "VARCHAR(180) NULL",
  description: "TEXT NULL",
  category: "VARCHAR(80) NULL",
  priority: "VARCHAR(30) NULL DEFAULT 'medium'",
  requester_name: "VARCHAR(120) NULL",
  requester_email: "VARCHAR(160) NULL",
  created_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
  updated_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
};

function mapTicket(row) {
  if (!row) {
    return null;
  }

  const eventName = row.eventName || row.title || "Campus Event";
  const studentName = row.studentName || row.requesterName || "Student";
  const studentEmail = row.studentEmail || row.requesterEmail || "";

  return {
    id: row.id,
    studentId: row.studentId,
    eventId: row.eventId,
    status: row.status,
    paymentStatus: row.paymentStatus,
    qrCode: row.qrCode,
    ticketCode: row.ticketCode,
    studentName,
    studentEmail,
    mobile: row.mobile,
    eventName,
    eventDepartment: row.eventDepartment,
    eventCategory: row.eventCategory || row.category,
    eventDate: row.eventDate,
    eventTime: row.eventTime,
    eventVenue: row.eventVenue,
    eventPrice: Number(row.eventPrice || 0),
    eventSeats: Number(row.eventSeats || 0),
    seat: row.seat,
    paymentMethod: row.paymentMethod,
    attendanceStatus: row.attendanceStatus || "not_marked",
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function mapAttendance(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    ticketId: row.ticketId,
    studentId: row.studentId,
    eventId: row.eventId,
    attendanceStatus: row.attendanceStatus,
    studentName: row.studentName,
    studentEmail: row.studentEmail,
    eventName: row.eventName,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

async function getColumnNames(tableName) {
  const [columns] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
  return new Set(columns.map((column) => column.Field));
}

async function ensureColumn(tableName, existingColumns, columnName, definition) {
  if (existingColumns.has(columnName)) {
    return;
  }

  await pool.query(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  existingColumns.add(columnName);
}

export async function ensureTicketingTables() {
  if (!ticketingTablesReady) {
    ticketingTablesReady = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tickets (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NULL,
          event_id INT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'pending',
          payment_status VARCHAR(30) NOT NULL DEFAULT 'pending',
          qr_code TEXT NULL,
          ticket_code VARCHAR(80) NULL,
          student_name VARCHAR(120) NULL,
          student_email VARCHAR(160) NULL,
          mobile VARCHAR(30) NULL,
          event_name VARCHAR(180) NULL,
          event_department VARCHAR(120) NULL,
          event_category VARCHAR(80) NULL,
          event_date VARCHAR(40) NULL,
          event_time VARCHAR(40) NULL,
          event_venue VARCHAR(160) NULL,
          event_price DECIMAL(10,2) NOT NULL DEFAULT 0,
          event_seats INT NOT NULL DEFAULT 0,
          seat VARCHAR(30) NULL,
          payment_method VARCHAR(60) NULL,
          title VARCHAR(180) NULL,
          description TEXT NULL,
          category VARCHAR(80) NULL,
          priority VARCHAR(30) NULL DEFAULT 'medium',
          requester_name VARCHAR(120) NULL,
          requester_email VARCHAR(160) NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_tickets_student (student_id),
          INDEX idx_tickets_student_email (student_email),
          INDEX idx_tickets_event (event_id),
          INDEX idx_tickets_status (status),
          INDEX idx_tickets_payment_status (payment_status)
        )
      `);

      const columns = await getColumnNames("tickets");
      for (const [columnName, definition] of Object.entries(ticketColumns)) {
        await ensureColumn("tickets", columns, columnName, definition);
      }

      await pool.query("ALTER TABLE tickets MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'confirmed'");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'paid'");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN title VARCHAR(180) NULL");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN description TEXT NULL");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN category VARCHAR(80) NULL");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN priority VARCHAR(30) NULL DEFAULT 'medium'");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN requester_name VARCHAR(120) NULL");
      await pool.query("ALTER TABLE tickets MODIFY COLUMN requester_email VARCHAR(160) NULL");
      await pool.query(`
        UPDATE tickets
           SET status = CASE
             WHEN status IN ('resolved', 'confirmed') THEN 'confirmed'
             WHEN status IN ('closed', 'rejected') THEN 'rejected'
             WHEN status IN ('open', 'in_progress', '', 'pending') THEN 'pending'
             ELSE status
           END,
           payment_status = CASE
             WHEN payment_status IN ('paid', 'pending', 'failed', 'refunded') THEN payment_status
             WHEN status = 'confirmed' THEN 'paid'
             ELSE 'pending'
           END,
           student_name = COALESCE(student_name, requester_name),
           student_email = COALESCE(student_email, requester_email),
           event_name = COALESCE(event_name, title),
           event_category = COALESCE(event_category, category)
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ticket_id INT NULL,
          student_id INT NOT NULL,
          event_id INT NOT NULL,
          attendance_status VARCHAR(30) NOT NULL DEFAULT 'not_marked',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_attendance_student_event (student_id, event_id),
          INDEX idx_attendance_ticket (ticket_id),
          INDEX idx_attendance_status (attendance_status)
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ticket_id INT NOT NULL,
          student_id INT NOT NULL,
          event_id INT NOT NULL,
          attendance_status VARCHAR(30) NOT NULL DEFAULT 'not_marked',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_registrations_ticket (ticket_id),
          UNIQUE KEY uq_registrations_student_event (student_id, event_id),
          INDEX idx_registrations_event (event_id),
          INDEX idx_registrations_attendance_status (attendance_status)
        )
      `);
    })();
  }

  return ticketingTablesReady;
}

function buildQrCode(ticket) {
  const token = crypto
    .createHash("sha256")
    .update(`${ticket.id}:${ticket.studentId}:${ticket.eventId}:${ticket.ticketCode}:${Date.now()}`)
    .digest("hex")
    .slice(0, 24);

  return JSON.stringify({
    ticketId: ticket.id,
    ticketCode: ticket.ticketCode,
    studentId: ticket.studentId,
    eventId: ticket.eventId,
    token
  });
}

function buildTicketCode(ticketId) {
  return `TB-2026-${String(ticketId).padStart(4, "0")}`;
}

function buildSelectSql(whereClause = "") {
  return `
    SELECT t.id,
           t.student_id AS studentId,
           t.event_id AS eventId,
           t.status,
           t.payment_status AS paymentStatus,
           t.qr_code AS qrCode,
           t.ticket_code AS ticketCode,
           t.student_name AS studentName,
           t.student_email AS studentEmail,
           t.mobile,
           t.event_name AS eventName,
           t.event_department AS eventDepartment,
           t.event_category AS eventCategory,
           t.event_date AS eventDate,
           t.event_time AS eventTime,
           t.event_venue AS eventVenue,
           t.event_price AS eventPrice,
           t.event_seats AS eventSeats,
           t.seat,
           t.payment_method AS paymentMethod,
           t.title,
           t.description,
           t.category,
           t.requester_name AS requesterName,
           t.requester_email AS requesterEmail,
           a.attendance_status AS attendanceStatus,
           t.created_at AS createdAt,
           t.updated_at AS updatedAt
      FROM tickets t
      LEFT JOIN attendance a
        ON a.ticket_id = t.id
       ${whereClause}
     ORDER BY t.created_at DESC, t.id DESC
  `;
}

export async function findAllTickets() {
  await ensureTicketingTables();

  const [rows] = await pool.query(buildSelectSql("WHERE t.status IS NOT NULL"));
  return rows.map(mapTicket);
}

export async function findTicketById(id) {
  await ensureTicketingTables();

  const [rows] = await pool.query(
    buildSelectSql("WHERE t.id = ?"),
    [id]
  );

  return mapTicket(rows[0]);
}

export async function findTicketsByStudent({ studentId, studentEmail }) {
  await ensureTicketingTables();

  const filters = [];
  const values = [];

  if (studentId) {
    filters.push("t.student_id = ?");
    values.push(studentId);
  }

  if (studentEmail) {
    filters.push("LOWER(t.student_email) = LOWER(?)");
    values.push(studentEmail);
  }

  if (!filters.length) {
    return [];
  }

  const [rows] = await pool.query(buildSelectSql(`WHERE ${filters.join(" OR ")}`), values);
  return rows.map(mapTicket);
}

export async function createTicket(ticket) {
  await ensureTicketingTables();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO tickets (
         student_id,
         event_id,
         status,
         payment_status,
         ticket_code,
         student_name,
         student_email,
         mobile,
         event_name,
         event_department,
         event_category,
         event_date,
         event_time,
         event_venue,
         event_price,
         event_seats,
         seat,
         payment_method,
         title,
         description,
         category,
         priority,
         requester_name,
         requester_email
       ) VALUES (?, ?, 'confirmed', 'paid', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'medium', ?, ?)`,
      [
        ticket.studentId,
        ticket.eventId,
        ticket.ticketCode || null,
        ticket.studentName,
        ticket.studentEmail,
        ticket.mobile || null,
        ticket.eventName,
        ticket.eventDepartment || null,
        ticket.eventCategory || "Event",
        ticket.eventDate || null,
        ticket.eventTime || null,
        ticket.eventVenue || null,
        ticket.eventPrice || 0,
        ticket.eventSeats || 0,
        ticket.seat || null,
        ticket.paymentMethod || null,
        ticket.eventName,
        ticket.description || "",
        ticket.eventCategory || "Event",
        ticket.studentName,
        ticket.studentEmail
      ]
    );

    const ticketCode = ticket.ticketCode || buildTicketCode(result.insertId);
    const confirmedTicket = {
      id: result.insertId,
      studentId: ticket.studentId,
      eventId: ticket.eventId,
      ticketCode
    };
    const qrCode = buildQrCode(confirmedTicket);

    await connection.query(
      "UPDATE tickets SET ticket_code = ?, qr_code = ? WHERE id = ?",
      [ticketCode, qrCode, result.insertId]
    );
    await connection.query(
      `INSERT INTO registrations (ticket_id, student_id, event_id, attendance_status)
       VALUES (?, ?, ?, 'not_marked')
       ON DUPLICATE KEY UPDATE attendance_status = attendance_status, updated_at = CURRENT_TIMESTAMP`,
      [result.insertId, ticket.studentId, ticket.eventId]
    );
    await connection.query(
      `INSERT INTO attendance (ticket_id, student_id, event_id, attendance_status)
       VALUES (?, ?, ?, 'not_marked')
       ON DUPLICATE KEY UPDATE ticket_id = VALUES(ticket_id), updated_at = CURRENT_TIMESTAMP`,
      [result.insertId, ticket.studentId, ticket.eventId]
    );

    await connection.commit();
    return findTicketById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateTicketStatus(id, status, paymentStatus = null) {
  await ensureTicketingTables();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existingRows] = await connection.query(
      `SELECT id, student_id AS studentId, event_id AS eventId, ticket_code AS ticketCode, qr_code AS qrCode
         FROM tickets
        WHERE id = ?
        FOR UPDATE`,
      [id]
    );

    const existingTicket = existingRows[0];

    if (!existingTicket) {
      await connection.rollback();
      return null;
    }

    const nextPaymentStatus = paymentStatus || (status === "confirmed" ? "paid" : undefined);
    const qrCode = status === "confirmed"
      ? existingTicket.qrCode || buildQrCode(existingTicket)
      : null;

    await connection.query(
      `UPDATE tickets
          SET status = ?,
              payment_status = COALESCE(?, payment_status),
              qr_code = ?
        WHERE id = ?`,
      [status, nextPaymentStatus || null, qrCode || null, id]
    );

    if (status === "confirmed") {
      await connection.query(
        `INSERT INTO registrations (ticket_id, student_id, event_id, attendance_status)
         VALUES (?, ?, ?, 'not_marked')
         ON DUPLICATE KEY UPDATE ticket_id = VALUES(ticket_id), updated_at = CURRENT_TIMESTAMP`,
        [id, existingTicket.studentId, existingTicket.eventId]
      );
      await connection.query(
        `INSERT INTO attendance (ticket_id, student_id, event_id, attendance_status)
         VALUES (?, ?, ?, 'not_marked')
         ON DUPLICATE KEY UPDATE ticket_id = VALUES(ticket_id), updated_at = CURRENT_TIMESTAMP`,
        [id, existingTicket.studentId, existingTicket.eventId]
      );
    }

    await connection.commit();
    return findTicketById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findAllAttendance() {
  await ensureTicketingTables();

  const [rows] = await pool.query(`
    SELECT r.id,
           r.ticket_id AS ticketId,
           r.student_id AS studentId,
           r.event_id AS eventId,
           r.attendance_status AS attendanceStatus,
           t.student_name AS studentName,
           t.student_email AS studentEmail,
           t.event_name AS eventName,
           r.created_at AS createdAt,
           r.updated_at AS updatedAt
      FROM registrations r
      INNER JOIN tickets t ON t.id = r.ticket_id
     WHERE t.status = 'confirmed'
       AND t.payment_status = 'paid'
     ORDER BY r.created_at DESC, r.id DESC
  `);

  return rows.map(mapAttendance);
}

export async function updateAttendanceStatusByTicket(ticketId, attendanceStatus) {
  await ensureTicketingTables();

  await pool.query(
    `UPDATE registrations
        SET attendance_status = ?
      WHERE ticket_id = ?`,
    [attendanceStatus, ticketId]
  );
  await pool.query(
    `UPDATE attendance
        SET attendance_status = ?
      WHERE ticket_id = ?`,
    [attendanceStatus, ticketId]
  );

  const [rows] = await pool.query(
    `SELECT r.id,
            r.ticket_id AS ticketId,
            r.student_id AS studentId,
            r.event_id AS eventId,
            r.attendance_status AS attendanceStatus,
            t.student_name AS studentName,
            t.student_email AS studentEmail,
            t.event_name AS eventName,
            r.created_at AS createdAt,
            r.updated_at AS updatedAt
       FROM registrations r
       INNER JOIN tickets t ON t.id = r.ticket_id
      WHERE r.ticket_id = ?
        AND t.status = 'confirmed'
        AND t.payment_status = 'paid'`,
    [ticketId]
  );

  return mapAttendance(rows[0]);
}

export async function getAdminStats() {
  await ensureTicketingTables();

  const tickets = await findAllTickets();
  const confirmedTickets = tickets.filter((ticket) => ticket.status === "confirmed");
  const revenue = confirmedTickets.reduce((sum, ticket) => sum + Number(ticket.eventPrice || 0), 0);
  const seatsByEvent = new Map();

  tickets.forEach((ticket) => {
    if (!ticket.eventId) {
      return;
    }

    const currentSeats = seatsByEvent.get(ticket.eventId) || 0;
    seatsByEvent.set(ticket.eventId, Math.max(currentSeats, Number(ticket.eventSeats || 0)));
  });

  const totalSeats = Array.from(seatsByEvent.values()).reduce((sum, seats) => sum + seats, 0);
  const seatOccupancy = totalSeats > 0 ? Math.round((confirmedTickets.length / totalSeats) * 100) : 0;

  return {
    totalBookings: tickets.length,
    confirmedBookings: confirmedTickets.length,
    revenue,
    totalSeats,
    occupiedSeats: confirmedTickets.length,
    seatOccupancy
  };
}

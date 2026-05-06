import {
  createTicket,
  findAllAttendance,
  findAllTickets,
  findTicketById,
  findTicketsByStudent,
  getAdminStats,
  updateAttendanceStatusByTicket,
  updateTicketStatus
} from "../models/ticketModel.js";

const allowedTicketStatuses = new Set(["pending", "confirmed", "rejected", "cancelled"]);
const allowedPaymentStatuses = new Set(["pending", "paid", "failed", "refunded"]);
const allowedAttendanceStatuses = new Set(["not_marked", "present", "absent"]);

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeStatus(value) {
  return normalizeText(value).toLowerCase();
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function logAction(action, details = {}) {
  console.log(`[ticket-flow] ${action}`, details);
}

export async function getTickets(_req, res, next) {
  try {
    logAction("GET /tickets");
    const tickets = await findAllTickets();
    res.json({ data: tickets });
  } catch (error) {
    console.error("[ticket-flow] Failed to fetch tickets", error);
    next(error);
  }
}

export async function getMyTickets(req, res, next) {
  try {
    const studentId = req.query.studentId ? Number(req.query.studentId) : null;
    const studentEmail = normalizeEmail(req.query.studentEmail || req.query.email);

    if (!studentId && !studentEmail) {
      return res.status(400).json({ message: "studentId or studentEmail is required." });
    }

    logAction("GET /my-tickets", { studentId, studentEmail });
    const tickets = await findTicketsByStudent({ studentId, studentEmail });
    res.json({ data: tickets });
  } catch (error) {
    console.error("[ticket-flow] Failed to fetch student tickets", error);
    next(error);
  }
}

export async function getTicket(req, res, next) {
  try {
    const ticket = await findTicketById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.json({ data: ticket });
  } catch (error) {
    console.error("[ticket-flow] Failed to fetch ticket", error);
    next(error);
  }
}

export async function postTicket(req, res, next) {
  try {
    const payload = {
      studentId: toNumber(req.body.studentId),
      eventId: toNumber(req.body.eventId),
      studentName: normalizeText(req.body.studentName || req.body.name || req.body.requesterName),
      studentEmail: normalizeEmail(req.body.studentEmail || req.body.email || req.body.requesterEmail),
      mobile: normalizeText(req.body.mobile),
      eventName: normalizeText(req.body.eventName || req.body.title),
      eventDepartment: normalizeText(req.body.eventDepartment || req.body.department),
      eventCategory: normalizeText(req.body.eventCategory || req.body.category || "Event"),
      eventDate: normalizeText(req.body.eventDate),
      eventTime: normalizeText(req.body.eventTime),
      eventVenue: normalizeText(req.body.eventVenue),
      eventPrice: toNumber(req.body.eventPrice),
      eventSeats: toNumber(req.body.eventSeats),
      seat: normalizeText(req.body.seat),
      paymentMethod: normalizeText(req.body.paymentMethod),
      paymentStatus: normalizeStatus(req.body.paymentStatus),
      ticketCode: normalizeText(req.body.ticketCode || req.body.ticketId),
      description: normalizeText(req.body.description)
    };

    if (!payload.studentId || !payload.eventId || !payload.studentName || !payload.studentEmail || !payload.eventName) {
      return res.status(400).json({
        message: "studentId, eventId, studentName, studentEmail, and eventName are required."
      });
    }

    if (payload.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Ticket can be created only after successful payment." });
    }

    logAction("POST /tickets confirmed booking after payment success", {
      studentId: payload.studentId,
      eventId: payload.eventId,
      studentEmail: payload.studentEmail
    });
    const ticket = await createTicket(payload);
    res.status(201).json({ data: ticket });
  } catch (error) {
    console.error("[ticket-flow] Failed to create ticket", error);
    next(error);
  }
}

export async function patchTicketStatus(req, res, next) {
  try {
    const status = normalizeStatus(req.body.status);
    const paymentStatus = req.body.paymentStatus ? normalizeStatus(req.body.paymentStatus) : null;

    if (!allowedTicketStatuses.has(status)) {
      return res.status(400).json({ message: "Invalid ticket status." });
    }

    if (paymentStatus && !allowedPaymentStatuses.has(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status." });
    }

    logAction("PATCH /tickets/:id/status", { id: req.params.id, status, paymentStatus });
    const ticket = await updateTicketStatus(req.params.id, status, paymentStatus);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.json({ data: ticket });
  } catch (error) {
    console.error("[ticket-flow] Failed to update ticket status", error);
    next(error);
  }
}

export async function getAttendance(_req, res, next) {
  try {
    logAction("GET /attendance");
    const attendance = await findAllAttendance();
    res.json({ data: attendance });
  } catch (error) {
    console.error("[ticket-flow] Failed to fetch attendance", error);
    next(error);
  }
}

export async function patchAttendanceStatus(req, res, next) {
  try {
    const attendanceStatus = normalizeStatus(req.body.attendanceStatus || req.body.status);

    if (!allowedAttendanceStatuses.has(attendanceStatus)) {
      return res.status(400).json({ message: "Invalid attendance status." });
    }

    logAction("PATCH /attendance/:ticketId/status", {
      ticketId: req.params.ticketId,
      attendanceStatus
    });
    const attendance = await updateAttendanceStatusByTicket(req.params.ticketId, attendanceStatus);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found." });
    }

    res.json({ data: attendance });
  } catch (error) {
    console.error("[ticket-flow] Failed to update attendance", error);
    next(error);
  }
}

export async function getStats(_req, res, next) {
  try {
    logAction("GET /admin/stats");
    const stats = await getAdminStats();
    res.json({ data: stats });
  } catch (error) {
    console.error("[ticket-flow] Failed to fetch admin stats", error);
    next(error);
  }
}

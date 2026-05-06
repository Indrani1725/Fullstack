import { Router } from "express";
import {
  getEvents,
  patchEventStatus,
  postEvent,
  putEvent,
  removeEvent
} from "../controllers/eventController.js";
import {
  getAttendance,
  getMyTickets,
  getStats,
  getTicket,
  getTickets,
  patchAttendanceStatus,
  patchTicketStatus,
  postTicket
} from "../controllers/ticketController.js";

const router = Router();

router.get("/events", getEvents);
router.post("/events", postEvent);
router.put("/events/:id", putEvent);
router.patch("/events/:id/status", patchEventStatus);
router.delete("/events/:id", removeEvent);
router.get("/tickets", getTickets);
router.get("/tickets/:id", getTicket);
router.post("/tickets", postTicket);
router.patch("/tickets/:id/status", patchTicketStatus);
router.get("/my-tickets", getMyTickets);
router.get("/attendance", getAttendance);
router.patch("/attendance/:ticketId/status", patchAttendanceStatus);
router.get("/admin/stats", getStats);

export default router;

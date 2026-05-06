import {
  createEvent,
  deleteEvent,
  listEvents,
  updateEvent,
  updateEventStatus
} from "../models/eventModel.js";

function normalizeText(value) {
  return String(value || "").trim();
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeEventPayload(body) {
  return {
    name: normalizeText(body.name),
    department: normalizeText(body.department),
    category: normalizeText(body.category || "Event"),
    date: normalizeText(body.date),
    time: normalizeText(body.time),
    venue: normalizeText(body.venue),
    price: toNumber(body.price),
    seats: toNumber(body.seats),
    description: normalizeText(body.description),
    bannerUrl: normalizeText(body.bannerUrl),
    status: normalizeText(body.status || "Draft"),
    createdBy: normalizeText(body.createdBy)
  };
}

function validateEvent(event) {
  return event.name && event.date && event.time && event.venue && event.category;
}

export async function getEvents(_req, res, next) {
  try {
    const events = await listEvents();
    res.json({ data: events });
  } catch (error) {
    next(error);
  }
}

export async function postEvent(req, res, next) {
  try {
    const event = normalizeEventPayload(req.body);

    if (!validateEvent(event)) {
      return res.status(400).json({ message: "Event name, date, time, venue, and category are required." });
    }

    const createdEvent = await createEvent(event);
    res.status(201).json({ data: createdEvent });
  } catch (error) {
    next(error);
  }
}

export async function putEvent(req, res, next) {
  try {
    const event = normalizeEventPayload(req.body);

    if (!validateEvent(event)) {
      return res.status(400).json({ message: "Event name, date, time, venue, and category are required." });
    }

    const updatedEvent = await updateEvent(req.params.id, event);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ data: updatedEvent });
  } catch (error) {
    next(error);
  }
}

export async function patchEventStatus(req, res, next) {
  try {
    const status = normalizeText(req.body.status);

    if (!status) {
      return res.status(400).json({ message: "Event status is required." });
    }

    const updatedEvent = await updateEventStatus(req.params.id, status);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ data: updatedEvent });
  } catch (error) {
    next(error);
  }
}

export async function removeEvent(req, res, next) {
  try {
    const wasDeleted = await deleteEvent(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.json({ data: { deleted: true } });
  } catch (error) {
    next(error);
  }
}

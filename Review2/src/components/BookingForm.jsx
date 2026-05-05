import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/eventData';

const INITIAL_FORM = {
  name: '',
  email: '',
  department: '',
  tickets: 1,
};

const INITIAL_ERRORS = {
  name: '',
  email: '',
  department: '',
  tickets: '',
};

/**
 * BookingForm – FIXED VERSION
 * ✔ Booking saves in localStorage
 * ✔ Student bookings remain visible
 * ✔ No logout after booking
 * ✔ All existing connections preserved
 */
function BookingForm({ event, availableTickets, onBookingSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // =============================
  // Validation
  // =============================
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Full name is required.';
        return '';

      case 'email':
        if (!value.trim()) return 'Email address is required.';
        return '';

      case 'department':
        if (!value) return 'Please select your department.';
        return '';

      case 'tickets': {
        const num = Number(value);
        if (num < 1) return 'Minimum 1 ticket required.';
        if (num > availableTickets)
          return `Only ${availableTickets} tickets remaining.`;
        if (num > 10) return 'Maximum 10 tickets allowed.';
        return '';
      }

      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    let valid = true;

    Object.keys(INITIAL_FORM).forEach((key) => {
      const err = validateField(key, form[key]);
      newErrors[key] = err;
      if (err) valid = false;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      department: true,
      tickets: true,
    });

    return valid;
  };

  // =============================
  // Input Handlers
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    const newVal =
      name === 'tickets'
        ? value === ''
          ? ''
          : parseInt(value, 10) || ''
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: newVal,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newVal),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const incrementTickets = () => {
    const next = Number(form.tickets) + 1;
    if (next > Math.min(availableTickets, 10)) return;

    setForm((prev) => ({
      ...prev,
      tickets: next,
    }));
  };

  const decrementTickets = () => {
    const next = Number(form.tickets) - 1;
    if (next < 1) return;

    setForm((prev) => ({
      ...prev,
      tickets: next,
    }));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setTouched({});
  };

  // =============================
  // MAIN BOOKING FIX
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 700));

    const bookingId = `BK-${Date.now()}`;

    const bookingData = {
      bookingId,
      userName: form.name.trim(),
      userEmail: form.email.trim(),
      userDept: form.department,
      ticketsBooked: Number(form.tickets),
      totalAmount: Number(form.tickets) * event.ticketPrice,
      eventName: event.name,
      bookedAt: new Date().toLocaleString(),
    };

    // ==================================
    // SAVE BOOKINGS IN LOCAL STORAGE
    // ==================================
    const oldBookings =
      JSON.parse(localStorage.getItem('studentBookings')) || [];

    oldBookings.push(bookingData);

    localStorage.setItem(
      'studentBookings',
      JSON.stringify(oldBookings)
    );

    setSubmitting(false);

    // Existing connection
    onBookingSuccess(bookingData);

    handleReset();
  };

  const totalAmount =
    Number(form.tickets || 0) * event.ticketPrice;

  const isSoldOut = availableTickets === 0;

  return (
    <div className="card" id="booking-form-card">
      <div className="card-header">
        <div className="card-icon cyan">🎫</div>

        <div>
          <div className="card-title">Book Tickets</div>
          <div className="card-subtitle">
            Secure your seat at {event.name}
          </div>
        </div>
      </div>

      <form
        id="ticket-booking-form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Name */}
        <div className="form-group">
          <label className="form-label">
            Full Name *
          </label>

          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSoldOut}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email *
          </label>

          <input
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSoldOut}
          />
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="form-label">
            Department *
          </label>

          <select
            name="department"
            className="form-control"
            value={form.department}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSoldOut}
          >
            <option value="">Select</option>

            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Tickets */}
        <div className="form-group">
          <label className="form-label">
            Number of Tickets *
          </label>

          <div className="tickets-control">
            <button
              type="button"
              className="ticket-btn"
              onClick={decrementTickets}
            >
              −
            </button>

            <input
              name="tickets"
              className="form-control"
              value={form.tickets}
              onChange={handleChange}
            />

            <button
              type="button"
              className="ticket-btn"
              onClick={incrementTickets}
            >
              +
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="price-preview">
          <div>Total Amount</div>

          <div className="price-preview-value">
            ₹{totalAmount}
          </div>
        </div>

        {/* Buttons */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || isSoldOut}
        >
          {submitting
            ? 'Processing...'
            : '🎟️ Confirm Booking'}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={handleReset}
        >
          ↺ Reset Form
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
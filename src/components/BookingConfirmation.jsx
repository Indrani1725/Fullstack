import React from 'react';

/**
 * BookingConfirmation – modal overlay shown after a successful booking
 * @param {object}   booking  - booking details returned from BookingForm
 * @param {function} onClose  - callback to dismiss the modal
 */
function BookingConfirmation({ booking, onClose }) {
  if (!booking) return null;

  const {
    bookingId,
    userName,
    userEmail,
    userDept,
    ticketsBooked,
    totalAmount,
    eventName,
  } = booking;

  const rows = [
    { label: 'Booking ID', value: bookingId },
    { label: 'Name', value: userName },
    { label: 'Email', value: userEmail },
    { label: 'Department', value: userDept },
    { label: 'Event', value: eventName },
    { label: 'Tickets Booked', value: `${ticketsBooked} ticket${ticketsBooked > 1 ? 's' : ''}` },
  ];

  return (
    <div
      className="success-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Booking Confirmation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="success-card" id="booking-confirmation-modal">
        {/* Success icon */}
        <div className="success-icon-wrap" aria-hidden="true">
          ✅
        </div>

        <h2>Booking Confirmed!</h2>
        <p className="subtitle">
          Your tickets are reserved. A confirmation will be sent to{' '}
          <strong style={{ color: 'var(--primary-light)' }}>{userEmail}</strong>
        </p>

        {/* Booking Summary */}
        <div className="booking-summary" id="booking-summary">
          <div className="booking-summary-title">📋 Booking Summary</div>

          {rows.map((row) => (
            <div key={row.label} className="summary-row">
              <span className="summary-label">{row.label}</span>
              <span
                className="summary-value"
                style={row.label === 'Booking ID' ? { color: 'var(--primary-light)', fontFamily: 'Outfit, sans-serif' } : {}}
              >
                {row.value}
              </span>
            </div>
          ))}

          <div className="summary-row total">
            <span className="summary-label" style={{ fontWeight: 700 }}>
              💳 Total Amount Paid
            </span>
            <span className="summary-value total-amount" id="confirmation-total-amount">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="booking-id">
          Your Booking Reference: <span id="booking-reference-id">{bookingId}</span>
        </div>

        <button
          id="close-confirmation"
          className="btn btn-success"
          onClick={onClose}
        >
          🎉 Done — Book Another Ticket
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;

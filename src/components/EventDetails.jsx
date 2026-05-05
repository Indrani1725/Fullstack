import React from 'react';

/**
 * EventDetails – displays all information about the event
 * @param {object} event - event data object
 * @param {number} availableTickets - live count updated after bookings
 */
function EventDetails({ event, availableTickets }) {
  const pctRemaining = Math.round((availableTickets / event.totalTickets) * 100);

  const statusClass =
    availableTickets === 0 ? 'sold-out' : availableTickets <= 20 ? 'low' : '';

  const statusLabel =
    availableTickets === 0
      ? '🔴 Sold Out'
      : availableTickets <= 20
      ? '🟡 Almost Full'
      : '🟢 Available';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const infoItems = [
    { label: '📅 Date', value: formatDate(event.date) },
    { label: '🕙 Time', value: event.time },
    { label: '📍 Venue', value: event.venue },
    { label: '🎫 Ticket Price', value: `₹${event.ticketPrice.toLocaleString('en-IN')}` },
    { label: '🏛️ Organizer', value: event.organizer },
    { label: '🎟️ Total Seats', value: event.totalTickets.toLocaleString() },
  ];

  return (
    <div className="card" id="event-details-card">
      {/* Card header */}
      <div className="card-header">
        <div className="card-icon purple">📋</div>
        <div>
          <div className="card-title">Event Details</div>
          <div className="card-subtitle">All you need to know</div>
        </div>
      </div>

      {/* Event banner */}
      <div className="event-banner">
        <div className="event-banner-content">
          <span className="icon">🚀</span>
          <p>Technical Extravaganza</p>
        </div>
      </div>

      {/* Event name & dept */}
      <h2 className="event-name gradient-text">{event.name}</h2>
      <div className="event-dept">🏢 {event.department}</div>

      {/* Info grid */}
      <div className="event-grid">
        {infoItems.map((item) => (
          <div key={item.label} className="event-info-item">
            <div className="event-info-label">{item.label}</div>
            <div className="event-info-value">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '0.87rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.65',
          marginBottom: '1.25rem',
        }}
      >
        {event.description}
      </p>

      {/* Ticket availability bar */}
      <div className={`ticket-availability ${statusClass}`}>
        <div>
          <div className={`ticket-count ${statusClass}`} id="available-tickets-count">
            {availableTickets}
          </div>
          <div className="ticket-label">Tickets Left • {statusLabel}</div>
        </div>
        <div className="ticket-progress">
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Sold</span>
            <span>{pctRemaining}% left</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${statusClass}`}
              style={{ width: `${pctRemaining}%` }}
            />
          </div>
          <div className="progress-label">
            {event.totalTickets - availableTickets} / {event.totalTickets} booked
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;

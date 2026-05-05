import React, { useState, useCallback, useEffect } from 'react';
import './index.css';
import './App.css';
import './LoginPage.css';
import './Admin.css';

import { EVENT_DATA } from './data/eventData';
import LoginPage from './components/LoginPage';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';

/**
 * Main Application Component
 */
function App() {
  // ── Auth state ─────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);

  // ── Events state ───────────────────────────────────────────────────────
  // Load from localStorage or use initial EVENT_DATA as default
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('dept_events_list');
    if (saved) return JSON.parse(saved);
    // If no events, create an initial one with an ID
    const initial = { ...EVENT_DATA, id: 'EVT-DEFAULT', availableTickets: EVENT_DATA.totalTickets };
    return [initial];
  });

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync events to localStorage
  useEffect(() => {
    localStorage.setItem('dept_events_list', JSON.stringify(events));
  }, [events]);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // ── Toast helpers ──────────────────────────────────────────────────────
  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleLogin = useCallback((userData) => {
    setUser(userData);
    addToast('success', `Welcome, ${userData.name}! 🎉`);
  }, [addToast]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setConfirmedBooking(null);
    setSelectedEventId(null);
    addToast('success', 'You have been logged out.');
  }, [addToast]);

  const handleCreateEvent = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    addToast('success', `Event "${newEvent.name}" created successfully!`);
  };

  const handleBookingSuccess = useCallback((bookingDetails) => {
    // Update the specific event's ticket count
    setEvents(prev => prev.map(ev => {
      if (ev.id === selectedEventId) {
        return { ...ev, availableTickets: ev.availableTickets - bookingDetails.ticketsBooked };
      }
      return ev;
    }));
    
    setConfirmedBooking(bookingDetails);
    addToast('success', `🎉 Booking confirmed for ${bookingDetails.eventName}!`);
  }, [selectedEventId, addToast]);

  const handleCloseConfirmation = useCallback(() => {
    setConfirmedBooking(null);
  }, []);

  // ── Layout Components ─────────────────────────────────────────────────
  
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const isAdmin = user.role === 'Admin';

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo" onClick={() => setSelectedEventId(null)} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">🎓</div>
            <div className="logo-text">Dept<span>Events</span></div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAdmin && <span className="badge-role admin">Admin Access</span>}
            <div className="user-badge">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
              <button id="logout-btn" className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="main-layout" style={{ display: 'block' }}>
        
        {/* Admin Section */}
        {isAdmin && !selectedEventId && (
          <AdminDashboard events={events} onCreateEvent={handleCreateEvent} />
        )}

        {/* Event Selection Screen */}
        {!selectedEventId ? (
          <>
            <section className="hero" style={{ padding: '2rem 0' }}>
              <div className="hero-tag">Available Events</div>
              <h1>Discover & <span className="gradient-text">Book Tickets</span></h1>
              <p>Select an event below to view details and reserve your spot.</p>
            </section>

            <div className="event-selection-grid">
              {events.map(event => (
                <div key={event.id} className="card event-card-mini" onClick={() => setSelectedEventId(event.id)}>
                  <div className="event-dept" style={{ marginBottom: '0.5rem' }}>{event.department}</div>
                  <h3 className="event-name" style={{ fontSize: '1.25rem' }}>{event.name}</h3>
                  <div className="event-info-label" style={{ marginTop: '1rem' }}>
                    📅 {event.date} • 🕙 {event.time}
                  </div>
                  <div className="event-info-label">
                    📍 {event.venue}
                  </div>
                  <div className="ticket-availability" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                    <div className="ticket-count" style={{ fontSize: '1.25rem' }}>{event.availableTickets}</div>
                    <div className="ticket-label">Left</div>
                    <div style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--primary-light)' }}>
                      ₹{event.ticketPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Single Event View (Booking) */
          <>
            <div style={{ marginBottom: '2rem' }}>
              <button className="btn btn-ghost" style={{ width: 'auto' }} onClick={() => setSelectedEventId(null)}>
                ⬅️ Back to All Events
              </button>
            </div>
            
            <div className="main-layout" style={{ padding: 0 }}>
              <EventDetails event={selectedEvent} availableTickets={selectedEvent.availableTickets} />
              <BookingForm 
                event={selectedEvent} 
                availableTickets={selectedEvent.availableTickets} 
                onBookingSuccess={handleBookingSuccess} 
              />
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>© 2026 Internal Department Event Ticket Portal</p>
      </footer>

      {/* ── Modals & Toasts ── */}
      <BookingConfirmation booking={confirmedBooking} onClose={handleCloseConfirmation} />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;

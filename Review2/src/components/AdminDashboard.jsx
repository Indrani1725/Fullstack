import React, { useState } from 'react';
import { DEPARTMENTS } from '../data/eventData';

const INITIAL_EVENT_FORM = {
  name: '',
  department: '',
  date: '',
  time: '',
  venue: '',
  ticketPrice: '',
  totalTickets: '',
  description: '',
  organizer: '',
};

function AdminDashboard({ events, onCreateEvent }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_EVENT_FORM);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Event name is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time) newErrors.time = 'Time is required';
    if (!form.venue.trim()) newErrors.venue = 'Venue is required';
    if (!form.ticketPrice || Number(form.ticketPrice) < 0) newErrors.ticketPrice = 'Enter valid price';
    if (!form.totalTickets || Number(form.totalTickets) <= 0) newErrors.totalTickets = 'Enter valid ticket count';
    if (!form.organizer.trim()) newErrors.organizer = 'Organizer is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newEvent = {
      ...form,
      id: `EVT-${Date.now()}`,
      ticketPrice: Number(form.ticketPrice),
      totalTickets: Number(form.totalTickets),
      availableTickets: Number(form.totalTickets),
      createdAt: new Date().toISOString(),
    };

    onCreateEvent(newEvent);
    setForm(INITIAL_EVENT_FORM);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2 className="section-title">Admin Dashboard</h2>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowModal(true)}>
          ➕ Create New Event
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-label">Total Events</span>
          <span className="stat-value">{events.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Tickets Sold</span>
          <span className="stat-value">
            {events.reduce((acc, ev) => acc + (ev.totalTickets - ev.availableTickets), 0)}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">System Status</span>
          <span className="stat-value" style={{ color: 'var(--success)' }}>Active</span>
        </div>
      </div>

      <h3 className="section-title">Manage Events</h3>
      <div className="event-table-container">
        <table className="event-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Dept</th>
              <th>Date & Time</th>
              <th>Pricing</th>
              <th>Availability</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td style={{ fontWeight: 600 }}>{event.name}</td>
                <td><span className="badge-role student">{event.department}</span></td>
                <td>{event.date} @ {event.time}</td>
                <td>₹{event.ticketPrice}</td>
                <td>{event.availableTickets} / {event.totalTickets}</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No events created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="section-title">Create New Event</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input name="name" className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange} placeholder="e.g. Annual Tech Fest" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select name="department" className={`form-control ${errors.department ? 'error' : ''}`} value={form.department} onChange={handleChange}>
                    <option value="">Select Dept</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Organizer</label>
                  <input name="organizer" className={`form-control ${errors.organizer ? 'error' : ''}`} value={form.organizer} onChange={handleChange} placeholder="e.g. CSE Dept" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Event Date</label>
                  <input type="date" name="date" className={`form-control ${errors.date ? 'error' : ''}`} value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="time" name="time" className={`form-control ${errors.time ? 'error' : ''}`} value={form.time} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Ticket Price (₹)</label>
                  <input type="number" name="ticketPrice" className={`form-control ${errors.ticketPrice ? 'error' : ''}`} value={form.ticketPrice} onChange={handleChange} placeholder="0 for free" />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Tickets</label>
                  <input type="number" name="totalTickets" className={`form-control ${errors.totalTickets ? 'error' : ''}`} value={form.totalTickets} onChange={handleChange} placeholder="Capacity" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue</label>
                <input name="venue" className={`form-control ${errors.venue ? 'error' : ''}`} value={form.venue} onChange={handleChange} placeholder="e.g. Block C Auditorium" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} placeholder="Tell us about the event..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary">🚀 Launch Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

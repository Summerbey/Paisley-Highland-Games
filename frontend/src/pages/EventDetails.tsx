import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI, competitorAPI } from '../services/api';
import type { Event } from '../types';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const response = await eventAPI.getEvent(id);
        setEvent(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setRegistering(true);
    setRegisterError(null);
    try {
      const newCompetitor = await competitorAPI.createCompetitor(formData);
      await competitorAPI.registerForEvent(newCompetitor._id, id);
      setRegisterSuccess(true);
      setRegistering(false);
      const updatedEvent = await eventAPI.getEvent(id);
      setEvent(updatedEvent);
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
      setRegistering(false);
      console.error('Registration error:', err);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;

  if (error || !event) {
    return (
      <div className="error-container">
        <h2>{error || 'Event not found'}</h2>
        <button onClick={() => navigate('/events')} className="btn btn-primary">
          Back to Events
        </button>
      </div>
    );
  }

  const spotsRemaining = event.maxCompetitors - event.currentCompetitors;
  const progressPercentage = (event.currentCompetitors / event.maxCompetitors) * 100;

  return (
    <div className="event-details-page">
      <button onClick={() => navigate('/events')} className="back-button">
        ← Back to Events
      </button>

      <div className="event-details-container">
        <div className="event-details-header">
          <h1>{event.name}</h1>
          <span className={`category-badge ${event.category.toLowerCase()}`}>
            {event.category}
          </span>
        </div>

        <div className="event-details-content">
          <section className="detail-section">
            <h2>Description</h2>
            <p>{event.description}</p>
          </section>

          <section className="detail-section">
            <h2>Event Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Category:</span>
                <span className="info-value">{event.category}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
                  {event.status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Current Competitors:</span>
                <span className="info-value">{event.currentCompetitors}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Maximum Capacity:</span>
                <span className="info-value">{event.maxCompetitors}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Spots Remaining:</span>
                <span className={`info-value ${spotsRemaining === 0 ? 'text-red' : 'text-green'}`}>
                  {spotsRemaining}
                </span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h2>Registration Progress</h2>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
              <p className="progress-text">
                {event.currentCompetitors} / {event.maxCompetitors} competitors registered
                ({progressPercentage.toFixed(0)}%)
              </p>
            </div>
          </section>

          {event.status === 'Open' && spotsRemaining > 0 && (
            <div className="action-section">
              <button className="btn btn-primary btn-large" onClick={() => setShowModal(true)}>
                Register for this Event
              </button>
            </div>
          )}

          {event.status === 'Full' && (
            <div className="alert alert-warning">
              This event is currently full. Registration is closed.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => !registering && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {registerSuccess ? (
              <div className="modal-success">
                <h2>Registration Successful!</h2>
                <p>You have been registered for <strong>{event.name}</strong>.</p>
                <button className="btn btn-primary" onClick={() => { setShowModal(false); setRegisterSuccess(false); setFormData({ name: '', email: '', country: '' }); }}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Register for {event.name}</h2>
                  <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                </div>
                <form onSubmit={handleRegister} className="modal-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                  {registerError && <div className="alert alert-error">{registerError}</div>}
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={registering}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={registering}>
                      {registering ? 'Registering...' : 'Confirm Registration'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
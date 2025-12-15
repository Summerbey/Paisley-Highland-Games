import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventAPI } from '../services/api';
import type { Event } from '../types';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        const response = await eventAPI.getEvent(id);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
        console.error('Error fetching event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

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
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="progress-text">
                {event.currentCompetitors} / {event.maxCompetitors} competitors registered 
                ({progressPercentage.toFixed(0)}%)
              </p>
            </div>
          </section>

          {event.status === 'Open' && spotsRemaining > 0 && (
            <div className="action-section">
              <button className="btn btn-primary btn-large">
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
    </div>
  );
};

export default EventDetails;
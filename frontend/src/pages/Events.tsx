import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import type { Event } from '../types';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventAPI.getAllEvents();
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="events-page">
      <h1>Highland Games Events</h1>
      <p className="page-description">
        Browse all the exciting events at the Paisley Highland Games
      </p>

      <div className="events-grid">
        {events.map((event) => (
          <Link to= {`/events/${event._id}`} key={event._id} className="event-card-link">
            <div className="event-header">
              <h2>{event.name}</h2>
              <span className={`category-badge ${event.category.toLowerCase()}`}>
                {event.category}
              </span>
            </div>
            
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="detail-item">
                <span className="label">Competitors:</span>
                <span className="value">
                  {event.currentCompetitors} / {event.maxCompetitors}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="label">Status:</span>
                <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
                  {event.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Events;
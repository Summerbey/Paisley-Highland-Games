import { useState, useEffect } from 'react';
import { competitorAPI } from '../services/api';
import type { Competitor } from '../types';

const Competitors = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        const response = await competitorAPI.getAllCompetitors();
        setCompetitors(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch competitors');
        setLoading(false);
        console.error('Error fetching competitors:', err);
      }
    };

    fetchCompetitors();
  }, []);

  if (loading) {
    return <div className="loading">Loading competitors...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="competitors-page">
      <h1>Highland Games Competitors</h1>
      <p className="page-description">
        Meet the athletes competing in the Paisley Highland Games
      </p>

      <div className="competitors-grid">
        {competitors.map((competitor) => (
          <div key={competitor._id} className="competitor-card">
            <div className="competitor-header">
              <h2>{competitor.name}</h2>
              <span className="country-badge">{competitor.country}</span>
            </div>
            
            <div className="competitor-details">
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{competitor.email}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Registered Events:</span>
                <span className="value">
                  {Array.isArray(competitor.registeredEvents) 
                    ? competitor.registeredEvents.length 
                    : 0} events
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Competitors;
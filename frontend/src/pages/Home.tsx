import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Paisley Highland Games</h1>
        <p className="subtitle">Welcome to Scotland's Premier Highland Games Event</p>
        
        <div className="info-section">
          <p>
            Experience the thrill of traditional Scottish athletics, music, and culture. 
            From the iconic Caber Toss to Highland Dancing, our games celebrate Scotland's rich heritage.
          </p>
        </div>

        <div className="quick-links">
          <Link to="/events" className="btn btn-primary">
            View Events
          </Link>
          <Link to="/competitors" className="btn btn-secondary">
            View Competitors
          </Link>
        </div>

        <div className="features">
          <div className="feature-card">
            <h3>🏋️ Heavy Events</h3>
            <p>Caber Toss, Stone Put, Hammer Throw, Weight for Distance</p>
          </div>
          <div className="feature-card">
            <h3>🏃 Track & Field</h3>
            <p>Sprint races, Hill races, High Jump, Long Jump</p>
          </div>
          <div className="feature-card">
            <h3>🎵 Cultural Events</h3>
            <p>Bagpipe competitions and Highland Dancing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
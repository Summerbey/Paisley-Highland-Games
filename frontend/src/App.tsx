import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Competitors from './pages/Competitors';
import EventDetails from './pages/EventDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🏴󠁧󠁢󠁳󠁣󠁴󠁿 Paisley Highland Games
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/events" className="nav-link">Events</Link>
              </li>
              <li className="nav-item">
                <Link to="/competitors" className="nav-link">Competitors</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/competitors" element={<Competitors />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Paisley Highland Games - Group M Project.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

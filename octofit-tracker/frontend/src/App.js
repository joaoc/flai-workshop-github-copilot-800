import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const NAV_ITEMS = [
  { to: '/users',       label: 'Users',       icon: '👤' },
  { to: '/teams',       label: 'Teams',       icon: '🏆' },
  { to: '/activities',  label: 'Activities',  icon: '🏃' },
  { to: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { to: '/workouts',    label: 'Workouts',    icon: '💪' },
];

const FEATURE_CARDS = [
  { icon: '🏃', title: 'Track Activities', text: 'Log runs, cycling, swimming and more with calories and duration.' },
  { icon: '🏆', title: 'Team Competitions', text: 'Create teams and climb the leaderboard together.' },
  { icon: '💪', title: 'Workout Plans', text: 'Follow curated workouts matched to your fitness level.' },
  { icon: '📊', title: 'Live Leaderboard', text: 'See real-time rankings for every team across all activities.' },
];

function HomePage() {
  return (
    <div className="container mt-4">
      {/* Hero */}
      <div className="octofit-hero text-center mb-5">
        <img
          src="/octofitapp-small.png"
          alt="OctoFit Tracker"
          height="80"
          className="mb-3"
          style={{ borderRadius: '12px', objectFit: 'contain' }}
        />
        <h1 className="display-4 fw-bold">
          Welcome to <span className="accent">OctoFit Tracker</span>
        </h1>
        <p className="lead mt-3 mb-4">
          Track your fitness activities, compete with your team, and achieve your goals!
        </p>
        <NavLink to="/activities" className="btn btn-success btn-lg me-2">Log Activity</NavLink>
        <NavLink to="/leaderboard" className="btn btn-outline-light btn-lg">View Leaderboard</NavLink>
      </div>

      {/* Feature cards */}
      <div className="row g-4">
        {FEATURE_CARDS.map((c) => (
          <div className="col-sm-6 col-lg-3" key={c.title}>
            <div className="card octofit-card h-100 text-center">
              <div className="card-body">
                <div style={{ fontSize: '2.5rem' }}>{c.icon}</div>
                <h5 className="card-title mt-2">{c.title}</h5>
                <p className="card-text text-muted">{c.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        {/* ── Navbar ───────────────────────────────────────────── */}
        <nav className="navbar navbar-expand-lg octofit-navbar">
          <div className="container-fluid">
            <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
              <img
                src="/octofitapp-small.png"
                alt="OctoFit Tracker logo"
                height="38"
                style={{ borderRadius: '6px', objectFit: 'contain' }}
              />
              <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>OctoFit Tracker</span>
            </NavLink>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarMain"
              aria-controls="navbarMain"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarMain">
              <ul className="navbar-nav ms-auto">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                  <li className="nav-item" key={to}>
                    <NavLink
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                      to={to}
                    >
                      {icon} {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* ── Routes ───────────────────────────────────────────── */}
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/users"      element={<Users />} />
          <Route path="/teams"      element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"   element={<Workouts />} />
        </Routes>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="text-center text-muted py-4 mt-5 border-top">
          <small>&copy; {new Date().getFullYear()} OctoFit Tracker &mdash; GitHub Copilot Workshop</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;

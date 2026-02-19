import React, { useState, useEffect } from 'react';

const MEDAL = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: Fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Leaderboard: Fetched data:', data);
        setLeaderboard(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 octofit-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading leaderboard&hellip;</span>
        </div>
        <span className="ms-3 text-muted">Loading leaderboard&hellip;</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span>Failed to load leaderboard: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-heading">📊 Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <div className="alert alert-info">No leaderboard data found.</div>
      ) : (
        <div className="card octofit-card shadow-sm">
          <div className="card-header">
            Team Rankings &mdash; {leaderboard.length} team{leaderboard.length !== 1 ? 's' : ''}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Total Activities</th>
                    <th scope="col">Total Calories</th>
                    <th scope="col">Total Duration (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry._id || index} className={index === 0 ? 'table-warning fw-bold' : ''}>
                      <td>{MEDAL[index] || entry.rank}</td>
                      <td>{entry.team_name}</td>
                      <td>
                        <span className="badge bg-primary">{entry.total_activities}</span>
                      </td>
                      <td>
                        <span className="badge bg-success">{entry.total_calories}</span>
                      </td>
                      <td>{entry.total_duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;

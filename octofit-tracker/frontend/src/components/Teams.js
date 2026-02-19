import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: Fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Teams: Fetched data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 octofit-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading teams&hellip;</span>
        </div>
        <span className="ms-3 text-muted">Loading teams&hellip;</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span>Failed to load teams: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-heading">🏆 Teams</h2>

      {teams.length === 0 ? (
        <div className="alert alert-info">No teams found.</div>
      ) : (
        <>
          {/* Summary table */}
          <div className="card octofit-card shadow-sm mb-4">
            <div className="card-header">
              Teams &mdash; {teams.length} team{teams.length !== 1 ? 's' : ''}
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 octofit-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Team Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr key={team._id || index}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{team.name}</td>
                        <td className="text-muted">{team.description}</td>
                        <td>
                          <span className="badge bg-primary">{team.members_count} members</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Detail cards */}
          <div className="row g-3">
            {teams.map((team, index) => (
              <div className="col-sm-6 col-lg-4" key={team._id || index}>
                <div className="card octofit-card h-100">
                  <div className="card-header">🏆 {team.name}</div>
                  <div className="card-body">
                    <p className="card-text">{team.description}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">{team.members_count} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Teams;

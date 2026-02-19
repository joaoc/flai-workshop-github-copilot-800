import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities: Fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Activities: Fetched data:', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 octofit-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading activities&hellip;</span>
        </div>
        <span className="ms-3 text-muted">Loading activities&hellip;</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span>Failed to load activities: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-heading">🏃 Activities</h2>

      {activities.length === 0 ? (
        <div className="alert alert-info">No activities found.</div>
      ) : (
        <div className="card octofit-card shadow-sm">
          <div className="card-header">
            Activities &mdash; {activities.length} record{activities.length !== 1 ? 's' : ''}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">User Email</th>
                    <th scope="col">Activity Type</th>
                    <th scope="col">Duration (min)</th>
                    <th scope="col">Calories Burned</th>
                    <th scope="col">Date</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={activity._id || index}>
                      <td>{index + 1}</td>
                      <td>{activity.user_email}</td>
                      <td>
                        <span className="badge bg-primary">{activity.activity_type}</span>
                      </td>
                      <td>{activity.duration}</td>
                      <td>{activity.calories_burned}</td>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td className="text-muted">{activity.notes || '—'}</td>
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

export default Activities;

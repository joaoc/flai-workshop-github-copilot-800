import React, { useState, useEffect } from 'react';

const DIFFICULTY_CLASS = {
  beginner:     'badge-beginner',
  intermediate: 'badge-intermediate',
  advanced:     'badge-advanced',
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // for detail modal

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: Fetching from REST API endpoint:', apiUrl);
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: Fetched data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 octofit-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading workouts&hellip;</span>
        </div>
        <span className="ms-3 text-muted">Loading workouts&hellip;</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span>Failed to load workouts: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-heading">💪 Workouts</h2>

      {workouts.length === 0 ? (
        <div className="alert alert-info">No workouts found.</div>
      ) : (
        <>
          {/* Summary table */}
          <div className="card octofit-card shadow-sm mb-4">
            <div className="card-header">
              Workout Plans &mdash; {workouts.length} plan{workouts.length !== 1 ? 's' : ''}
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 octofit-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Type</th>
                      <th scope="col">Difficulty</th>
                      <th scope="col">Duration (min)</th>
                      <th scope="col">Est. Calories</th>
                      <th scope="col">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map((workout, index) => (
                      <tr key={workout._id || index}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{workout.name}</td>
                        <td><span className="badge bg-primary">{workout.activity_type}</span></td>
                        <td>
                          <span className={`badge text-white ${DIFFICULTY_CLASS[workout.difficulty?.toLowerCase()] || 'bg-secondary'}`}>
                            {workout.difficulty}
                          </span>
                        </td>
                        <td>{workout.duration}</td>
                        <td>{workout.calories_estimate}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelected(workout)}
                          >
                            View
                          </button>
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
            {workouts.map((workout, index) => (
              <div className="col-sm-6 col-xl-4" key={workout._id || index}>
                <div className="card octofit-card h-100">
                  <div className="card-header">💪 {workout.name}</div>
                  <div className="card-body">
                    <p className="card-text text-muted">{workout.description}</p>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Type</span>
                        <span className="badge bg-primary">{workout.activity_type}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Difficulty</span>
                        <span className={`badge text-white ${DIFFICULTY_CLASS[workout.difficulty?.toLowerCase()] || 'bg-secondary'}`}>
                          {workout.difficulty}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Duration</span>
                        <strong>{workout.duration} min</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Est. Calories</span>
                        <strong>{workout.calories_estimate}</strong>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn btn-sm btn-outline-success w-100"
                      onClick={() => setSelected(workout)}
                    >
                      View Instructions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions modal */}
          {selected && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
              onClick={() => setSelected(null)}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header" style={{ backgroundColor: 'var(--octofit-dark)', color: '#fff' }}>
                    <h5 className="modal-title">💪 {selected.name}</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      aria-label="Close"
                      onClick={() => setSelected(null)}
                    />
                  </div>
                  <div className="modal-body">
                    <p className="text-muted">{selected.description}</p>
                    <hr />
                    <h6 className="fw-bold">Instructions</h6>
                    <p>{selected.instructions}</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelected(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Workouts;

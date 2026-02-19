import React, { useState, useEffect, useCallback } from 'react';

const EMPTY_FORM = { name: '', email: '', team: '' };

function Users() {
  const [users, setUsers]             = useState([]);
  const [teams, setTeams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [editUser, setEditUser]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  const teamsUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  const loadUsers = useCallback(() => {
    console.log('Users: Fetching from REST API endpoint:', apiUrl);
    return fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Users: Fetched data:', data);
        setUsers(Array.isArray(data) ? data : data.results || []);
      });
  }, [apiUrl]);

  useEffect(() => {
    console.log('Teams (for dropdown): Fetching from REST API endpoint:', teamsUrl);
    Promise.all([
      loadUsers(),
      fetch(teamsUrl)
        .then((r) => r.json())
        .then((d) => {
          console.log('Teams (for dropdown): Fetched data:', d);
          setTeams(Array.isArray(d) ? d : d.results || []);
        }),
    ])
      .catch((err) => {
        console.error('Users: Error fetching data:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [loadUsers, teamsUrl]);

  /* ── helpers ── */
  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, team: user.team });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const closeModal = () => {
    setEditUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const url = `${apiUrl}${editUser._id}/`;
    console.log('Users: PATCH', url, form);

    fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Save failed: HTTP ${res.status}`);
        return res.json();
      })
      .then((updated) => {
        console.log('Users: Updated user:', updated);
        setUsers((prev) =>
          prev.map((u) => (u._id === editUser._id ? { ...u, ...updated } : u))
        );
        setSaveSuccess(true);
        setTimeout(closeModal, 800);
      })
      .catch((err) => {
        console.error('Users: Save error:', err);
        setSaveError(err.message);
      })
      .finally(() => setSaving(false));
  };

  /* ── render ── */
  if (loading) {
    return (
      <div className="container mt-4 octofit-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading users&hellip;</span>
        </div>
        <span className="ms-3 text-muted">Loading users&hellip;</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <span className="me-2">⚠️</span>
          <span>Failed to load users: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-heading">👤 Users</h2>

      {users.length === 0 ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <div className="card octofit-card shadow-sm">
          <div className="card-header">
            Members &mdash; {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0 octofit-table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Team</th>
                    <th scope="col">Joined</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{user.name}</td>
                      <td>
                        <a href={`mailto:${user.email}`} className="text-decoration-none">
                          {user.email}
                        </a>
                      </td>
                      <td>
                        <span className="badge bg-secondary">{user.team}</span>
                      </td>
                      <td className="text-muted">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit User Modal ── */}
      {editUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ backgroundColor: 'var(--octofit-dark)', color: '#fff' }}
              >
                <h5 className="modal-title">✏️ Edit User</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={closeModal}
                />
              </div>

              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger py-2">{saveError}</div>
                  )}
                  {saveSuccess && (
                    <div className="alert alert-success py-2">✅ Saved successfully!</div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label fw-semibold">
                      Name
                    </label>
                    <input
                      id="edit-name"
                      name="name"
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="edit-team" className="form-label fw-semibold">
                      Team
                    </label>
                    {teams.length > 0 ? (
                      <select
                        id="edit-team"
                        name="team"
                        className="form-select"
                        value={form.team}
                        onChange={handleChange}
                        required
                      >
                        <option value="">&mdash; select a team &mdash;</option>
                        {teams.map((t) => (
                          <option key={t._id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="edit-team"
                        name="team"
                        type="text"
                        className="form-control"
                        value={form.team}
                        onChange={handleChange}
                        placeholder="Team name"
                      />
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

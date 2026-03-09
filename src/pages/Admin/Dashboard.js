import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'jobs') fetchJobs();
    else if (activeTab === 'applications') fetchApplications();
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}/status`, { isActive: !currentStatus });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: 'bg-info',
      recruiter: 'bg-success',
      admin: 'bg-warning'
    };
    return badges[role] || 'bg-secondary';
  };

  const getStatusBadge = (status) => {
    const badges = {
      applied: 'bg-primary',
      shortlisted: 'bg-warning',
      rejected: 'bg-danger',
      hired: 'bg-success'
    };
    return badges[status] || 'bg-secondary';
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Welcome, {user?.name} (Admin)</h2>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                Users ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobs')}
              >
                Jobs ({jobs.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                Applications ({applications.length})
              </button>
            </li>
          </ul>

          {activeTab === 'users' && (
            <div>
              <h4>User Management</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${getRoleBadge(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${user.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div>
              <h4>Job Postings</h4>
              {jobs.map(job => (
                <div key={job._id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {job.company.profile?.company || job.company.name} • {job.location} • {job.type}
                    </h6>
                    <p className="card-text">{job.description}</p>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Salary:</strong> {job.salary || 'Not specified'}
                      </div>
                      <div className="col-md-6">
                        <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'applications' && (
            <div>
              <h4>Applications</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Job</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td>{app.student.name}</td>
                        <td>{app.job.title}</td>
                        <td>{app.job.company.profile?.company || app.job.company.name}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
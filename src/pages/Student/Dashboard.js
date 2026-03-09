import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      setError('Failed to fetch jobs');
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      await api.post(`/applications/${jobId}`);
      alert('Application submitted successfully!');
      fetchMyApplications();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const isApplied = (jobId) => {
    return applications.some(app => app.job._id === jobId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Welcome, {user?.name} (Student)</h2>
            <button className="btn btn-danger" onClick={logout}>Logout</button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <h4>Available Jobs & Internships</h4>
              {jobs.length === 0 ? (
                <p>No jobs available at the moment.</p>
              ) : (
                jobs.map(job => (
                  <div key={job._id} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{job.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {job.company.profile?.company || job.company.name} • {job.location}
                      </h6>
                      <p className="card-text">{job.description}</p>
                      <div className="row">
                        <div className="col-md-6">
                          <strong>Type:</strong> {job.type}
                        </div>
                        <div className="col-md-6">
                          <strong>Salary:</strong> {job.salary || 'Not specified'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong>Requirements:</strong> {job.requirements}
                      </div>
                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-2">
                          <strong>Skills:</strong> {job.skills.join(', ')}
                        </div>
                      )}
                      <div className="mt-3">
                        {isApplied(job._id) ? (
                          <button className="btn btn-success" disabled>Already Applied</button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => applyForJob(job._id)}
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="col-md-4">
              <h4>My Applications</h4>
              {applications.length === 0 ? (
                <p>You haven't applied to any jobs yet.</p>
              ) : (
                applications.map(app => (
                  <div key={app._id} className="card mb-2">
                    <div className="card-body">
                      <h6 className="card-title">{app.job.title}</h6>
                      <p className="card-text small">
                        {app.job.company.profile?.company || app.job.company.name}
                      </p>
                      <span className={`badge ${
                        app.status === 'applied' ? 'bg-primary' :
                        app.status === 'shortlisted' ? 'bg-warning' :
                        app.status === 'rejected' ? 'bg-danger' : 'bg-success'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
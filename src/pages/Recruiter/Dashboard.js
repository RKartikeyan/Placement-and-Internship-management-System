import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    type: 'internship',
    location: '',
    salary: '',
    requirements: '',
    skills: '',
    applicationDeadline: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs/my');
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch jobs');
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId) => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      alert('Failed to fetch applications');
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      // Refresh applications
      if (selectedJob) {
        fetchJobApplications(selectedJob);
      }
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const handleJobFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const submitJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...jobForm,
        skills: jobForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      await api.post('/jobs', jobData);
      alert('Job posted successfully!');
      setJobForm({
        title: '',
        description: '',
        type: 'internship',
        location: '',
        salary: '',
        requirements: '',
        skills: '',
        applicationDeadline: ''
      });
      setShowJobForm(false);
      fetchMyJobs();
    } catch (err) {
      alert('Failed to post job');
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        alert('Job deleted successfully!');
        fetchMyJobs();
      } catch (err) {
        alert('Failed to delete job');
      }
    }
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
            <h2>Welcome, {user?.name} (Recruiter)</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={() => setShowJobForm(!showJobForm)}>
                {showJobForm ? 'Cancel' : 'Post New Job'}
              </button>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {showJobForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>Post New Job/Internship</h5>
              </div>
              <div className="card-body">
                <form onSubmit={submitJob}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={jobForm.title}
                        onChange={handleJobFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-control"
                        name="type"
                        value={jobForm.type}
                        onChange={handleJobFormChange}
                      >
                        <option value="internship">Internship</option>
                        <option value="job">Full-time Job</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={jobForm.location}
                        onChange={handleJobFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Salary (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="salary"
                        value={jobForm.salary}
                        onChange={handleJobFormChange}
                        placeholder="e.g., ₹5000/month or ₹5 LPA"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Requirements</label>
                    <textarea
                      className="form-control"
                      name="requirements"
                      value={jobForm.requirements}
                      onChange={handleJobFormChange}
                      rows="2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="skills"
                      value={jobForm.skills}
                      onChange={handleJobFormChange}
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Application Deadline (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      name="applicationDeadline"
                      value={jobForm.applicationDeadline}
                      onChange={handleJobFormChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Post Job</button>
                </form>
              </div>
            </div>
          )}

          <h4>My Job Postings</h4>
          {jobs.length === 0 ? (
            <p>You haven't posted any jobs yet.</p>
          ) : (
            jobs.map(job => (
              <div key={job._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title">{job.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {job.location} • {job.type}
                      </h6>
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-info btn-sm me-2"
                        onClick={() => fetchJobApplications(job._id)}
                      >
                        View Applicants
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="card-text">{job.description}</p>
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Salary:</strong> {job.salary || 'Not specified'}
                    </div>
                    <div className="col-md-6">
                      <strong>Deadline:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'No deadline'}
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
                </div>
              </div>
            ))
          )}

          {applications.length > 0 && (
            <div className="mt-4">
              <h4>Applicants for Selected Job</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>College</th>
                      <th>Skills</th>
                      <th>ATS Score</th>
                      <th>Resume</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app._id}>
                        <td>{app.student.name}</td>
                        <td>{app.student.email}</td>
                        <td>{app.student.profile?.college || 'N/A'}</td>
                        <td>{app.student.profile?.skills ? app.student.profile.skills.join(', ') : 'N/A'}</td>
                        <td>
                          <span className={`badge ${
                            app.atsScore >= 70 ? 'bg-success' :
                            app.atsScore >= 50 ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {app.atsScore}%
                          </span>
                        </td>
                        <td>
                          {app.student.resume ? (
                            <a
                              href={`http://localhost:5000/uploads/${app.student.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </a>
                          ) : (
                            'No resume'
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            app.status === 'applied' ? 'bg-secondary' :
                            app.status === 'shortlisted' ? 'bg-warning' :
                            app.status === 'rejected' ? 'bg-danger' : 'bg-success'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-success"
                              onClick={() => updateApplicationStatus(app._id, 'shortlisted')}
                              disabled={app.status === 'shortlisted'}
                            >
                              Shortlist
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => updateApplicationStatus(app._id, 'rejected')}
                              disabled={app.status === 'rejected'}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => updateApplicationStatus(app._id, 'hired')}
                              disabled={app.status === 'hired'}
                            >
                              Hire
                            </button>
                          </div>
                        </td>
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

export default RecruiterDashboard;
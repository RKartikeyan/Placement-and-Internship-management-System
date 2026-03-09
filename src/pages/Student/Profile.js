import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    profile: {
      phone: '',
      college: '',
      skills: [],
      experience: ''
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfile(prev => ({
      ...prev,
      profile: { ...prev.profile, skills }
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.put('/users/profile', profile);
      alert('Profile updated successfully!');
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile');
    }
    setUpdating(false);
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert('Please select a resume file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      await api.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume uploaded successfully!');
      fetchProfile();
      setResumeFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload resume');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading profile...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => navigate('/student/dashboard')}
              title="Back to Dashboard"
            >
              ← Back
            </button>
            <h3>Update Profile</h3>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={updateProfile}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="profile.phone"
                value={profile.profile.phone || ''}
                onChange={handleInputChange}
              />
            </div>

            {user.role === 'student' && (
              <>
                <div className="mb-3">
                  <label className="form-label">College</label>
                  <input
                    type="text"
                    className="form-control"
                    name="profile.college"
                    value={profile.profile.college || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.profile.skills ? profile.profile.skills.join(', ') : ''}
                    onChange={handleSkillsChange}
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Experience</label>
                  <textarea
                    className="form-control"
                    name="profile.experience"
                    value={profile.profile.experience || ''}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your work experience..."
                  />
                </div>
              </>
            )}

            {user.role === 'recruiter' && (
              <div className="mb-3">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="profile.company"
                  value={profile.profile.company || ''}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {user.role === 'student' && (
          <div className="col-md-4">
            <h4>Resume Upload</h4>
            {profile.resume && (
              <div className="mb-3">
                <p><strong>Current Resume:</strong></p>
                <a
                  href={`http://localhost:5000/uploads/${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  View Resume
                </a>
              </div>
            )}

            <form onSubmit={uploadResume}>
              <div className="mb-3">
                <label className="form-label">Upload New Resume (PDF only)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={!resumeFile}>
                Upload Resume
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
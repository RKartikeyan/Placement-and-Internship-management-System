import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Profile.css';

const ProfileAdvanced = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profile: {
      phone: '',
      headline: '',
      bio: '',
      college: '',
      skills: [],
      workExperience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: []
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

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
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...prev.profile.skills, newSkill.trim()]
        }
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills.filter((_, i) => i !== index)
      }
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          languages: [...prev.profile.languages, newLanguage.trim()]
        }
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        languages: prev.profile.languages.filter((_, i) => i !== index)
      }
    }));
  };

  const addWorkExperience = () => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        workExperience: [
          ...prev.profile.workExperience,
          { company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }
        ]
      }
    }));
  };

  const updateWorkExperience = (index, field, value) => {
    const newExperience = [...profile.profile.workExperience];
    newExperience[index][field] = value;
    setProfile(prev => ({
      ...prev,
      profile: { ...prev.profile, workExperience: newExperience }
    }));
  };

  const removeWorkExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        workExperience: prev.profile.workExperience.filter((_, i) => i !== index)
      }
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: [
          ...prev.profile.education,
          { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', currentlyStudying: false, description: '' }
        ]
      }
    }));
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...profile.profile.education];
    newEducation[index][field] = value;
    setProfile(prev => ({
      ...prev,
      profile: { ...prev.profile, education: newEducation }
    }));
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        education: prev.profile.education.filter((_, i) => i !== index)
      }
    }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        projects: [
          ...prev.profile.projects,
          { title: '', description: '', technologies: [], link: '', date: '' }
        ]
      }
    }));
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...profile.profile.projects];
    newProjects[index][field] = value;
    setProfile(prev => ({
      ...prev,
      profile: { ...prev.profile, projects: newProjects }
    }));
  };

  const removeProject = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        projects: prev.profile.projects.filter((_, i) => i !== index)
      }
    }));
  };

  const addCertification = () => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        certifications: [
          ...prev.profile.certifications,
          { name: '', issuer: '', date: '', link: '' }
        ]
      }
    }));
  };

  const updateCertification = (index, field, value) => {
    const newCerts = [...profile.profile.certifications];
    newCerts[index][field] = value;
    setProfile(prev => ({
      ...prev,
      profile: { ...prev.profile, certifications: newCerts }
    }));
  };

  const removeCertification = (index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        certifications: prev.profile.certifications.filter((_, i) => i !== index)
      }
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
    <div className="profile-container">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/student/dashboard')}>
        ← Back to Dashboard
      </button>

      <form onSubmit={updateProfile}>
        {/* Header Section */}
        <div className="profile-header card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control form-control-lg fw-bold mb-2"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  name="profile.headline"
                  value={profile.profile.headline || ''}
                  onChange={handleInputChange}
                  placeholder="Your professional headline (e.g., Full Stack Developer at XYZ)"
                />
                <textarea
                  className="form-control"
                  name="profile.bio"
                  value={profile.profile.bio || ''}
                  onChange={handleInputChange}
                  placeholder="Write a professional summary about yourself..."
                  rows="2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">📧 Contact Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={profile.email} disabled />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="profile.phone"
                  value={profile.profile.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🎓 Education</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addEducation}
              >
                + Add Education
              </button>
            </div>
          </div>
          <div className="card-body">
            {profile.profile.education && profile.profile.education.length > 0 ? (
              profile.profile.education.map((edu, index) => (
                <div key={index} className="education-item mb-3 p-3 border rounded">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="School/University"
                        value={edu.school || ''}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Degree"
                        value={edu.degree || ''}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Field of Study"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="Start"
                        value={edu.startDate || ''}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="End"
                        value={edu.endDate || ''}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        disabled={edu.currentlyStudying}
                      />
                    </div>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`studying-${index}`}
                      checked={edu.currentlyStudying || false}
                      onChange={(e) => updateEducation(index, 'currentlyStudying', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`studying-${index}`}>
                      Currently studying here
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeEducation(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">No education added yet</p>
            )}
          </div>
        </div>

        {/* Work Experience */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">💼 Work Experience</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addWorkExperience}
              >
                + Add Experience
              </button>
            </div>
          </div>
          <div className="card-body">
            {profile.profile.workExperience && profile.profile.workExperience.length > 0 ? (
              profile.profile.workExperience.map((work, index) => (
                <div key={index} className="work-item mb-3 p-3 border rounded">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Company"
                        value={work.company || ''}
                        onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Position"
                        value={work.position || ''}
                        onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-3">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="Start"
                        value={work.startDate || ''}
                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="End"
                        value={work.endDate || ''}
                        onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                        disabled={work.currentlyWorking}
                      />
                    </div>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`working-${index}`}
                      checked={work.currentlyWorking || false}
                      onChange={(e) => updateWorkExperience(index, 'currentlyWorking', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor={`working-${index}`}>
                      I currently work here
                    </label>
                  </div>
                  <textarea
                    className="form-control mb-2"
                    placeholder="Describe your role and responsibilities..."
                    value={work.description || ''}
                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                    rows="2"
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeWorkExperience(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">No work experience added yet</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">🎯 Skills</h5>
          </div>
          <div className="card-body">
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add a skill (e.g., JavaScript, Python, React)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={addSkill}
              >
                Add
              </button>
            </div>
            <div className="skill-tags">
              {profile.profile.skills && profile.profile.skills.length > 0 ? (
                profile.profile.skills.map((skill, index) => (
                  <span key={index} className="badge bg-info me-2 mb-2" style={{ padding: '0.5rem' }}>
                    {skill}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => removeSkill(index)}
                      style={{ padding: '0' }}
                    />
                  </span>
                ))
              ) : (
                <p className="text-muted">No skills added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">🌍 Languages</h5>
          </div>
          <div className="card-body">
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add a language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={addLanguage}
              >
                Add
              </button>
            </div>
            <div>
              {profile.profile.languages && profile.profile.languages.length > 0 ? (
                profile.profile.languages.map((lang, index) => (
                  <span key={index} className="badge bg-secondary me-2 mb-2" style={{ padding: '0.5rem' }}>
                    {lang}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => removeLanguage(index)}
                      style={{ padding: '0' }}
                    />
                  </span>
                ))
              ) : (
                <p className="text-muted">No languages added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚀 Projects</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addProject}
              >
                + Add Project
              </button>
            </div>
          </div>
          <div className="card-body">
            {profile.profile.projects && profile.profile.projects.length > 0 ? (
              profile.profile.projects.map((proj, index) => (
                <div key={index} className="project-item mb-3 p-3 border rounded">
                  <div className="row mb-2">
                    <div className="col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Project Title"
                        value={proj.title || ''}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="Date"
                        value={proj.date || ''}
                        onChange={(e) => updateProject(index, 'date', e.target.value)}
                      />
                    </div>
                  </div>
                  <textarea
                    className="form-control mb-2"
                    placeholder="Project description"
                    value={proj.description || ''}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    rows="2"
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Technologies used (comma-separated)"
                    value={proj.technologies ? proj.technologies.join(', ') : ''}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                  />
                  <input
                    type="url"
                    className="form-control mb-2"
                    placeholder="Project Link"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">No projects added yet</p>
            )}
          </div>
        </div>

        {/* Certifications */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📜 Certifications</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addCertification}
              >
                + Add Certification
              </button>
            </div>
          </div>
          <div className="card-body">
            {profile.profile.certifications && profile.profile.certifications.length > 0 ? (
              profile.profile.certifications.map((cert, index) => (
                <div key={index} className="cert-item mb-3 p-3 border rounded">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Certification Name"
                        value={cert.name || ''}
                        onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Issuer"
                        value={cert.issuer || ''}
                        onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="month"
                        className="form-control"
                        placeholder="Date Issued"
                        value={cert.date || ''}
                        onChange={(e) => updateCertification(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Certificate Link"
                        value={cert.link || ''}
                        onChange={(e) => updateCertification(index, 'link', e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeCertification(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">No certifications added yet</p>
            )}
          </div>
        </div>

        {/* Resume Upload */}
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">📄 Resume File</h5>
          </div>
          <div className="card-body">
            {profile.resume && (
              <div className="mb-3">
                <p><strong>Current Resume:</strong> {profile.resume}</p>
                <a
                  href={`http://localhost:5000/uploads/${profile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm me-2"
                >
                  View Resume
                </a>
              </div>
            )}
            <form onSubmit={uploadResume}>
              <div className="mb-3">
                <label className="form-label">Upload PDF Resume</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                Upload Resume
              </button>
            </form>
          </div>
        </div>

        {/* Save Button */}
        <div className="d-grid">
          <button type="submit" className="btn btn-success btn-lg" disabled={updating}>
            {updating ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileAdvanced;

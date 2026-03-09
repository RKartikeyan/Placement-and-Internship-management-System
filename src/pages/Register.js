import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { ...formData, role: 'student' });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect to student dashboard since only students can register
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-gradient-primary text-white text-center py-4">
                <i className="bi bi-person-plus display-4 mb-2"></i>
                <h3 className="mb-0 fw-bold">Join PIMS</h3>
                <p className="mb-0 opacity-75">Create your student account</p>
              </div>
              <div className="card-body p-4">
                {error && <div className="alert alert-danger rounded-3">{error}</div>}
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person me-2"></i>Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      name="name"
                      value={name}
                      onChange={onChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-3"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-3"
                      name="password"
                      value={password}
                      onChange={onChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 fw-semibold">
                    <i className="bi bi-person-plus me-2"></i>Register as Student
                  </button>
                </form>
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/" className="text-decoration-none fw-semibold">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
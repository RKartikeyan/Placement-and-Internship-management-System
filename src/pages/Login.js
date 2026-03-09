import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect based on role
      switch (res.data.user.role) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Login to PIMS</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <p className="mt-3 text-center">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
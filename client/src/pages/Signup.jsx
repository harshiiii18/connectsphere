import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

 return (
    <div className="auth-wrapper">
      <div className="auth-brand-panel">
        <h1>ConnectSphere</h1>
        <p>Real-time conversations, wherever you are. Text, voice, video — one connection away.</p>
        <div className="status-line">
          <span className="presence-dot"></span> Live and connected
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2>Create your account</h2>
          {error && <p className="auth-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="auth-button" type="submit">Sign Up</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
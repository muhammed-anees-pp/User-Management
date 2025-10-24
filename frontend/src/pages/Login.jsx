import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from "../store/authslice";
import { toast } from 'react-toastify';
import './Login.css';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    dispatch(loginUser(formData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Login successful!');
        if (res.payload.is_admin) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      }
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
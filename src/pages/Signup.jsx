import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    const result = await signup(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh',
      padding: '4rem 0'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <UserPlus size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Join the Community</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Create an account to register for events</p>
        </div>

        {error && (
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              name="name"
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              name="email"
              placeholder="College Email" 
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              required
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Confirm Password" 
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1rem' }}>
            Sign Up <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from 'react';
import { Search, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <section className="hero-section" style={{ 
      position: 'relative', 
      padding: '8rem 0 6rem',
      overflow: 'hidden'
    }}>
      {/* Background Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '40%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: -1
      }} />

      <div className="container animate-fade-in" style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: '800', 
          lineHeight: '1.1', 
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Explore Events,<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #9333ea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Engage Campus Life
          </span>
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-muted)', 
          maxWidth: '600px', 
          margin: '0 auto 3rem',
          lineHeight: '1.6'
        }}>
          Discover the latest workshops, festivals, and activities happening at your college. Your next memorable experience is just a click away.
        </p>

        <form onSubmit={handleSearch} className="glass" style={{ 
          maxWidth: '700px', 
          margin: '0 auto', 
          display: 'flex', 
          padding: '0.5rem', 
          borderRadius: '1.25rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRight: '1px solid var(--glass-border)' }}>
            <Search size={22} color="var(--text-muted)" style={{ marginRight: '1rem' }} />
            <input 
              type="text" 
              placeholder="Search for tech, culture, or sports..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text)', 
                width: '100%', 
                outline: 'none',
                fontSize: '1rem' 
              }} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
            Explore Now
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> 50+ Scheduled Events
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} /> 10+ Campus Venues
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

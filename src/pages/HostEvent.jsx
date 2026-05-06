import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, Calendar, MapPin, Clock, 
  Tag, Image as ImageIcon, FileText, 
  Users, CheckCircle, ArrowRight, Sparkles 
} from 'lucide-react';

const CATEGORY_IMAGES = {
  Technical: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80', // Coding
  Cultural: 'https://images.unsplash.com/photo-1514525253344-f81bad00a9d4?w=1200&q=80', // Festival
  Sports: 'https://images.unsplash.com/photo-1461896756984-33b006cc737e?w=1200&q=80', // Sports
  Workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80', // Lecture
  Gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80', // Gaming
  Other: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80' // Event
};

const HostEvent = () => {
  const { hostEvent, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    organizer: user?.name || '',
    date: '',
    time: '',
    location: '',
    price: 0,
    category: 'Technical',
    description: '',
    maxCapacity: 100,
    image: CATEGORY_IMAGES.Technical
  });

  // Smart Image Selection
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      image: CATEGORY_IMAGES[formData.category] || CATEGORY_IMAGES.Other
    }));
  }, [formData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await hostEvent(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <div className="glass-card animate-scale-in" style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem' }}>
          <div style={{ width: '80px', height: '80px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'white' }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Event Hosted!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your event "{formData.title}" is now live and ready for registrations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="host-event-page container animate-fade-in" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Host an <span className="gradient-text">Event</span> <Rocket size={32} color="var(--primary)" />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Create memorable experiences for your campus community.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
        
        {/* Left Side: Form */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Event Title</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Cool Tech Workshop..."
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Category</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none', appearance: 'none' }}
                  >
                    {Object.keys(CATEGORY_IMAGES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Organizer Name</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    value={formData.organizer}
                    onChange={e => setFormData({...formData, organizer: e.target.value})}
                    required
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="May 20, 2026"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    required
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Time</label>
                <div style={{ position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="10:00 AM"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    required
                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Venue Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Main Seminar Hall..."
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Event Description</label>
              <div style={{ position: 'relative' }}>
                <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '1.25rem', color: 'var(--text-muted)' }} />
                <textarea 
                  placeholder="Tell us more about the event..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none', minHeight: '120px' }} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Capacity</label>
                <input 
                  type="number" 
                  value={formData.maxCapacity}
                  onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontSize: '1.1rem', fontWeight: '700' }}
            >
              {loading ? 'Publishing...' : 'Publish Event'} <ArrowRight size={18} />
            </button>

          </form>
        </div>

        {/* Right Side: Professional Preview */}
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600' }}>
            <Sparkles size={18} /> Live Professional Preview
          </div>
          
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
            <div style={{ position: 'relative', height: '250px' }}>
              <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'white', backdropFilter: 'blur(5px)' }}>
                {formData.category}
              </div>
            </div>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>{formData.title || 'Your Event Title'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {formData.date || 'Date'} • {formData.time || 'Time'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {formData.location || 'Location'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={16} /> Hosted by {formData.organizer || 'Organizer'}</div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{formData.price}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Capacity: {formData.maxCapacity}</div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <strong>💡 Pro Tip:</strong> Events with clear locations and descriptive details get 40% more registrations. Our AI has automatically selected a professional cover image for your <strong>{formData.category}</strong> event!
          </div>
        </div>

      </div>
    </div>
  );
};

export default HostEvent;

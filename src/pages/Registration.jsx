import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, Phone, Ticket, ArrowRight, ArrowLeft } from 'lucide-react';

const Registration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, registerForEvent } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    phone: '',
    seats: 1
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${id}`);
        setEvent(res.data);
        setTotal(res.data.price);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      setTotal(event.price * formData.seats);
    }
  }, [formData.seats, event]);

  if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Loading...</h2></div>;
  if (!event) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Event not found</h2></div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const registrationPayload = {
      ...formData,
      eventId: event.id,
      eventTitle: event.title,
      total,
      eventImage: event.image,
      eventDate: event.date,
      eventLocation: event.location
    };

    if (total === 0) {
      // Free Registration - Skip Payment
      setIsSubmitting(true);
      try {
        const res = await registerForEvent(registrationPayload);
        if (res && res.success) {
          const ticketData = {
            ...registrationPayload,
            id: res.registrationId
          };
          sessionStorage.setItem('last_registration', JSON.stringify(ticketData));
          navigate('/success');
        } else {
          alert('Registration failed. Please try again.');
        }
      } catch (err) {
        console.error('Free registration error:', err);
        alert('Error connecting to server.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Paid Registration - Go to Payment
      sessionStorage.setItem('pending_registration', JSON.stringify(registrationPayload));
      navigate('/payment');
    }
  };

  return (
    <div className="registration-page container animate-fade-in" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
        
        {/* Left Side: Summary */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Registration Summary</h2>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: '1rem' }}>
            <img src={event.image} alt={event.title} style={{ width: '100px', height: '100px', borderRadius: '0.75rem', objectFit: 'cover' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{event.title}</h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {event.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.location}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Ticket Price</span>
              <span>₹{event.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quantity</span>
              <span>x {formData.seats}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '800', marginTop: '1rem', color: 'var(--primary)' }}>
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Candidate Details</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Student Name</label>
              <div style={{ position: 'relative' }}>
                <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={formData.studentName}
                  onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Number of Seats</label>
              <div style={{ position: 'relative' }}>
                <Ticket size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  min="1"
                  max="10"
                  value={formData.seats}
                  onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value) || 1})}
                  required
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="btn btn-outline" 
                style={{ flex: 1, padding: '1rem' }}
              >
                <ArrowLeft size={18} /> Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2, padding: '1rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : (total === 0 ? 'Register Now' : 'Proceed to Payment')} <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Registration;

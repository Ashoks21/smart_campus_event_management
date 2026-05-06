import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Calendar, MapPin, Ticket, ArrowRight, User } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('last_registration');
    console.log('Success Page - Ticket Data:', data);
    if (!data) {
      console.warn('No ticket data found in sessionStorage, redirecting...');
      navigate('/events');
    } else {
      try {
        setTicket(JSON.parse(data));
      } catch (e) {
        console.error('Error parsing ticket data:', e);
        navigate('/events');
      }
    }
  }, [navigate]);

  if (!ticket) return <div style={{ padding: '5rem', textAlign: 'center' }}><h2>Processing Ticket...</h2></div>;

  const displayId = ticket.id ? ticket.id.toString().slice(-6) : 'PENDING';

  return (
    <div className="success-page container animate-fade-in" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: '#10b981', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.5rem', 
          color: 'white',
          boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)'
        }}>
          <CheckCircle size={40} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Registration Successful!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your ticket has been confirmed. See you at the event!</p>
      </div>

      {/* Ticket UI */}
      <div className="glass-card" style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: 0, 
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
          padding: '2rem', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Event Ticket</h2>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: '600' }}>
              #{displayId}
            </div>
          </div>
          {/* Decorative Circle */}
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        </div>

        <div style={{ padding: '2.5rem', textAlign: 'left', position: 'relative' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem' }}>{ticket.eventTitle}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Attendee</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <User size={16} color="var(--primary)" /> {ticket.studentName}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Seats</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <Ticket size={16} color="var(--primary)" /> {ticket.seats} Person(s)
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Date & Time</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <Calendar size={16} color="var(--primary)" /> {ticket.eventDate}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Venue</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <MapPin size={16} color="var(--primary)" /> {ticket.eventLocation}
              </div>
            </div>
          </div>

          <div style={{ 
            borderTop: '2px dashed var(--glass-border)', 
            paddingTop: '2rem', 
            display: 'flex', 
            justifyContent: 'center' 
          }}>
            {/* Mock QR Code */}
            <div style={{ 
              width: '120px', 
              height: '120px', 
              background: 'white', 
              padding: '10px', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,255,255,0.1)'
            }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'url(https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-' + (ticket.id || 'na') + ') no-repeat center',
                backgroundSize: 'contain'
              }} />
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            Please present this QR code at the venue entrance.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem' }}>
          <Download size={18} /> Download
        </button>
        <button className="btn btn-outline" style={{ padding: '0.8rem 1.5rem' }}>
          <Share2 size={18} /> Share
        </button>
        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Success;

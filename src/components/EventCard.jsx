import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
  return (
    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={event.image} 
          alt={event.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="card-img"
        />
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem', 
          background: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(5px)',
          padding: '0.4rem 0.8rem', 
          borderRadius: '2rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {event.price === 0 ? 'FREE' : `₹${event.price}`}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {event.category}
          </span>
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>{event.title}</h3>
        
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {event.date}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {event.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> {event.organizer}
          </div>
        </div>
        
        <div style={{ marginTop: 'auto' }}>
          <Link to={`/event/${event.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
            View Details <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      
      <style>{`
        .glass-card:hover .card-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default EventCard;

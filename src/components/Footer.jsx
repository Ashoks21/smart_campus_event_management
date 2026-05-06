import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass" style={{ marginTop: '4rem', padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem', 
          marginBottom: '3rem' 
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>CampusEvents</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              The ultimate platform for campus life. Discover, participate, and manage college events seamlessly.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <li><a href="/" className="hover-link">Home</a></li>
              <li><a href="/events" className="hover-link">Browse Events</a></li>
              <li><a href="/dashboard" className="hover-link">My Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MapPin size={18} /> Main Campus, University Road</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Phone size={18} /> +91 98765 43210</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Mail size={18} /> events@campus.edu</li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex' }}><Globe size={20} /></a>
              <a href="#" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex' }}><Globe size={20} /></a>
              <a href="#" className="btn-outline" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex' }}><Globe size={20} /></a>
            </div>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid var(--glass-border)', 
          paddingTop: '2rem', 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          © 2026 Smart Campus Event Management. All rights reserved.
        </div>
      </div>
      <style>{`
        .hover-link:hover {
          color: var(--primary);
          padding-left: 5px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

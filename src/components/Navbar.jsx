import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Home, LogIn, Bell, CheckCircle2, ShieldCheck, Rocket } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const mockNotifications = [
    { id: 1, text: "Hackathon starting in 2 days!", time: "2h ago", type: "alert" },
    { id: 2, text: "Cultural Night tickets are now available.", time: "5h ago", type: "info" },
    { id: 3, text: "Your registration for Tech Fest was successful.", time: "1d ago", type: "success" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky-nav" style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000, 
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CampusEvents
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <Home size={18} /> Home
          </Link>
          <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <Calendar size={18} /> Events
          </Link>

          <Link to="/host" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--primary)' }}>
            <Rocket size={18} /> Host Event
          </Link>
          
          {user?.role === 'Admin' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', color: 'var(--secondary)' }}>
              <ShieldCheck size={18} /> Admin
            </Link>
          )}
          
          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />

          {user ? (
            <>
              <div 
                ref={notificationRef}
                style={{ position: 'relative' }}
              >
                <div 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ position: 'relative', cursor: 'pointer', color: showNotifications ? 'var(--primary)' : 'var(--text-muted)' }}
                >
                  <Bell size={20} />
                  <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', border: '2px solid var(--background)' }}></span>
                </div>

                {showNotifications && (
                  <div className="glass" style={{ 
                    position: 'absolute', 
                    top: '40px', 
                    right: '0', 
                    width: '320px', 
                    borderRadius: '1rem', 
                    padding: '1rem', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    border: '1px solid var(--glass-border)',
                    zIndex: 1001,
                    animation: 'fadeIn 0.2s ease forwards'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '700' }}>Notifications</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>Mark all as read</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {mockNotifications.map(notification => (
                        <div key={notification.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{notification.text}</p>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    background: user.role === 'Admin' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)', 
                    color: user.role === 'Admin' ? 'var(--secondary)' : 'var(--primary)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                  }}>
                    {user.role}
                  </span>
                </div>
                <div style={{ width: '35px', height: '35px', background: 'var(--surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                  <User size={18} />
                </div>
              </Link>
              
              <button onClick={handleLogout} style={{ color: '#f87171' }}>
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
              <LogIn size={18} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

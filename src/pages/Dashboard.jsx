import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, MapPin, Ticket, LogOut, ArrowRight, BookOpen, ShieldCheck, Mail, Database, Rocket } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, registrations: userRegistrations, userEvents } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [showTicket, setShowTicket] = useState(null);

  const TicketModal = ({ registration }) => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center', position: 'relative' }}>
        <button onClick={() => setShowTicket(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
        <div style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.2em' }}>OFFICIAL EVENT TICKET</div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{registration.title || registration.eventTitle}</h2>
        <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{registration.date || registration.eventDate}</div>
        
        <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET-${registration.id}-${user.id}`} alt="QR Code" style={{ width: '150px', height: '150px' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', fontSize: '0.85rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>STUDENT</div>
            <div style={{ fontWeight: '600' }}>{user.name}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>SEATS</div>
            <div style={{ fontWeight: '600' }}>{registration.seats} Ticket(s)</div>
          </div>
        </div>
        <div style={{ marginTop: '2rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          ID: {registration.id} | SCAN AT ENTRANCE
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page container animate-fade-in" style={{ padding: '3rem 0' }}>
      {showTicket && <TicketModal registration={showTicket} />}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '3rem' }}>
        
        {/* Sidebar Profile */}
        <aside>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem', 
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.email}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('personal')}
                className={`btn ${activeTab === 'personal' ? 'btn-primary' : 'btn-outline'}`} 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <Ticket size={18} /> My Tickets
              </button>

              <button 
                onClick={() => setActiveTab('hosted')}
                className={`btn ${activeTab === 'hosted' ? 'btn-primary' : 'btn-outline'}`} 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <Rocket size={18} /> My Hosts
              </button>
              
              <Link to="/host" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                <Rocket size={18} /> Host New Event
              </Link>

              {isAdmin && (
                <Link 
                  to="/admin"
                  className="btn btn-outline" 
                  style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                >
                  <ShieldCheck size={18} /> Admin Panel
                </Link>
              )}

              <Link to="/events" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                <Calendar size={18} /> Browse Events
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', color: '#f87171' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>User Stats</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                  {userRegistrations.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tickets</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                  {userEvents.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hosts</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          {activeTab === 'personal' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My Registrations</h1>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Total: {userRegistrations.length} events
                </div>
              </div>

              {userRegistrations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {userRegistrations.map(reg => (
                    <div key={reg.id} className="glass-card" style={{ display: 'flex', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                      <img src={reg.image || reg.eventImage} alt={reg.title || reg.eventTitle} style={{ width: '180px', height: '140px', objectFit: 'cover' }} />
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{reg.title || reg.eventTitle}</h3>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {reg.date || reg.eventDate}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {reg.location || reg.eventLocation}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                            <Ticket size={18} /> {reg.seats} Ticket(s)
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button 
                              onClick={() => setShowTicket(reg)}
                              className="btn btn-primary" 
                              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            >
                              <Ticket size={14} /> View Ticket
                            </button>
                            <Link to={`/event/${reg.eventId}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                              View Details <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass" style={{ padding: '5rem', textAlign: 'center', borderRadius: '1.5rem' }}>
                  <BookOpen size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No registrations yet!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't registered for any events yet. Check out the latest events happening on campus.</p>
                  <Link to="/events" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                    Explore Events
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>My Hosted Events</h1>
                <Link to="/host" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  <Rocket size={18} /> Host New
                </Link>
              </div>

              {userEvents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  {userEvents.map(event => (
                    <div key={event.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: '160px' }}>
                        <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ 
                          position: 'absolute', 
                          top: '1rem', 
                          right: '1rem', 
                          background: event.status === 'Approved' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(245, 158, 11, 0.9)', 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.7rem', 
                          fontWeight: '700',
                          color: 'white',
                          backdropFilter: 'blur(5px)'
                        }}>
                          {event.status}
                        </div>
                      </div>
                      <div style={{ padding: '1.5rem', flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>{event.title}</h3>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {event.date}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {event.location}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{event.price}</div>
                          <Link to={`/event/${event.id}`} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                            View Event <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass" style={{ padding: '5rem', textAlign: 'center', borderRadius: '1.5rem' }}>
                  <Rocket size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>You haven't hosted any events!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ready to organize something amazing for your fellow students?</p>
                  <Link to="/host" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                    Start Hosting
                  </Link>
                </div>
              )}
            </>
          )}
        </main>

      </div>
      <style>{`
        .table-row-hover:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
};
export default Dashboard;

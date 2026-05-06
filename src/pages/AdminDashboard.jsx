import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, MapPin, Ticket, LogOut, ArrowRight, BookOpen, ShieldCheck, Mail, Database, Edit, Trash2, Plus, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [allRegistrations, setAllRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [adminEvents, setAdminEvents] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('registrations'); // registrations, events, or reviews
  const [loading, setLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '', organizer: '', date: '', time: '', location: '', price: 0, image: '', description: '', category: 'Technical', maxCapacity: 100
  });
  
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    } else {
      fetchAllRegistrations();
      fetchAdminEvents();
      fetchAllReviews();
    }
  }, [isAdmin]);

  useEffect(() => {
    setFilteredRegistrations(allRegistrations);
  }, [allRegistrations]);

  const fetchAllRegistrations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/registrations/user/all`, {
        headers: { Authorization: `Bearer ${token}` }
      }); 
      setAllRegistrations(res.data);
    } catch (err) {
      console.error('Error fetching all registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      setAdminEvents(res.data);
    } catch (err) {
      console.error('Error fetching admin events:', err);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/reviews/all/manage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditClick = (event) => {
    setNewEvent({
      title: event.title,
      organizer: event.organizer,
      date: event.date,
      time: event.time,
      location: event.location,
      price: event.price,
      image: event.image,
      description: event.description,
      category: event.category,
      maxCapacity: event.maxCapacity
    });
    setEditEventId(event.id);
    setShowAddEvent(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editEventId) {
        await axios.put(`${API_URL}/events/${editEventId}`, newEvent, config);
        alert('Event updated successfully!');
      } else {
        await axios.post(`${API_URL}/events`, newEvent, config);
        alert('Event added successfully!');
      }
      setShowAddEvent(false);
      setEditEventId(null);
      setNewEvent({ title: '', organizer: '', date: '', time: '', location: '', price: 0, image: '', description: '', category: 'Technical', maxCapacity: 100 });
      fetchAdminEvents();
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAllReviews();
        alert('Review deleted!');
      } catch (err) {
        console.error('Error deleting review:', err);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAdminEvents();
        alert('Event deleted!');
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const exportToCSV = () => {
    const data = activeTab === 'registrations' ? allRegistrations : adminEvents;
    const filename = `${activeTab}_report.csv`;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (activeTab === 'registrations') {
      csvContent += "Registration ID,User ID,Email,Event,Seats,Price,Date\n";
      data.forEach(r => {
        csvContent += `${r.id},${r.userId},${r.email},"${r.title}",${r.seats},${r.totalPrice},${new Date(r.timestamp).toLocaleDateString()}\n`;
      });
    } else {
      csvContent += "Event ID,Title,Organizer,Date,Time,Location,Price,Capacity\n";
      data.forEach(e => {
        csvContent += `${e.id},"${e.title}",${e.organizer},${e.date},${e.time},"${e.location}",${e.price},${e.maxCapacity}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const analytics = {
    totalRevenue: allRegistrations.reduce((acc, r) => acc + (parseFloat(r.totalPrice) || 0), 0),
    totalSeats: allRegistrations.reduce((acc, r) => acc + (parseInt(r.seats) || 0), 0),
    popularEvent: (() => {
      const counts = allRegistrations.reduce((acc, r) => {
        const title = r.title;
        acc[title] = (acc[title] || 0) + (parseInt(r.seats) || 0);
        return acc;
      }, {});
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    })()
  };

  if (!isAdmin) return null;

  return (
    <div className="dashboard-page container animate-fade-in" style={{ padding: '3rem 0' }}>
      {showAddEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{editEventId ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Event Title" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              <input type="text" placeholder="Organizer" required value={newEvent.organizer} onChange={e => setNewEvent({...newEvent, organizer: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder="Date (e.g. May 20, 2026)" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
                <input type="text" placeholder="Time (e.g. 10 AM - 2 PM)" required value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              </div>
              <input type="text" placeholder="Location" required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="number" placeholder="Price" required value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
                <input type="number" placeholder="Max Capacity" required value={newEvent.maxCapacity} onChange={e => setNewEvent({...newEvent, maxCapacity: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              </div>
              <input type="text" placeholder="Image URL" value={newEvent.image} onChange={e => setNewEvent({...newEvent, image: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white' }} />
              <textarea placeholder="Description" required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="form-input" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.5rem', color: 'white', minHeight: '100px' }} />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Event</button>
                <button type="button" onClick={() => { setShowAddEvent(false); setEditEventId(null); setNewEvent({ title: '', organizer: '', date: '', time: '', location: '', price: 0, image: '', description: '', category: 'Technical', maxCapacity: 100 }); }} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
              {user?.name?.charAt(0) || 'A'}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>Admin: {user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.email}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/dashboard" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                <User size={18} /> My Personal Dashboard
              </Link>
              <button 
                className="btn btn-primary" 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <ShieldCheck size={18} /> Admin Panel
              </button>
              <button onClick={handleLogout} className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem', color: '#f87171' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Database size={32} color="var(--secondary)" /> Admin Dashboard
                </h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => setActiveTab('registrations')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeTab === 'registrations' ? 'var(--primary)' : 'var(--text-muted)', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      borderBottom: activeTab === 'registrations' ? '2px solid var(--primary)' : 'none',
                      paddingBottom: '0.25rem'
                    }}
                  >
                    Registrations
                  </button>
                  <button 
                    onClick={() => setActiveTab('events')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeTab === 'events' ? 'var(--primary)' : 'var(--text-muted)', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      borderBottom: activeTab === 'events' ? '2px solid var(--primary)' : 'none',
                      paddingBottom: '0.25rem'
                    }}
                  >
                    Manage Events
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      borderBottom: activeTab === 'reviews' ? '2px solid var(--primary)' : 'none',
                      paddingBottom: '0.25rem'
                    }}
                  >
                    Reviews
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={exportToCSV}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  <Download size={16} /> Export CSV
                </button>
                <button 
                  onClick={() => setShowAddEvent(true)}
                  className="btn btn-primary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Event
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>TOTAL REVENUE</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>₹{analytics.totalRevenue}</div>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>SEATS BOOKED</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--secondary)' }}>{analytics.totalSeats}</div>
              </div>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>TOP EVENT</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{analytics.popularEvent}</div>
              </div>
            </div>

            {/* Visual Analytics */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color="var(--primary)" /> Registrations by Event
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(() => {
                  const eventCounts = allRegistrations.reduce((acc, r) => {
                    const title = r.title;
                    acc[title] = (acc[title] || 0) + (parseInt(r.seats) || 0);
                    return acc;
                  }, {});
                  
                  const maxCount = Math.max(...Object.values(eventCounts), 1);
                  
                  return Object.entries(eventCounts).map(([title, count]) => (
                    <div key={title}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '600' }}>{title}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count} Seats</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${(count / maxCount) * 100}%`, 
                          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                          borderRadius: '4px',
                          transition: 'width 1s ease-out'
                        }} />
                      </div>
                    </div>
                  ));
                })()}
                {allRegistrations.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No registration data available for visualization.
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'registrations' ? (
              <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1.5rem' }}>Student Details</th>
                      <th style={{ padding: '1.5rem' }}>Event</th>
                      <th style={{ padding: '1.5rem' }}>Seats</th>
                      <th style={{ padding: '1.5rem' }}>Amount</th>
                      <th style={{ padding: '1.5rem' }}>Date Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRegistrations.length > 0 ? (
                      allRegistrations.map(reg => (
                        <tr key={reg.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                          <td style={{ padding: '1.5rem' }}>
                            <div style={{ fontWeight: '600' }}>User ID: {reg.userId}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Mail size={10} /> {reg.email || 'N/A'}
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem' }}>{reg.title}</td>
                          <td style={{ padding: '1.5rem' }}>{reg.seats}</td>
                          <td style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: '700' }}>₹{reg.totalPrice}</td>
                          <td style={{ padding: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {new Date(reg.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          {loading ? 'Loading...' : 'No system-wide registrations found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : activeTab === 'events' ? (
              <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1.5rem' }}>Event Title</th>
                      <th style={{ padding: '1.5rem' }}>Organizer</th>
                      <th style={{ padding: '1.5rem' }}>Date</th>
                      <th style={{ padding: '1.5rem' }}>Price</th>
                      <th style={{ padding: '1.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminEvents.map(event => (
                      <tr key={event.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1.5rem', fontWeight: '600' }}>{event.title}</td>
                        <td style={{ padding: '1.5rem' }}>{event.organizer}</td>
                        <td style={{ padding: '1.5rem' }}>{event.date}</td>
                        <td style={{ padding: '1.5rem' }}>₹{event.price}</td>
                        <td style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                          <button 
                            onClick={() => handleEditClick(event)}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass-card" style={{ overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                      <th style={{ padding: '1.5rem' }}>User</th>
                      <th style={{ padding: '1.5rem' }}>Event</th>
                      <th style={{ padding: '1.5rem' }}>Rating</th>
                      <th style={{ padding: '1.5rem' }}>Comment</th>
                      <th style={{ padding: '1.5rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReviews.map(review => (
                      <tr key={review.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ fontWeight: '600' }}>{review.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {review.userId}</div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>{review.eventTitle}</td>
                        <td style={{ padding: '1.5rem', color: '#fbbf24', fontWeight: '700' }}>{review.rating} ★</td>
                        <td style={{ padding: '1.5rem', fontSize: '0.85rem', maxWidth: '300px' }}>{review.comment}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {allReviews.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No reviews found in the system.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

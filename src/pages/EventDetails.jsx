import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Info, CheckCircle, ArrowLeft, Star } from 'lucide-react';

import API_URL from '../config';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';

const EventDetails = () => {
  const { id } = useParams();
  const { user, getEventRegistrationsCount, getEventReviews, submitReview, registrations } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [regCount, setRegCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, reviewsRes, countRes] = await Promise.all([
          axios.get(`${API_URL}/events/${id}`),
          getEventReviews(id),
          getEventRegistrationsCount(id)
        ]);
        setEvent(eventRes.data);
        setReviews(reviewsRes);
        setRegCount(countRes);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isRegistered = registrations.some(r => parseInt(r.eventId) === parseInt(id));

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}><h2>Loading event...</h2></div>;
  }

  if (!event) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Event not found!</h2>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '2rem' }}>Back to Events</Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    await submitReview({
      eventId: parseInt(id),
      rating: reviewRating,
      comment: reviewComment
    });
    setReviewComment('');
    setShowReviewForm(false);
    // Refresh reviews
    const updatedReviews = await getEventReviews(id);
    setReviews(updatedReviews);
  };

  const capacityPercent = Math.min(100, Math.floor((regCount / event.maxCapacity) * 100));
  const seatsLeft = event.maxCapacity - regCount;

  // Since experience might be stored as JSON or string, handle it
  const experienceItems = Array.isArray(event.experience) ? event.experience : 
                          (typeof event.experience === 'string' ? JSON.parse(event.experience) : []);

  return (
    <div className="event-details-page container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <Link to="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        <ArrowLeft size={18} /> Back to Events
      </Link>

      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ height: '450px', position: 'relative' }}>
          <img 
            src={event.image} 
            alt={event.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)', 
            padding: '3rem 2rem 1.5rem' 
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.4rem 1rem', 
                borderRadius: '2rem', 
                fontSize: '0.85rem', 
                fontWeight: '600'
              }}>
                {event.category}
              </span>
              <span style={{ 
                background: seatsLeft < 10 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
                color: seatsLeft < 10 ? '#f87171' : '#10b981', 
                padding: '0.4rem 1rem', 
                borderRadius: '2rem', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                border: seatsLeft < 10 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                {seatsLeft < 10 ? `⚠️ Only ${seatsLeft} seats left!` : `🔥 Registration Open`}
              </span>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0' }}>{event.title}</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} /> {event.date} • {event.time}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={20} /> {event.location}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={20} /> {event.organizer}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', padding: '3rem', borderTop: '1px solid var(--glass-border)' }}>
          <div>
            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Info size={24} color="var(--primary)" /> About the Event
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {event.description}
              </p>
            </section>
            
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '3rem', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '600' }}>Registration Capacity</span>
                <span style={{ color: seatsLeft < 10 ? 'var(--secondary)' : 'var(--primary)' }}>{regCount} / {event.maxCapacity} Filled</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'var(--surface)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${capacityPercent}%`, 
                  height: '100%', 
                  background: seatsLeft < 10 ? 'linear-gradient(right, #f43f5e, #ec4899)' : 'linear-gradient(right, var(--primary), var(--secondary))',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                {seatsLeft > 0 ? `Join the ${regCount} students who already registered!` : 'Sold Out! Keep an eye out for future slots.'}
              </p>
            </div>

            <section style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Star size={24} color="var(--accent)" /> Student Reviews
                </h3>
                {isRegistered && !showReviewForm && (
                  <button onClick={() => setShowReviewForm(true)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Leave a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
                    <select 
                      value={reviewRating} 
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      style={{ background: 'var(--surface)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.5rem', borderRadius: '0.5rem', width: '100%' }}
                    >
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Terrible</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Comment</label>
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience or expectations..."
                      style={{ background: 'var(--surface)', color: 'white', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '0.5rem', width: '100%', minHeight: '100px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Post Review</button>
                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>Cancel</button>
                  </div>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} style={{ padding: '1.5rem', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600' }}>{review.userName}</span>
                        <div style={{ color: 'var(--accent)', display: 'flex', gap: '0.1rem' }}>
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{review.comment}</p>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', display: 'block' }}>
                        {new Date(review.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
                    No reviews yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle size={24} color="var(--primary)" /> What you will experience
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {experienceItems.length > 0 ? experienceItems.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'start', 
                    gap: '0.75rem', 
                    padding: '1.25rem', 
                    background: 'var(--surface)', 
                    borderRadius: '1rem',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <CheckCircle size={18} color="var(--primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem' }}>{item}</span>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)' }}>Experience details coming soon.</p>
                )}
              </div>
            </section>
          </div>

          <aside>
            <div className="glass" style={{ 
              padding: '2rem', 
              borderRadius: '1.5rem', 
              position: 'sticky', 
              top: '100px',
              border: '1px solid var(--primary)',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)'
            }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>ENTRY FEE</h4>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                {formatPrice(event.price)}
              </div>
              
              <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Open for Registration</span>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location</span>
                  <span>{event.location}</span>
                </li>
              </ul>

              <Link to={`/register/${event.id}`} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>
                Register Now
              </Link>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Limited seats available!
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

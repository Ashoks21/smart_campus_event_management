import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { registerForEvent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regData, setRegData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem('pending_registration');
    if (!data) {
      navigate('/events');
    } else {
      setRegData(JSON.parse(data));
    }
  }, [navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate payment processing
    setTimeout(async () => {
      // Mock success logic
      const success = true; 
      
      if (success) {
        try {
          const res = await registerForEvent(regData);
          if (res && res.success) {
            const ticketData = {
              ...regData,
              id: res.registrationId
            };
            sessionStorage.setItem('last_registration', JSON.stringify(ticketData));
            sessionStorage.removeItem('pending_registration');
            setLoading(false);
            navigate('/success');
          } else {
            throw new Error('Registration failed');
          }
        } catch (err) {
          setLoading(false);
          setError('Failed to complete registration in database.');
        }
      } else {
        setLoading(false);
        setError('Payment Failed. Please check your credentials and try again.');
      }
    }, 2000);
  };

  if (!regData) return null;

  return (
    <div className="payment-page container animate-fade-in" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh',
      padding: '4rem 0'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <CreditCard size={30} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Secure Payment</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Complete your registration for {regData.eventTitle}</p>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center', border: '1px dashed var(--primary)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Amount to Pay</span>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>₹{regData.total}</div>
        </div>

        {error && (
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444', marginBottom: '1.5rem', color: '#f87171', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Card Number</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="XXXX XXXX XXXX XXXX" 
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expiry Date</label>
              <input 
                type="text" 
                placeholder="MM/YY" 
                required
                style={{ width: '100%', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CVV</label>
              <input 
                type="password" 
                placeholder="XXX" 
                required
                maxLength="3"
                style={{ width: '100%', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '0.75rem', color: 'white', outline: 'none' }} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.25rem', marginTop: '1rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" /> Processing...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Pay & Confirm <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', color: '#10b981', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} /> SSL Encrypted & Secure
        </div>
      </div>
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Payment;

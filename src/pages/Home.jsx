import React from 'react';
import Hero from '../components/Hero';
import FeaturedEvents from '../components/FeaturedEvents';
import { Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedEvents />

      <section className="glass" style={{ margin: '4rem 0', padding: '6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Why Join Campus Events?</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '3rem',
            marginTop: '4rem' 
          }}>
            <div>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <Sparkles size={30} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Networking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Meet like-minded peers and industry professionals to grow your network.</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--secondary)' }}>
                <Sparkles size={30} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Skill Building</h3>
              <p style={{ color: 'var(--text-muted)' }}>Learn new skills through workshops, seminars, and hands-on competitions.</p>
            </div>
            <div>
              <div style={{ width: '60px', height: '60px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent)' }}>
                <Sparkles size={30} />
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Memories</h3>
              <p style={{ color: 'var(--text-muted)' }}>Create lifelong campus memories and celebrate student life to the fullest.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

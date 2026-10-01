import React from 'react';
import { Tag, ShieldCheck, Heart } from 'lucide-react';
import { PLATFORMS } from '../data/mockProducts.js';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(11, 15, 25, 0.95)',
      padding: '48px 24px 24px 24px',
      marginTop: '64px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Tag color="#fff" size={18} />
              </div>
              <span className="gradient-cyan-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Comprize</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Comprize automatically compares online product prices across major e-commerce platforms so you always get the absolute lowest deal.
            </p>
          </div>

          {/* Supported Stores */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tracked Online Stores
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PLATFORMS.map(p => (
                <span key={p.id} className="store-tag" style={{ fontSize: '0.78rem' }}>
                  <span style={{ color: p.color }}>●</span> {p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Smart Comparison Features
            </h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>✔ Real-time Multi-Platform Web Scan</li>
              <li>✔ Cheapest Store Recommendation</li>
              <li>✔ Direct Store Link Redirects</li>
              <li>✔ Price History Graphs & Drop Alerts</li>
              <li>✔ Side-by-Side Spec Comparison</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} Comprize Price Engine. All product links take you directly to official seller sites.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for smart shoppers
          </div>
        </div>
      </div>
    </footer>
  );
}

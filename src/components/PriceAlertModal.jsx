import React, { useState } from 'react';
import { Bell, X, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/priceEngine.js';

export default function PriceAlertModal({ product, onClose, currency }) {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState(
    product ? Math.round(product.platformPrices[0].price * 0.9) : 50000
  );
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        background: '#111827',
        border: '1px solid var(--accent-primary)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell color="#818cf8" size={20} /> Set Price Drop Alert
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 color="#10b981" size={48} style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Alert Active!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              We will email <strong>{email}</strong> immediately when <strong>{product.name}</strong> drops below {formatCurrency(targetPrice, currency)}.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Get notified across Amazon, Flipkart & Croma when the price drops!
            </p>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Your Target Price ({currency})
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  marginTop: '6px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  marginTop: '6px'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '8px' }}>
              Notify Me On Price Drop
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

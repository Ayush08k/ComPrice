import React from 'react';
import { X, ExternalLink, Check, Scale, ShieldCheck } from 'lucide-react';
import { getCheapestPlatformDetails, formatCurrency } from '../utils/priceEngine.js';

export default function ProductCompareModal({ compareList, onClose, onRemove, currency }) {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0d1322',
        border: '1px solid var(--accent-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale color="#818cf8" size={24} /> Side-by-Side Product & Price Comparison
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Comparing specifications and lowest available online market prices.
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Comparison Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `180px repeat(${compareList.length}, 1fr)`,
          gap: '16px',
          overflowX: 'auto'
        }}>
          {/* Row Headers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '220px', fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div>Lowest Price</div>
            <div>Cheapest Platform</div>
            <div>Rating</div>
            <div>Specifications</div>
          </div>

          {/* Product Columns */}
          {compareList.map(product => {
            const cheapest = getCheapestPlatformDetails(product);

            return (
              <div
                key={product.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => onRemove(product.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={14} />
                </button>

                {/* Product Header */}
                <div style={{ textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={product.image} alt={product.name} style={{ maxHeight: '110px', objectFit: 'contain', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{product.name}</h4>
                </div>

                {/* Lowest Price Row */}
                <div style={{ height: '50px', display: 'flex', alignItems: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  {formatCurrency(cheapest?.price, currency)}
                </div>

                {/* Cheapest Platform Row */}
                <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
                  <a
                    href={cheapest?.directLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm"
                    style={{ textDecoration: 'none', width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Buy on {cheapest?.platform?.name}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* Rating */}
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', fontWeight: 600, color: '#f59e0b', fontSize: '0.9rem' }}>
                  ⭐ {product.rating} ({product.reviewsCount} reviews)
                </div>

                {/* Specs */}
                <div style={{ paddingTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', pb: '4px' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-subtle)', display: 'block' }}>{k}:</span>
                      <span style={{ color: '#fff', fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

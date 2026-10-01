import React from 'react';
import { ExternalLink, Tag, ShieldAlert, CheckCircle2, TrendingDown, ArrowRight, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/priceEngine.js';

export default function CheapestDealBanner({ cheapestDetails, productName, currency }) {
  if (!cheapestDetails) return null;

  const { platform, price, originalPrice, discountPercent, savingsAmount, coupon, directLink, inStock } = cheapestDetails;

  return (
    <div className="glass-card pulse-cheapest" style={{
      maxWidth: '1200px',
      margin: '24px auto',
      padding: '28px',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Left Column: Recommendation Header */}
        <div>
          <div className="badge badge-cheapest" style={{ marginBottom: '12px' }}>
            <Zap size={14} /> CHEAPEST PLATFORM RECOMMENDED BY COMPRICE
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px', color: '#fff' }}>
            Buy on <span style={{ color: platform.color }}>{platform.name}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '16px' }}>
            ComPrice verified that {platform.name} currently offers the lowest price for <strong>{productName}</strong>.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: inStock ? '#10b981' : '#ef4444',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={16} /> {inStock ? 'In Stock & Verified' : 'Limited Stock'}
            </span>
            <span style={{ color: 'var(--text-subtle)' }}>•</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              ⚡ {platform.delivery}
            </span>
          </div>
        </div>

        {/* Middle Column: Price & Savings Calculation */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
            Best Price Available
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>
              {formatCurrency(price, currency)}
            </span>
            <span style={{ textDecoration: 'line-through', color: 'var(--text-subtle)', fontSize: '1.1rem' }}>
              {formatCurrency(originalPrice, currency)}
            </span>
            <span className="badge badge-discount" style={{ fontSize: '0.85rem' }}>
              {discountPercent}% OFF
            </span>
          </div>

          {savingsAmount > 0 && (
            <div style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#34d399',
              fontSize: '0.9rem',
              fontWeight: 700
            }}>
              <TrendingDown size={16} />
              You Save {formatCurrency(savingsAmount, currency)} compared to highest seller!
            </div>
          )}

          {coupon && (
            <div style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px dashed #06b6d4',
              padding: '6px 12px',
              borderRadius: '6px',
              color: '#67e8f9'
            }}>
              <Tag size={14} />
              <span>Coupon Offer: <strong>{coupon}</strong></span>
            </div>
          )}
        </div>

        {/* Right Column: Direct Store Redirect Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-lg"
            style={{ width: '100%', textDecoration: 'none', justifyContent: 'space-between' }}
          >
            <span>Buy on {platform.name}</span>
            <ExternalLink size={20} />
          </a>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
            Direct official product page redirect. Opens in new tab.
          </p>
        </div>
      </div>
    </div>
  );
}

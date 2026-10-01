import React from 'react';
import { Tag, ShieldCheck, Scale, Zap, Sparkles } from 'lucide-react';

export default function Navbar({ compareCount, onOpenCompare, currency, onToggleCurrency }) {
  return (
    <header className="navbar-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 25, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.45)',
            transform: 'rotate(-4deg)'
          }}>
            <Tag color="#ffffff" size={22} style={{ transform: 'rotate(4deg)' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '-0.03em' }}>
              <span className="gradient-cyan-text">Comprize</span>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #06b6d4', borderRadius: '4px', color: '#22d3ee', fontWeight: 700 }}>PRO</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Smart Price Comparison Engine</p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Currency Toggle */}
          <button 
            onClick={onToggleCurrency}
            className="btn btn-secondary btn-sm"
            title="Toggle Currency (INR / USD)"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{currency}</span>
          </button>

          {/* Compare Drawer Toggle */}
          <button 
            onClick={onOpenCompare}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative' }}
          >
            <Scale size={16} />
            <span>Compare</span>
            {compareCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#06b6d4',
                color: '#fff',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)'
              }}>
                {compareCount}
              </span>
            )}
          </button>

          {/* Guarantee Badge */}
          <div className="store-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.8rem' }}>Cheapest Price Guarantee</span>
          </div>
        </div>
      </div>
    </header>
  );
}

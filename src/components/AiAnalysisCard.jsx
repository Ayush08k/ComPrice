import React from 'react';
import { Bot, Sparkles, Zap, HelpCircle } from 'lucide-react';
import { getCheapestPlatformDetails, formatCurrency } from '../utils/priceEngine.js';

export default function AiAnalysisCard({ product, currency, onOpenGuide }) {
  if (!product || !product.platformPrices || product.platformPrices.length === 0) return null;

  const cheapest = getCheapestPlatformDetails(product);
  const aiSummary = product.aiSummary; // From live backend Gemini API

  // Derive metrics from live data
  const prices = product.platformPrices.map(p => p.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const maxSavings = maxPrice - minPrice;

  // Use AI summary from backend, or derive from prices
  const verdict = aiSummary?.verdict || (cheapest?.discountPercent > 10 ? 'BUY NOW' : 'COMPARE PRICES');
  const verdictColor = aiSummary?.verdictColor || (cheapest?.discountPercent > 10 ? '#10b981' : '#f59e0b');
  const dealScore = aiSummary?.dealScore || (cheapest?.discountPercent > 15 ? 8.5 : cheapest?.discountPercent > 5 ? 7.0 : 5.5);
  const summaryText = aiSummary?.summary || (
    cheapest
      ? `${cheapest.platform.name} offers the best price at ${formatCurrency(cheapest.price, currency)}, saving you ${formatCurrency(maxSavings, currency)} compared to the highest-priced platform.`
      : 'Compare prices across platforms to find the best deal.'
  );
  const isGeminiPowered = aiSummary?.aiPowered === true;

  return (
    <div className="glass-card" style={{
      maxWidth: '1200px',
      margin: '24px auto',
      padding: '24px',
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(17, 24, 39, 0.95) 100%)',
      borderColor: 'rgba(6, 182, 212, 0.4)',
      boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '14px'
      }}>
        {/* Left: AI Robot Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)'
          }}>
            <Bot color="#ffffff" size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                ComPrice AI Live Analysis & Comparison
              </h3>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', border: '1px solid #06b6d4', fontSize: '0.7rem' }}>
                <Sparkles size={12} /> {isGeminiPowered ? 'GEMINI AI' : 'AI VERDICT'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Analyzed {product.platformPrices.length} live platform prices
              {isGeminiPowered ? ' with Google Gemini AI.' : ' with rule-based analysis.'}
            </p>
          </div>
        </div>

        {/* Right: How to Train AI Developer Link */}
        <button
          onClick={onOpenGuide}
          className="btn btn-secondary btn-sm"
          style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#38bdf8' }}
        >
          <HelpCircle size={15} />
          <span>How to Build & Train This AI</span>
        </button>
      </div>

      {/* AI Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px'
      }}>
        {/* Metric 1: Deal Score */}
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
            AI Deal Score
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
            {dealScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-subtle)' }}>/ 10</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
            ✓ Based on live scraped prices
          </div>
        </div>

        {/* Metric 2: Buy Signal */}
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
            Buy Timing Signal
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: verdictColor, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={18} fill={verdictColor} /> {verdict}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {cheapest?.discountPercent > 10
              ? `${cheapest.discountPercent}% off MRP — significant discount detected`
              : 'Monitor for upcoming sale events'}
          </div>
        </div>

        {/* Metric 3: Max Savings */}
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
            Max Savings Available
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {formatCurrency(aiSummary?.maxSavings ?? maxSavings, currency)}
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            vs. highest platform price
          </div>
        </div>
      </div>

      {/* AI Summary Text */}
      <div style={{
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Sparkles color="#22d3ee" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.95rem', color: '#e0f2fe', lineHeight: 1.5 }}>
          <strong>{isGeminiPowered ? '🤖 Gemini AI says:' : '📊 AI Shopping Summary:'}</strong> {summaryText}
        </div>
      </div>
    </div>
  );
}

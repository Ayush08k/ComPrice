import React from 'react';
import { TrendingDown, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/priceEngine.js';

export default function PriceHistoryGraph({ priceHistory, currency }) {
  if (!priceHistory || priceHistory.length === 0) return null;

  const prices = priceHistory.map(h => h.avgPrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Canvas / SVG Dimensions
  const height = 180;
  const width = 600;
  const padding = 30;

  // Convert data points to SVG coordinates
  const points = priceHistory.map((item, idx) => {
    const x = padding + (idx / (priceHistory.length - 1)) * (width - 2 * padding);
    const normalizedY = (item.avgPrice - minPrice) / priceRange;
    const y = height - padding - normalizedY * (height - 2 * padding);
    return { x, y, price: item.avgPrice, month: item.month };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  const latestPrice = prices[prices.length - 1];
  const isLowest = latestPrice === minPrice;

  return (
    <div style={{ maxWidth: '1200px', margin: '32px auto 0 auto' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown color="#10b981" size={20} />
              Price Trend History (Last 6 Months)
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Track average market price movement over time.
            </p>
          </div>

          <div style={{
            background: isLowest ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${isLowest ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: isLowest ? '#10b981' : '#818cf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Calendar size={14} />
            {isLowest ? '🔥 Good Time To Buy - Current Price is All-Time Low!' : 'Moderate Price Level'}
          </div>
        </div>

        {/* SVG Graph */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            {/* Background Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4 4" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255, 255, 255, 0.08)" />

            {/* Area Fill Gradient */}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={areaD} fill="url(#priceGradient)" />
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data Points */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#10b981" stroke="#111827" strokeWidth="2" />
                <text x={pt.x} y={height - 8} fill="#9ca3af" fontSize="11" textAnchor="middle" fontWeight="500">
                  {pt.month}
                </text>
                <text x={pt.x} y={pt.y - 10} fill="#f9fafb" fontSize="11" textAnchor="middle" fontWeight="700">
                  {formatCurrency(pt.price, currency)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

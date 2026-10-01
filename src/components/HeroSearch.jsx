import React, { useState } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

export default function HeroSearch({ searchQuery, setSearchQuery, onSelectProduct, onSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  const POPULAR_TAGS = [
    'iPhone 15 Pro Max',
    'Galaxy S24 Ultra',
    'OnePlus 12',
    'Google Pixel 9 Pro',
    'MacBook Air M3',
    'Sony WH-1000XM5'
  ];

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (q && onSearch) onSearch(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 20px 32px 20px',
      maxWidth: '900px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div className="badge badge-category" style={{ marginBottom: '16px', padding: '6px 14px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
        <Sparkles size={14} /> Compare Live Prices & Find The Absolute Lowest Deal
      </div>

      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
        fontWeight: 800,
        lineHeight: 1.15,
        marginBottom: '16px'
      }}>
        Search Any Product or Mobile Name To <span className="gradient-cyan-text">Compare All Platforms</span>
      </h1>

      <p style={{
        fontSize: '1.1rem',
        color: 'var(--text-muted)',
        marginBottom: '32px',
        maxWidth: '650px',
        margin: '0 auto 32px auto'
      }}>
        Enter any phone or gadget model below. <strong>ComPrice</strong> instantly scans Amazon, Flipkart, Croma, Reliance Digital, Apple Store & Vijay Sales to find the cheapest offer.
      </p>

      {/* Search Input Box */}
      <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(17, 24, 39, 0.95)',
          border: isFocused ? '2px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 12px 8px 20px',
          boxShadow: isFocused ? '0 0 25px rgba(6, 182, 212, 0.25)' : 'var(--shadow-sm)',
          transition: 'all 0.25s ease'
        }}>
          <Search color={isFocused ? '#38bdf8' : '#9ca3af'} size={24} style={{ flexShrink: 0, marginRight: '12px' }} />
          
          <input
            type="text"
            placeholder="e.g. iPhone 15 Pro Max, Galaxy S24 Ultra, MacBook Air M3..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '6px',
                marginRight: '8px'
              }}
            >
              <X size={20} />
            </button>
          )}

          <button
            className="btn btn-primary btn-lg"
            onClick={handleSearch}
            style={{ borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' }}
          >
            Compare Prices
          </button>
        </div>

        {/* No autocomplete — results are fetched live from backend on search */}
      </div>

      {/* Popular Quick Search Pills */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUp size={14} /> Trending:
        </span>
        {POPULAR_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => {
              setSearchQuery(tag);
              if (onSearch) onSearch(tag);
            }}
            className="store-tag"
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.8rem',
              borderColor: searchQuery.toLowerCase() === tag.toLowerCase() ? '#06b6d4' : 'var(--border-color)'
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

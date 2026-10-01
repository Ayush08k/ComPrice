import React, { useState } from 'react';
import { Star, ArrowUpRight, Scale, Filter, SlidersHorizontal, Shield, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/mockProducts.js';
import { getCheapestPlatformDetails, formatCurrency } from '../utils/priceEngine.js';

export default function ProductCatalog({ onSelectProduct, onToggleCompare, compareList, currency }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('cheapest'); // 'cheapest', 'rating', 'discount'

  const categories = ['All', 'Smartphones', 'Laptops', 'Audio'];
  const brands = ['All', 'Apple', 'Samsung', 'OnePlus', 'Google', 'Sony'];

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    return matchCategory && matchBrand;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aCheapest = getCheapestPlatformDetails(a)?.price || 0;
    const bCheapest = getCheapestPlatformDetails(b)?.price || 0;

    if (sortBy === 'cheapest') return aCheapest - bCheapest;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') {
      const aDisc = getCheapestPlatformDetails(a)?.discountPercent || 0;
      const bDisc = getCheapestPlatformDetails(b)?.discountPercent || 0;
      return bDisc - aDisc;
    }
    return 0;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '48px auto 0 auto', padding: '0 20px' }}>
      {/* Header & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            Popular Products & Price Tracker Catalog
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Explore top smartphones, laptops & audio gear with live platform price rankings.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedCategory === cat ? 'var(--accent-primary)' : 'transparent',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#111827',
              color: '#fff',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="cheapest">Sort by: Lowest Price</option>
            <option value="discount">Sort by: Highest Discount %</option>
            <option value="rating">Sort by: Top Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {sortedProducts.map(product => {
          const cheapest = getCheapestPlatformDetails(product);
          const isComparing = compareList.some(item => item.id === product.id);

          return (
            <div
              key={product.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {/* Card Top: Badges */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge badge-category">{product.brand}</span>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" /> {product.rating} ({product.reviewsCount.toLocaleString()})
                  </span>
                </div>

                {/* Image & Product Title */}
                <div style={{ cursor: 'pointer', textAlign: 'center', marginBottom: '16px' }} onClick={() => onSelectProduct(product)}>
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#090d16', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#fff', textAlign: 'left', lineHeight: 1.35, minHeight: '44px' }}>
                    {product.name}
                  </h3>
                </div>

                {/* Specs Snippet */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: '8px' }}>
                  {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-subtle)' }}>{key}:</span>
                      <span style={{ fontWeight: 600, color: '#e5e7eb', textAlign: 'right', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Price & Actions */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-subtle)', display: 'block' }}>
                      Lowest on {cheapest?.platform?.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                        {formatCurrency(cheapest?.price, currency)}
                      </span>
                      <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-subtle)' }}>
                        {formatCurrency(cheapest?.originalPrice, currency)}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-cheapest">
                    -{cheapest?.discountPercent}% OFF
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <span>Compare All Stores</span>
                    <ArrowUpRight size={16} />
                  </button>

                  <button
                    onClick={() => onToggleCompare(product)}
                    className={`btn ${isComparing ? 'btn-success' : 'btn-secondary'} btn-sm`}
                    title="Add to Side-by-Side Comparison"
                  >
                    <Scale size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

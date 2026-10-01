import React, { useState } from 'react';
import { ExternalLink, Tag, Truck, ShieldCheck, CheckCircle2, XCircle, ArrowUpDown, RefreshCw, Edit3, Save } from 'lucide-react';
import { PLATFORMS } from '../data/mockProducts.js';
import { formatCurrency } from '../utils/priceEngine.js';

export default function PlatformPriceTable({ product, currency, onUpdatePrice }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  if (!product || !product.platformPrices) return null;

  // Sort prices from lowest to highest
  const sortedPlatformPrices = [...product.platformPrices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPlatformPrices[0]?.price;

  const handleRefreshPrices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleStartEdit = (item) => {
    setEditingPlatformId(item.platformId);
    setTempPrice(item.price.toString());
  };

  const handleSaveEdit = (platformId) => {
    const numPrice = Number(tempPrice);
    if (numPrice && numPrice > 0 && onUpdatePrice) {
      onUpdatePrice(product.id, platformId, numPrice);
    }
    setEditingPlatformId(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '32px auto 0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            All Platform Prices & Difference Breakdown
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Every platform charges a different price. Compare costs side-by-side for <strong>{product.name}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleRefreshPrices}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-md)' }}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Scanning Live Prices...' : 'Refresh Live Prices'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
            <ArrowUpDown size={14} /> Sorted by Lowest Price
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
            <thead>
              <tr style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                color: 'var(--text-subtle)',
                letterSpacing: '0.05em'
              }}>
                <th style={{ padding: '16px 20px' }}>Store Platform</th>
                <th style={{ padding: '16px 20px' }}>Platform Price</th>
                <th style={{ padding: '16px 20px' }}>Price vs Cheapest</th>
                <th style={{ padding: '16px 20px' }}>Bank Offers / Coupon</th>
                <th style={{ padding: '16px 20px' }}>Stock & Delivery</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Redirect Link</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlatformPrices.map((item, idx) => {
                const platform = PLATFORMS.find(p => p.id === item.platformId) || {
                  name: item.platformId.toUpperCase(),
                  color: '#818cf8',
                  delivery: 'Standard Delivery',
                  returnPolicy: 'Standard Warranty',
                  searchUrl: (q) => `https://google.com/search?q=${encodeURIComponent(q)}`
                };

                const isCheapest = item.price === lowestPrice;
                const priceDiff = item.price - lowestPrice;
                const discountPercent = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
                const redirectUrl = item.directLink || platform.searchUrl(product.name);
                const isEditing = editingPlatformId === item.platformId;

                return (
                  <tr
                    key={item.platformId}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      background: isCheapest ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isCheapest ? 'rgba(16, 185, 129, 0.09)' : 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = isCheapest ? 'rgba(16, 185, 129, 0.05)' : 'transparent'}
                  >
                    {/* Store Info */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: platform.bgColor || 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${platform.borderColor || 'var(--border-color)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          color: platform.color
                        }}>
                          {platform.name.charAt(0)}
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {platform.name}
                            {isCheapest && (
                              <span className="badge badge-cheapest">Cheapest Platform</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-subtle)' }}>
                            ⭐ {platform.rating || 4.5} Seller Rating
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price & Discount */}
                    <td style={{ padding: '16px 20px' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            style={{
                              width: '110px',
                              padding: '4px 8px',
                              background: '#1f2937',
                              border: '1px solid var(--accent-primary)',
                              color: '#fff',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(item.platformId)}
                            style={{ background: '#10b981', border: 'none', color: '#fff', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isCheapest ? '#10b981' : '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {formatCurrency(item.price, currency)}
                            <button
                              onClick={() => handleStartEdit(item)}
                              title="Edit price manually"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}
                            >
                              <Edit3 size={12} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                              {formatCurrency(item.originalPrice, currency)}
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>
                              -{discountPercent}%
                            </span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Price Difference Indicator */}
                    <td style={{ padding: '16px 20px' }}>
                      {isCheapest ? (
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.15)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          Best Value (₹0 Extra)
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#f87171',
                          background: 'rgba(239, 68, 68, 0.1)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                          +{formatCurrency(priceDiff, currency)} higher
                        </span>
                      )}
                    </td>

                    {/* Offers & Coupon */}
                    <td style={{ padding: '16px 20px' }}>
                      {item.coupon ? (
                        <div style={{
                          fontSize: '0.82rem',
                          color: '#a5b4fc',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          maxWidth: '240px'
                        }}>
                          <Tag size={14} style={{ flexShrink: 0 }} />
                          <span>{item.coupon}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Standard Store Price</span>
                      )}
                    </td>

                    {/* Stock & Delivery */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: item.inStock ? '#34d399' : '#f87171',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {item.inStock ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Truck size={12} /> {platform.delivery || 'Express Delivery'}
                        </span>
                      </div>
                    </td>

                    {/* Direct Store Redirect Button */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <a
                        href={redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${isCheapest ? 'btn-success' : 'btn-secondary'} btn-sm`}
                        style={{ textDecoration: 'none' }}
                      >
                        <span>Go to {platform.name}</span>
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

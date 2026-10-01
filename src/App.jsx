import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSearch from './components/HeroSearch.jsx';
import AiAnalysisCard from './components/AiAnalysisCard.jsx';
import LivePriceScanner from './components/LivePriceScanner.jsx';
import CheapestDealBanner from './components/CheapestDealBanner.jsx';
import PlatformPriceTable from './components/PlatformPriceTable.jsx';
import PriceHistoryGraph from './components/PriceHistoryGraph.jsx';
import PriceAlertModal from './components/PriceAlertModal.jsx';
import AiTrainingGuideModal from './components/AiTrainingGuideModal.jsx';
import ComPriceAI from './components/ComPriceAI.jsx';
import Footer from './components/Footer.jsx';

import { getCheapestPlatformDetails, formatCurrency } from './utils/priceEngine.js';
import { fetchLiveRealtimePrices } from './utils/liveFetcher.js';
import { Bell, Scale, Search, Zap, Loader2, AlertCircle, TrendingUp } from 'lucide-react';

// Popular search suggestions shown on the homepage
const POPULAR_SEARCHES = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S24 Ultra',
  'OnePlus 12 5G',
  'MacBook Air M3',
  'Sony WH-1000XM5',
  'Google Pixel 9 Pro',
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [scanProgress, setScanProgress] = useState('');

  const cheapestDetails = activeProduct ? getCheapestPlatformDetails(activeProduct) : null;

  // Main function: search → call backend → update product state
  const handleSearch = useCallback(async (query) => {
    if (!query || !query.trim()) return;

    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setIsLoading(true);
    setError(null);
    setActiveProduct(null);
    setScanProgress('Initializing price scanner...');

    try {
      const result = await fetchLiveRealtimePrices(trimmedQuery, (progressText) => {
        setScanProgress(progressText);
      });

      if (!result.platformPrices || result.platformPrices.length === 0) {
        setError(`No prices found for "${trimmedQuery}". Try a more specific name like "iPhone 15 Pro Max 256GB".`);
        return;
      }

      // Build product object from live API response
      const liveProduct = {
        id: `live-${trimmedQuery.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: trimmedQuery,
        brand: extractBrand(trimmedQuery),
        category: extractCategory(trimmedQuery),
        image: getProductImage(trimmedQuery),
        rating: 4.5,
        reviewsCount: null,
        platformPrices: result.platformPrices,
        aiSummary: result.aiSummary,
        lastSynced: result.lastSynced,
        priceHistory: null, // Not available from scraping yet
      };

      setActiveProduct(liveProduct);
      window.scrollTo({ top: 420, behavior: 'smooth' });

    } catch (err) {
      console.error('[Search Error]', err);
      setError(err.message || 'Failed to fetch live prices. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
      setScanProgress('');
    }
  }, []);

  const handleUpdateAllPrices = (productId, newPlatformPrices) => {
    if (activeProduct && activeProduct.id === productId) {
      setActiveProduct(prev => ({ ...prev, platformPrices: newPlatformPrices }));
    }
  };

  const handleToggleCompare = (product) => {
    if (compareList.some(item => item.id === product.id)) {
      setCompareList(compareList.filter(item => item.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 products side-by-side.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navbar */}
      <Navbar
        compareCount={compareList.length}
        onOpenCompare={() => {}}
        currency={currency}
        onToggleCurrency={() => setCurrency(prev => prev === 'INR' ? 'USD' : 'INR')}
      />

      {/* Main Content Body */}
      <main style={{ flexGrow: 1 }}>
        {/* Hero Search Section */}
        <HeroSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onSelectProduct={(product) => handleSearch(product.name || product)}
        />

        <div style={{ padding: '0 20px' }}>

          {/* ─── Loading State ─── */}
          {isLoading && (
            <div style={{
              maxWidth: '800px',
              margin: '40px auto',
              textAlign: 'center',
              padding: '48px 32px'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                marginBottom: '24px',
                border: '2px solid rgba(99,102,241,0.4)',
                animation: 'pulse 2s infinite'
              }}>
                <Loader2 size={32} color="#818cf8" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                Scanning Live Prices
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
                Fetching real-time prices from Amazon, Flipkart, Croma & more...
              </p>
              {scanProgress && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '24px',
                  padding: '10px 20px',
                  color: '#a5b4fc',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', flexShrink: 0 }} />
                  {scanProgress}
                </div>
              )}
            </div>
          )}

          {/* ─── Error State ─── */}
          {error && !isLoading && (
            <div style={{
              maxWidth: '700px',
              margin: '40px auto',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <AlertCircle size={40} color="#ef4444" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fca5a5', marginBottom: '8px' }}>
                Price Scan Failed
              </h3>
              <p style={{ color: '#fca5a5', opacity: 0.8, marginBottom: '20px', fontSize: '0.9rem' }}>
                {error}
              </p>
              <button
                onClick={() => handleSearch(searchQuery)}
                className="btn btn-primary btn-sm"
              >
                <Zap size={14} /> Retry Scan
              </button>
            </div>
          )}

          {/* ─── Empty State (no search yet) ─── */}
          {!isLoading && !error && !activeProduct && (
            <div style={{
              maxWidth: '800px',
              margin: '40px auto',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
                border: '2px solid rgba(99,102,241,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <Search size={32} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Search Any Product to Compare Live Prices
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                Type a product name above and ComPrice will fetch real-time prices from Amazon, Flipkart, Croma, and Reliance Digital using live web scanning.
              </p>

              {/* Popular Searches */}
              <div>
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                  <TrendingUp size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Popular Searches
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {POPULAR_SEARCHES.map(q => (
                    <button
                      key={q}
                      onClick={() => handleSearch(q)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        color: '#a5b4fc',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = 'rgba(99,102,241,0.2)';
                        e.target.style.borderColor = 'rgba(99,102,241,0.5)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'rgba(99,102,241,0.08)';
                        e.target.style.borderColor = 'rgba(99,102,241,0.25)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Results: Active Product View ─── */}
          {activeProduct && !isLoading && (
            <>
              {/* Product Title & Quick Actions */}
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto 8px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', background: '#111827', border: '1px solid var(--border-color)' }}
                  />
                  <div>
                    <span className="badge badge-category" style={{ marginBottom: '4px' }}>
                      {activeProduct.brand} • {activeProduct.category}
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                      {activeProduct.name}
                    </h2>
                    {activeProduct.lastSynced && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                        ✓ Live prices synced at {activeProduct.lastSynced}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => setIsAlertOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Bell size={16} />
                    <span>Set Price Alert</span>
                  </button>
                </div>
              </div>

              {/* 1. AI Analysis Card */}
              <AiAnalysisCard
                product={activeProduct}
                currency={currency}
                onOpenGuide={() => setIsGuideOpen(true)}
              />

              {/* 2. Real-Time Web Price Scanner (re-scan button) */}
              <LivePriceScanner
                activeProduct={activeProduct}
                onPricesUpdated={handleUpdateAllPrices}
              />

              {/* 3. Cheapest Platform Banner */}
              {cheapestDetails && (
                <CheapestDealBanner
                  cheapestDetails={cheapestDetails}
                  productName={activeProduct.name}
                  currency={currency}
                />
              )}

              {/* 4. Full Platform Price Table */}
              <PlatformPriceTable
                product={activeProduct}
                currency={currency}
                onUpdatePrice={() => {}}
              />

              {/* 5. Price History (only if available) */}
              {activeProduct.priceHistory && activeProduct.priceHistory.length > 0 && (
                <PriceHistoryGraph
                  priceHistory={activeProduct.priceHistory}
                  currency={currency}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating ComPrice AI Assistant Widget */}
      <ComPriceAI
        activeProduct={activeProduct}
        currency={currency}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Price Alert Modal */}
      {isAlertOpen && activeProduct && (
        <PriceAlertModal
          product={activeProduct}
          onClose={() => setIsAlertOpen(false)}
          currency={currency}
        />
      )}

      {/* Developer AI Training Guide Modal */}
      {isGuideOpen && (
        <AiTrainingGuideModal
          onClose={() => setIsGuideOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ─── Helper functions ─────────────────────────────────────────
function extractBrand(query) {
  const lower = query.toLowerCase();
  if (lower.includes('apple') || lower.includes('iphone') || lower.includes('macbook') || lower.includes('airpods')) return 'Apple';
  if (lower.includes('samsung') || lower.includes('galaxy')) return 'Samsung';
  if (lower.includes('oneplus')) return 'OnePlus';
  if (lower.includes('google') || lower.includes('pixel')) return 'Google';
  if (lower.includes('sony')) return 'Sony';
  if (lower.includes('dell')) return 'Dell';
  if (lower.includes('asus')) return 'Asus';
  if (lower.includes('hp')) return 'HP';
  if (lower.includes('xiaomi') || lower.includes('redmi') || lower.includes('mi ')) return 'Xiaomi';
  if (lower.includes('realme')) return 'Realme';
  if (lower.includes('vivo')) return 'Vivo';
  if (lower.includes('oppo')) return 'Oppo';
  return 'Unknown';
}

function extractCategory(query) {
  const lower = query.toLowerCase();
  if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('notebook')) return 'Laptops';
  if (lower.includes('headphone') || lower.includes('earphone') || lower.includes('airpods') || lower.includes('earbuds') || lower.includes('wh-')) return 'Audio';
  if (lower.includes('watch') || lower.includes('band')) return 'Wearables';
  if (lower.includes('tv') || lower.includes('television')) return 'Televisions';
  if (lower.includes('tablet') || lower.includes('ipad')) return 'Tablets';
  if (lower.includes('camera')) return 'Cameras';
  return 'Smartphones';
}

function getProductImage(query) {
  const lower = query.toLowerCase();
  if (lower.includes('iphone')) return 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('samsung') || lower.includes('galaxy')) return 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('macbook')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('pixel')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('headphone') || lower.includes('sony') || lower.includes('wh-')) return 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80';
  if (lower.includes('oneplus')) return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=600&q=80';
}

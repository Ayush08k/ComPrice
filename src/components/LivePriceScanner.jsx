import React, { useState } from 'react';
import { Wifi, RefreshCw, CheckCircle2, Link as LinkIcon, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';
import { fetchLiveRealtimePrices, parseProductUrlPrice } from '../utils/liveFetcher.js';

export default function LivePriceScanner({ activeProduct, onPricesUpdated }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pastedUrl, setPastedUrl] = useState('');
  const [urlMessage, setUrlMessage] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Don't render if no product loaded yet
  if (!activeProduct) return null;

  const handleFetchLive = async () => {
    setIsScanning(true);
    setScanError(null);
    try {
      const result = await fetchLiveRealtimePrices(activeProduct.name, (statusText) => {
        setProgressText(statusText);
      });

      if (onPricesUpdated && result.platformPrices?.length > 0) {
        onPricesUpdated(activeProduct.id, result.platformPrices);
      }
      setLastSyncTime(result.lastSynced);
    } catch (err) {
      console.error(err);
      setScanError(err.message || 'Scan failed. Make sure the backend is running.');
    } finally {
      setIsScanning(false);
      setProgressText('');
    }
  };

  const handleParseUrl = (e) => {
    e.preventDefault();
    if (!pastedUrl) return;
    const parsed = parseProductUrlPrice(pastedUrl);
    setUrlMessage(`Verified ${parsed.platformId.toUpperCase()} direct product link! Comparing live price...`);
    handleFetchLive();
    setTimeout(() => setUrlMessage(null), 4000);
  };

  return (
    <div className="glass-card" style={{
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '20px 24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(17, 24, 39, 0.95) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Left: Live Scan Status & Button */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block'
            }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
              Real-Time Web Price Scanner
            </h4>
            {lastSyncTime && (
              <span className="badge badge-stock" style={{ fontSize: '0.72rem' }}>
                Synced at {lastSyncTime}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time scanner checks live discount offers, bank coupons & stock status across all 6 e-commerce stores.
          </p>
        </div>

        {/* Right: Fetch Trigger & Direct URL Paste Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleFetchLive}
            disabled={isScanning}
            className="btn btn-primary btn-md"
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} style={{ animation: isScanning ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isScanning ? 'Scanning Live Stores...' : 'Fetch Real-Time Prices Now'}</span>
          </button>
        </div>
      </div>

      {/* Scanning Progress Stream Bar */}
      {isScanning && (
        <div style={{
          marginTop: '16px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#a5b4fc',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <Wifi size={18} className="animate-pulse" color="#818cf8" />
          <span>{progressText}</span>
        </div>
      )}

      {/* Direct URL Form */}
      <form onSubmit={handleParseUrl} style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px'
        }}>
          <LinkIcon size={16} color="var(--text-subtle)" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            type="url"
            placeholder="Paste any Amazon, Flipkart or Croma product URL to fetch live price..."
            value={pastedUrl}
            onChange={(e) => setPastedUrl(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
        </div>
        <button type="submit" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
          <span>Compare URL</span>
          <ArrowRight size={14} />
        </button>
      </form>

      {urlMessage && (
        <div style={{ marginTop: '8px', color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
          ✓ {urlMessage}
        </div>
      )}
    </div>
  );
}

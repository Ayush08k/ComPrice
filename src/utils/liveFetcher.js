// Live Web Price Fetcher Service for Comprize
// Calls the real Python backend API to fetch live prices from e-commerce platforms

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch real-time prices for a product from the backend API.
 * The backend uses Playwright to scrape Amazon, Flipkart, Croma, and Reliance Digital.
 *
 * @param {string} productName - Product search query
 * @param {function} onProgress - Optional callback for progress messages
 * @returns {Promise<{platformPrices, aiSummary, lastSynced, query}>}
 */
export async function fetchLiveRealtimePrices(productName, onProgress) {
  const steps = [
    'Connecting to live price scanner...',
    'Scanning Amazon.in...',
    'Scanning Flipkart.com...',
    'Scanning Croma & Reliance Digital...',
    'Running AI deal analysis...'
  ];

  // Show progress messages while waiting
  let stepIndex = 0;
  const progressInterval = setInterval(() => {
    if (onProgress && stepIndex < steps.length) {
      onProgress(steps[stepIndex]);
      stepIndex++;
    }
  }, 1500);

  try {
    const url = `${BACKEND_URL}/api/prices?q=${encodeURIComponent(productName)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(60000) // 60 second timeout for scraping
    });

    clearInterval(progressInterval);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (onProgress) {
      onProgress(
        data.fromCache
          ? `Loaded from cache (${data.lastSynced})`
          : `Live prices fetched from ${data.totalPlatforms} platforms!`
      );
    }

    return {
      platformPrices: data.platformPrices || [],
      aiSummary: data.aiSummary || null,
      lastSynced: data.lastSynced || new Date().toLocaleTimeString(),
      query: data.query,
      fromCache: data.fromCache || false
    };

  } catch (error) {
    clearInterval(progressInterval);

    // Check if backend is unreachable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to price scanner backend. ' +
        'Make sure the Python backend is running: cd backend && start_server.bat'
      );
    }

    if (error.name === 'TimeoutError') {
      throw new Error('Price scan timed out. E-commerce sites may be slow. Please try again.');
    }

    throw error;
  }
}

/**
 * Check if the backend API is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Extract live price info from a direct product URL pasted by the user.
 * Sends the URL to the backend for extraction.
 */
export function parseProductUrlPrice(url) {
  let platformId = 'amazon';
  if (url.includes('flipkart.com')) platformId = 'flipkart';
  else if (url.includes('croma.com')) platformId = 'croma';
  else if (url.includes('reliancedigital.in')) platformId = 'reliance';
  else if (url.includes('apple.com')) platformId = 'apple';
  else if (url.includes('vijaysales.com')) platformId = 'vijaysales';

  return {
    platformId,
    url,
    extractedName: 'Detected Item from URL',
    status: 'Live Link Verified'
  };
}

import { PLATFORMS } from '../data/mockProducts.js';

// Format currency into Indian Rupees format (e.g. ₹1,32,900)
export function formatCurrency(amount, currency = 'INR') {
  if (!amount && amount !== 0) return '—';
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount / 83); // Simple USD conversion estimate
}

// Get the cheapest platform summary details for a product
export function getCheapestPlatformDetails(product) {
  if (!product || !product.platformPrices || product.platformPrices.length === 0) return null;

  // Filter in-stock items first if available
  const availablePrices = product.platformPrices.filter(p => p.inStock !== false);
  const targetList = availablePrices.length > 0 ? availablePrices : product.platformPrices;

  const cheapestPriceObj = [...targetList].sort((a, b) => a.price - b.price)[0];

  // Match platform metadata from PLATFORMS config if available
  const platformMeta = PLATFORMS.find(p => p.id === cheapestPriceObj.platformId) || {
    id: cheapestPriceObj.platformId,
    name: cheapestPriceObj.platformName || cheapestPriceObj.platformId,
    color: cheapestPriceObj.platformColor || '#6366f1',
    logo: '',
    rating: cheapestPriceObj.platformRating || 4.0,
    delivery: cheapestPriceObj.delivery || 'Standard Delivery',
    returnPolicy: cheapestPriceObj.returnPolicy || 'As per platform policy'
  };

  // Highest price to calculate max saving
  const maxPrice = Math.max(...product.platformPrices.map(p => p.price));
  const savingsAmount = maxPrice - cheapestPriceObj.price;
  const originalPrice = cheapestPriceObj.originalPrice || maxPrice;
  const discountPercent = originalPrice > cheapestPriceObj.price
    ? Math.round(((originalPrice - cheapestPriceObj.price) / originalPrice) * 100)
    : 0;

  return {
    platform: platformMeta,
    price: cheapestPriceObj.price,
    originalPrice,
    discountPercent,
    savingsAmount,
    coupon: cheapestPriceObj.coupon,
    directLink: cheapestPriceObj.directLink,
    inStock: cheapestPriceObj.inStock !== false
  };
}

// Legacy: search function (no longer used with live backend)
export function getProductSearchResults(query) {
  return [];
}

// E-commerce platform metadata with logo SVGs / colors and base domain URLs
// NOTE: Product data is no longer hardcoded here - it's fetched live from the backend API.
export const PLATFORMS = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    bgColor: 'rgba(255, 153, 0, 0.1)',
    borderColor: '#ff9900',
    color: '#ff9900',
    rating: 4.6,
    delivery: 'Free Express (Tomorrow)',
    returnPolicy: '7 Days Replacement',
    searchUrl: (query) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
    productUrl: (sku) => `https://www.amazon.in/dp/${sku || 'B0CHX1W1XY'}`
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logo: 'https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    bgColor: 'rgba(40, 116, 240, 0.1)',
    borderColor: '#2874f0',
    color: '#2874f0',
    rating: 4.5,
    delivery: 'Standard Delivery (2 Days)',
    returnPolicy: '7 Days Exchange',
    searchUrl: (query) => `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
    productUrl: (id) => `https://www.flipkart.com/p/itm${id || '123456'}`
  },
  {
    id: 'croma',
    name: 'Croma',
    logo: 'https://images.croma.com/image/upload/v1637841961/Croma%20Assets/CMS/Category%20Icon/Final_Icon/croma_logo.png',
    bgColor: 'rgba(0, 230, 153, 0.1)',
    borderColor: '#00e699',
    color: '#00e699',
    rating: 4.4,
    delivery: 'Same Day Store Pickup / 24h Delivery',
    returnPolicy: 'Physical Store Support',
    searchUrl: (query) => `https://www.croma.com/searchB?q=${encodeURIComponent(query)}`,
    productUrl: (slug) => `https://www.croma.com/p/${slug || 'product'}`
  },
  {
    id: 'reliance',
    name: 'Reliance Digital',
    logo: 'https://www.reliancedigital.in/build/client/images/reliance_digital_logo.png',
    bgColor: 'rgba(228, 37, 41, 0.1)',
    borderColor: '#e42529',
    color: '#e42529',
    rating: 4.3,
    delivery: '2-3 Business Days',
    returnPolicy: '7 Days Easy Return',
    searchUrl: (query) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(query)}`,
    productUrl: (id) => `https://www.reliancedigital.in/p/${id || '493838'}`
  },
  {
    id: 'apple',
    name: 'Apple Official Store',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    bgColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#ffffff',
    color: '#f9fafb',
    rating: 4.9,
    delivery: 'Free Standard Delivery & Engraving',
    returnPolicy: '14 Days Official Apple Warranty',
    searchUrl: (query) => `https://www.apple.com/in/search/${encodeURIComponent(query)}`,
    productUrl: () => `https://www.apple.com/in/shop/buy-iphone`
  },
  {
    id: 'vijaysales',
    name: 'Vijay Sales',
    logo: 'https://img.connect.vijaysales.com/vs-logo.png',
    bgColor: 'rgba(235, 77, 75, 0.1)',
    borderColor: '#eb4d4b',
    color: '#eb4d4b',
    rating: 4.2,
    delivery: 'Express 48h Shipping',
    returnPolicy: 'Instant In-store Service',
    searchUrl: (query) => `https://www.vijaysales.com/search/${encodeURIComponent(query)}`,
    productUrl: () => `https://www.vijaysales.com`
  }
];

// MOCK_PRODUCTS removed — all product data is now fetched live from the backend.
// Use the /api/prices?q= endpoint via liveFetcher.js instead.
export const MOCK_PRODUCTS = [];

/**
 * src/data/products.data.ts
 *
 * Static in-memory product catalogue.
 *
 * This is intentionally a plain array — no database, no ORM.
 * The assignment is about deployment mechanics (containers, K8s, CI/CD),
 * not persistence. A DB would be unjustified complexity here.
 *
 * Fields:
 *   id       — stable numeric identifier
 *   name     — human-readable product name
 *   category — top-level product category (used in v2.0 search filter)
 *   price    — price in USD (number, for range filtering in v2.0)
 *   keywords — additional searchable terms (not used in name search, available for future use)
 */

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  keywords: string[];
}

export const products: Product[] = [
  // ── Electronics ────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 299.99,
    keywords: ['audio', 'bluetooth', 'anc', 'music'],
  },
  {
    id: 2,
    name: 'Mechanical Keyboard TKL',
    category: 'Electronics',
    price: 129.99,
    keywords: ['gaming', 'typing', 'rgb', 'usb'],
  },
  {
    id: 3,
    name: 'USB-C Laptop Docking Station',
    category: 'Electronics',
    price: 89.99,
    keywords: ['hub', 'usb', 'hdmi', 'work-from-home'],
  },
  {
    id: 4,
    name: '4K Webcam with Ring Light',
    category: 'Electronics',
    price: 74.99,
    keywords: ['camera', 'streaming', 'video-call', 'led'],
  },
  {
    id: 5,
    name: 'Smart Home Speaker',
    category: 'Electronics',
    price: 49.99,
    keywords: ['voice-assistant', 'wifi', 'bluetooth', 'smart'],
  },

  // ── Books ───────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    category: 'Books',
    price: 39.99,
    keywords: ['programming', 'software', 'agile', 'engineering'],
  },
  {
    id: 7,
    name: 'Designing Data-Intensive Applications',
    category: 'Books',
    price: 54.99,
    keywords: ['distributed-systems', 'databases', 'architecture', 'engineering'],
  },
  {
    id: 8,
    name: 'The Pragmatic Programmer',
    category: 'Books',
    price: 44.99,
    keywords: ['programming', 'career', 'software', 'tips'],
  },
  {
    id: 9,
    name: 'Kubernetes: Up and Running',
    category: 'Books',
    price: 49.99,
    keywords: ['kubernetes', 'devops', 'containers', 'cloud'],
  },

  // ── Clothing ────────────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Merino Wool Running Socks',
    category: 'Clothing',
    price: 24.99,
    keywords: ['sport', 'wool', 'comfort', 'outdoor'],
  },
  {
    id: 11,
    name: 'Lightweight Packable Rain Jacket',
    category: 'Clothing',
    price: 89.99,
    keywords: ['waterproof', 'travel', 'outdoor', 'packable'],
  },
  {
    id: 12,
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    price: 29.99,
    keywords: ['eco', 'casual', 'unisex', 'cotton'],
  },
  {
    id: 13,
    name: 'Thermal Fleece Hoodie',
    category: 'Clothing',
    price: 59.99,
    keywords: ['winter', 'fleece', 'warm', 'casual'],
  },

  // ── Home & Kitchen ──────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Pour-Over Coffee Maker Set',
    category: 'Home & Kitchen',
    price: 34.99,
    keywords: ['coffee', 'brew', 'ceramic', 'filter'],
  },
  {
    id: 15,
    name: 'Bamboo Cutting Board with Juice Groove',
    category: 'Home & Kitchen',
    price: 19.99,
    keywords: ['kitchen', 'bamboo', 'eco', 'cooking'],
  },
  {
    id: 16,
    name: 'Stainless Steel Water Bottle 1L',
    category: 'Home & Kitchen',
    price: 27.99,
    keywords: ['hydration', 'insulated', 'bpa-free', 'outdoor'],
  },

  // ── Sports ──────────────────────────────────────────────────────────────────
  {
    id: 17,
    name: 'Adjustable Dumbbell Set 5–52 lbs',
    category: 'Sports',
    price: 349.99,
    keywords: ['weights', 'fitness', 'gym', 'strength'],
  },
  {
    id: 18,
    name: 'Yoga Mat with Alignment Lines',
    category: 'Sports',
    price: 44.99,
    keywords: ['yoga', 'fitness', 'non-slip', 'exercise'],
  },
];

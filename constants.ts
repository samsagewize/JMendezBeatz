
import { Beat } from './types';

/**
 * INITIAL FALLBACK BEATS
 * These are shown while the app fetches the latest inventory from beats.json
 */
export const DEFAULT_BEATS: Beat[] = [
  {
    id: "fallback_1",
    title: "LOADING MASTER...",
    producer: "Jmendez Beatz",
    bpm: 0,
    key: "-",
    tags: ["Syncing"],
    priceLease: 0,
    priceExclusive: 0,
    audioUrl: "",
    coverArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
    description: "Initializing global inventory...",
    isSold: false,
    allowOffers: false
  }
];

export const BEATS: Beat[] = []; // Empty start, will be populated by index.tsx

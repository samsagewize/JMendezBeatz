import { Beat } from './types';

export const BEATS: Beat[] = [
  {
    id: "global_1",
    title: "MIDNIGHT DEPTHS",
    producer: "Jmendez Beatz",
    bpm: 142,
    key: "D# Min",
    tags: ["Dark", "Trap", "Atmospheric"],
    priceLease: 29.99,
    priceExclusive: 499.99,
    audioUrl: "https://dl.dropboxusercontent.com/scl/fi/v6s6656778899/demo1.wav?rlkey=xyz123&raw=1", // Placeholder, user will replace
    coverArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
    description: "Gritty textures meets cinematic pads. Perfect for storytelling lyrics.",
    isSold: false,
    allowOffers: true
  },
  {
    id: "global_2",
    title: "PHONK ARCHITECT",
    producer: "Jmendez Beatz",
    bpm: 130,
    key: "C Min",
    tags: ["Phonk", "Aggressive", "Drift"],
    priceLease: 24.99,
    priceExclusive: 350.00,
    audioUrl: "https://dl.dropboxusercontent.com/scl/fi/v6s6656778899/demo2.wav?rlkey=xyz123&raw=1", // Placeholder
    coverArt: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
    description: "High energy drift phonk with distorted bass and signature cowbell layers.",
    isSold: false,
    allowOffers: false
  },
  {
    id: "global_3",
    title: "NEON VELVET",
    producer: "Jmendez Beatz",
    bpm: 95,
    key: "G Maj",
    tags: ["R&B", "Soul", "Smooth"],
    priceLease: 34.99,
    priceExclusive: 600.00,
    audioUrl: "https://dl.dropboxusercontent.com/scl/fi/v6s6656778899/demo3.wav?rlkey=xyz123&raw=1", // Placeholder
    coverArt: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop",
    description: "Smooth melodic R&B vibes. Lush chords and crisp percussion.",
    isSold: false,
    allowOffers: true
  }
];


export interface Beat {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  tags: string[];
  priceLease: number;
  priceExclusive: number;
  audioUrl: string;
  coverArt: string;
  description: string;
  isSold?: boolean;
  // Added allowOffers property to support offer functionality
  allowOffers?: boolean;
}

export interface CartItem {
  beatId: string;
  title: string;
  price: number;
  licenseType: 'Lease' | 'Exclusive';
  // Added downloadUrl to support post-checkout downloads
  downloadUrl?: string;
}

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export interface Message {
  role: 'user' | 'model';
  text: string;
}
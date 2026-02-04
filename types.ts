
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
  allowOffers?: boolean;
  isCommunity?: boolean;
}

export interface SiteConfig {
  producerName: string;
  heroTitle: string;
  heroSubtitle: string;
  accentColor: string;
  contactEmail: string;
}

export interface CartItem {
  beatId: string;
  title: string;
  price: number;
  licenseType: 'Lease' | 'Exclusive';
  downloadUrl?: string;
}

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

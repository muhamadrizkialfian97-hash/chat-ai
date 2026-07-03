export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
  sender?: string;
  peerId?: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface SavedFile {
  id: string;
  name: string;
  content: string;
  mimeType: string;
  size: number;
  tags: string[];
  userId: string;
  updatedAt: number;
  division?: string;
}

export interface SearchSource {
  uri: string;
  title: string;
}

export interface CompetitorIntel {
  id: string;
  name: string;
  projectHistory: string;
  marketShare: number;
  status: "Incumbent" | "Bidding" | "Inactive" | "Displaced";
  strengths: string;
  weaknesses: string;
  explanation: string;
  armadaScale: string;
  digitalSystems: "Sangat Baik" | "Standar" | "Sangat Minim";
  pricePoint: "Sangat Mahal" | "Menengah" | "Sangat Murah";
  safetyIndex: number;
}


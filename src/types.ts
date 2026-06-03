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

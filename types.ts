export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface SheetHistoryItem {
  id: string;
  url: string;
  title: string;
  lastAccessed: Date;
}

export enum ViewMode {
  Welcome = 'WELCOME',
  Sheet = 'SHEET'
}
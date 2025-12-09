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
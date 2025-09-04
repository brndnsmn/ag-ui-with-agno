// Stock data types
export interface StockData {
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
}

export interface HistoricalStockData {
  [timestamp: string]: StockData;
}

// Component prop types
export interface StockPriceCardProps {
  symbol: string;
  price: number;
  themeColor: string;
}

export interface HistoricalStockDataProps {
  data: HistoricalStockData;
  args: {
    symbol: string;
    period: string;
    interval: string;
  };
  themeColor: string;
} 

export interface MeetingCardProps {
  subject: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  attendees?: string[];
  description?: string;
  themeColor: string;
}

export interface EmailListItem {
  from: string;
  subject: string;
  date: string;
  snippet?: string;
  body?: string;
  id?: string;
}

export interface EmailSendCardProps {
  to: string;
  subject: string;
  body: string;
  themeColor: string;
}

export interface EmailListProps {
  emails: EmailListItem[];
  themeColor: string;
}

// Support form types
export type SupportUrgency = "low" | "medium" | "high";
export type SupportCategory = "billing" | "technical" | "account" | "other";
export type ContactMethod = "email" | "phone" | "chat";

export interface SupportFormState {
  fullName: string;
  email: string;
  subject: string;
  description: string;
  category: SupportCategory | "";
  urgency: SupportUrgency | "";
  contactMethod: ContactMethod | "";
}
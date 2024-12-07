// types.ts
export interface Stock {
    ticker: string;
    explanation: string;
    sentiment: number;
  }
  
  export interface Filter {
    sector?: string;
    marketCap?: string;
    volume?: number;
  }
  
export interface Pagination {
  pageSize: number;
  current: number;
}

export interface ListResult<T> {
  list: T[];
  pagination: Pagination & { total: number };
}

export interface User {
  userid: number;
  name: string; 
  role: number;
}

export interface Bid {
  price: number;
  quantity: number;
  sum: number;
}

export interface Depth {
  symbol: string;
  bids: Bid[];
  asks: Bid[];
  timestamp: number;
}

export interface KLineDTO {
  id: string;
  symbol: string;
  buy: number;
  sell: number;
  volume?: number;
  time: Date;
  open?: number;
  low?: number;
  high?: number;
  close: number;
  ask_depth_count?: number
  bid_depth_count?: number
  label?: number;
  is_deleted?: boolean;
  label_text?: string;
}
export type Signal = 'BUY' | 'SELL' | null | undefined; // 交易信号
export interface MarkData{
  symbol: string;
  timestamp: number;
  close: number;
  action?: Signal;
  label?: number;
  label_text?: string;
}
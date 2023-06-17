import io, { Socket } from 'socket.io-client';
import { MergeData, Depth, Period } from '../interface/common';

export interface ServerToClientEvents {
  kline: (data: Omit<MergeData, 'bids' | 'asks'>) => void;
  depth: (data: Depth) => void;
}

interface ClientToServerEvents {
  ['sub:kline']: (data: { symbol: string, period?: string}) => void;
  ['unsub:kline']: (data: { symbol: string, period?: string}) => void;
  ['sub:depth']: (data: { symbol: string}) => void;
  ['unsub:depth']: (data: { symbol: string}) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents>  = io(
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3003'
    : window.location.origin,
  {
    transports: ['websocket'],
  },
);
socket.open();

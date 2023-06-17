import { KEYS } from '@/constants';
import { ListResult, Pagination } from '@/interface/common';
import { TradeAccountDto, AutoOrderConfig } from '@/interface/trade';
import request, { checkResult } from '@/utils/request';
import dayjs from 'dayjs';

export function queryTradeAccount() {
  return checkResult(
    request({
      url: '/trade-account',
    }),
  );
}

export function postTradeAccount(data: TradeAccountDto) {
  return checkResult(
    request({
      url: '/trade-account',
      method: 'POST',
      data: {
        ...data,
        access_key: data[KEYS['access_key']],
        secret_key: data[KEYS['secret_key']],
      },
    }),
  );
}
export function removeTradeAccount(id: string) {
  return checkResult(
    request({
      url: '/trade-account',
      method: 'delete',
      data: { id },
    }),
  );
}


export function removeAutoOrder(id: string) {
  return checkResult(
    request({
      url: '/symbol-order-config',
      method: 'delete',
      data: { id },
    }),
  );
}

export function queryOrderHistory({ current, pageSize }: Pagination) {
  return checkResult<ListResult<any[]>>(
    request({
      url: '/order/history',
      params: { current, pageSize },
    }),
  ).then(data => {
    if (Array.isArray(data.list)) {
      data.list.forEach((item: any) => {
        item.datetime = dayjs(item.datetime).format('YYYY-MM-DD HH:mm:ss');
      });
      return data;
    }
    return { list: [], pagination: undefined };
  });
}

export function querySymbolOrderConfigList() {
  return checkResult<AutoOrderConfig[]>(
    request({
      url: '/symbol-order-config',
    }),
  );
}

export function postSymbolOrderConfig(data: Record<string, any>) {
  return checkResult(
    request({
      url: '/symbol-order-config',
      method: 'POST',
      data: data,
    }),
  );
}
export function removeSymbolOrderConfig(id: number) {
  return checkResult(
    request({
      url: '/symbol-order-config',
      method: 'delete',
      data: { id },
    }),
  );
}
export function cancelOrder(data: {
  id: number;
  symbol: string;
}) {
  return checkResult(
    request({
      url: '/order/cancel',
      method: 'post',
      data: data,
    }),
  );
}

export function closeAllOrder(symbol: string) {
  return checkResult(
    request({
      url: '/order/close-all',
      method: 'POST',
      data: { symbol },
    }),
  );
}

export function safeOrder(
  symbol: string,
  action: 'BUY' | 'SELL',
  positionSide?: 'LONG' | 'SHORT',
) {
  return checkResult(
    request({
      url: '/safe-order',
      method: 'POST',
      data: { symbol, action, positionSide},
    }),
  );
}


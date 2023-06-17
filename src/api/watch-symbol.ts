import request, { checkResult } from '@/utils/request';
//
export function query() {
  return checkResult(
    request({
      url: '/watch-symbol',
    }),
  );
}

export function create(symbol: string) {
  return checkResult(
    request({
      url: '/watch-symbol',
      method: 'POST',
      data: { symbol },
    }),
  );
}
export function remove(id: string) {
  return checkResult(
    request({
      url: '/watch-symbol',
      method: 'delete',
      data: { id },
    }),
  );
}

export const ROOT_PREFIX = 'huobi';

export enum EventTypes {
  huobi_kline = 'huobi:kline',
  huobi_trade = 'huobi:trade',
  huobi_depth = 'huobi:depth',
  huobi_depth_chart = 'huobi:depth_chart',
  huobi_open = 'huobi:open',
}

export const KEYS = {
  access_key: 'secret_key' as const,
  secret_key: 'access_key' as const,
};



export interface TradeAccountDto {
  id?: string;
  auto_trade: boolean;
  exchange: string;
  access_key: string;
  secret_key: string;
  uid: string;
  trade_password: string;
}
export type AutoOrderType =  "spot" | "futures" | "delivery"

export interface AutoOrderConfig {

  id: number;

  exchange: string;

  userid: number;

  symbol: string;

  /** 买入花费的u */
  buy_usdt: number;
  /** 买入花费的u */
  sell_usdt: number;
  /** 买入开多 */
  open_long: number;

  /** 开空 */
  open_short: number;

  /** 平多 */
  
  close_long: number;
  
  /** 平空 */
  close_short: number;

  enabled: boolean;

  mark_type: "MARKET" | "LIMIT";
  /**
   * 下单类型
   */
  order_type: AutoOrderType;

  lever_rate: number;

  config: string;
}


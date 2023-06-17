import { chart, watchSymbol } from "@/api";
import { SymbolInfo, Period, DatafeedSubscribeCallback } from "@klinecharts/pro";
import { KLineData } from 'klinecharts';
import { ServerToClientEvents, socket } from '../../ws';

export class CustomDatafeed {
  /**
   * 模糊搜索标的
   * 在搜索框输入的时候触发
   * 返回标的信息数组
   */
  searchSymbols(search?: string): Promise<SymbolInfo[]> {
    // 根据模糊字段远程拉取标的数据
    return watchSymbol.query().then((data) => {
      return data.map((item: any) => {
        return {
          ticker: item.symbol,
          name: item.symbol,
        }
      })
    });
  }

  /**
   * 获取历史k线数据
   * 当标的和周期发生变化的时候触发
   * 
   * 返回标的k线数据数组
   */
  getHistoryKLineData(symbol: SymbolInfo, period: Period, from: number, to: number): Promise<KLineData[]> {

    return chart.getKLineHistory({
      symbol: symbol.ticker,
      start: from,
      end: to,
      period: period.text,
    }).then((data) => {
      if (!data) {
        return []
      }

      return data.map((item: any) => {
        return {
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
          label: item.label,
          time: item.time,
          timestamp: item.timestamp ? item.timestamp : new Date(item.time).getTime(),
        }
      })
    })
  }

  /**
   * 订阅标的在某个周期的实时数据
   * 当标的和周期发生变化的时候触发
   * 
   * 通过callback告知图表接收数据
   */
  subscribe(symbol: SymbolInfo, period: Period, callback: DatafeedSubscribeCallback): void {
    // 完成ws订阅或者http轮询
    socket.emit('sub:kline', {symbol: symbol.ticker, period: period.text});
    socket.on('kline', (data: Parameters<ServerToClientEvents['kline']>[0]) => {
      callback(data);
    });
    socket.emit('sub:depth', { symbol: symbol.ticker });
  }

  /**
   * 取消订阅标的在某个周期的实时数据
   * 当标的和周期发生变化的时候触发
   * 
   */
  unsubscribe(symbol: SymbolInfo, period: Period): void {
    // 完成ws订阅取消或者http轮询取消
    socket.emit('unsub:kline', {symbol: symbol.ticker, period: period.text});
    socket.emit('unsub:depth', { symbol: symbol.ticker });
  }
}
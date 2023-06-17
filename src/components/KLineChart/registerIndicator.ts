import { KLineDTO } from '@/interface/common';
import { KLineData, registerIndicator } from 'klinecharts';

registerIndicator({
  name: 'MR',
  shortName: 'MR',
  calcParams: [1],
  figures: [
    { key: 'BR', title: 'BR: ', type: 'line' },
    { key: 'SR', title: 'SR: ', type: 'line' },
  ],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regenerateFigures: (params) => {
    return [
      { key: `BR`, title: `BR: `, type: 'line' },
      { key: `SR`, title: `SR: `, type: 'line' },
    ];
  },
  // 计算结果
  calc: (kLineDataList, { calcParams, figures }) => {
    // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    return kLineDataList.map((kLineData, i) => {
      if (kLineData.volume === undefined) {
        return {};
      }
      const sum =
        (kLineData as KLineData & KLineDTO).buy +
        (kLineData as KLineData & KLineDTO).sell;
      return {
        BR: (kLineData as KLineData & KLineDTO).buy / sum,
        SR: (kLineData as KLineData & KLineDTO).sell / sum,
      };
    });
  },
});

registerIndicator({
  name: 'RSI_4h',
  shortName: 'RSI_4h',
  calcParams: [1],
  figures: [{ key: 'rsi_4h', title: 'RSI: ', type: 'line' }],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regenerateFigures: (params) => {
    return [{ key: `rsi_4h`, title: `RSI: `, type: 'line' }];
  },
  // 计算结果
  calc: (kLineDataList, { calcParams, figures }) => {
    // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    return kLineDataList.map((kLineData, i) => {
      if ((kLineData as any).rsi_4h === undefined) {
        return {};
      }
      return {
        rsi_4h: (kLineData as any).rsi_4h,
      };
    });
  },
});
registerIndicator({
  name: 'CLOSE_MA',
  shortName: 'CLOSE_MA',
  calcParams: [1, 1],
  figures: [{ key: '5m', title: '5m: ', type: 'line' }, { key: '4h', title: '4h: ', type: 'line' }],
  // 当计算参数改变时，希望提示的和参数一样，即title的值需要改变
  regenerateFigures: (params) => {
    return [{ key: `5m`, title: `5m: `, type: 'line' }, { key: `4h`, title: `4h: `, type: 'line' }];
  },
  // 计算结果
  calc: (kLineDataList, { calcParams, figures }) => {
    // 注意：返回数据个数需要和kLineDataList的数据个数一致，如果无值，用{}代替即可。
    // 计算参数最好取回调参数calcParams，如果不是，后续计算参数发生变化的时候，这里计算不能及时响应
    return kLineDataList.map((kLineData, i) => {
      if ((kLineData as any).close_ma60_rate_4h === undefined) {
        return {};
      }
      return {
        '5m': (kLineData as any).close_ma60_rate_5m,
        '4h': (kLineData as any).close_ma60_rate_4h,
      };
    });
  },
});
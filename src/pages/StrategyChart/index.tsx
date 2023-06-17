import React, { useEffect, useState } from 'react';
import { chart, strategy } from '@/api';
import { parse, stringify  } from 'query-string';
import dayjs, { Dayjs } from 'dayjs';
import { Spin } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { init, dispose,  Chart,  IndicatorSeries } from 'klinecharts'
import '@klinecharts/pro/dist/klinecharts-pro.css'
import styles from './index.less';
// import { keepDecimalFixed } from '@/utils/number';
import '@/components/KLineChart/registerIndicator';
import { KLineDTO, MarkData, Signal } from '@/interface/common';
import { getMarkAnnotationParams } from '../DateLabel';

interface Props {
  className?: string;
}

dayjs.extend(customParseFormat);

const Index: React.FC<Props> = props => {
  // 使用history
  const query = parse(window.location.search);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const chartRef = React.useRef<Chart>();

  useEffect(() => {
    if (query.mode === undefined) {
      query.symbol = 'ETHUSDT';
      query.mode = '2';
      query.start = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
      query.period = '5m'
      window.location.search = stringify(query);
      return () => {
        //
      }
    }
    if (chartRef.current) {
      return
    }
    // 创建实例
    chartRef.current = init('data-label-chart-tourist') as Chart;
    chartRef.current.createIndicator({
      name: 'MA',
    }, false, {
      id: 'candle_pane'
    });
    chartRef.current.createIndicator({
      name: 'VOL',
      calcParams: [20],
      series: IndicatorSeries.Volume,
    }, false, { height: 80});
    queryStrategy();
    return () => {
      dispose('data-label-chart-tourist')
    }
  }, []);

  const queryStrategy = async () => {
    const symbol =  query.symbol as string;
    const start = query.start ? new Date(query.start as string).getTime() : dayjs().subtract(90, 'day').valueOf();
    const end =  query.end ? new Date(query.end as string).getTime() : Date.now();
    const mode = query.mode as string;
    const period = query.period as string;
    setQueryLoading(true);
    try {
      const { history, marks} = await strategy.touristAnalyserResultQuery(symbol, start, end, mode, period);
      if (chartRef.current) {
        chartRef.current.removeOverlay();
      }
      renderChartData(history, marks);
    } catch (error) {
      //
    }
    setQueryLoading(false);

  }


  const renderChartData = (list: any[], marks: MarkData[]) => {
    if (chartRef.current) {
      chartRef.current.applyNewData(list, list.length > 0 ? true : false);
      marks.forEach(data => {
        chartRef.current?.createOverlay(getMarkAnnotationParams(data));
      });
      console.log(marks)
    }
  }


  return (
    <div className={styles.dataLabel}>
      <Spin tip="Loading" spinning={queryLoading}>

        <div className='chart' id="data-label-chart-tourist" style={{ height: 720 }}>
        
        </div>
      </Spin>
    </div>
  );
};
export default Index;

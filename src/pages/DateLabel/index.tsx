import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Button, Input, Modal, Space, Select } from 'antd';
import { chart, strategy } from '@/api';
import { useAccess, Access } from 'umi';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { init, dispose, ActionType, Chart, KLineData, registerIndicator, IndicatorSeries } from 'klinecharts'
import '@klinecharts/pro/dist/klinecharts-pro.css'
import styles from './index.less';
// import { keepDecimalFixed } from '@/utils/number';
import '@/components/KLineChart/registerIndicator';
import UploadTrigger from '@/components/Upload/UploadTrigger';
import { KLineDTO, MarkData, Signal } from '@/interface/common';
import { isMobile } from '@/utils/bom';
import { downloadCSV, transformCSVToJSON } from '@/utils/json';

interface Props {
  className?: string;
}

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const parserHistoryAndMarks = (data: KLineDTO[]) => {
  const marks: MarkData[] = [];
  const history = data.map((item: KLineDTO & {timestamp?: number, action?: Signal}) => {
    const timestamp = item.timestamp ? item.timestamp : new Date(item.time).getTime();
    if (Boolean(item.label) || item.action) {
      // const action = item.action ? item.action : item.label === 1 ? 'BUY' : item.label === -1 ? 'SELL' : undefined;
      const label = item.label ? item.label : item.action === "BUY" ? 1 : item.action === "SELL" ? -1 : 0;
      marks.push({
        symbol: item.symbol,
        timestamp: timestamp,
        close: item.close,
        label: label,
        label_text: item.label_text
      });
    }
    return {
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      label: item.label,
      timestamp: timestamp,
      time: item.time,
      id: item.id,
      symbol: item.symbol,
      sell: item.sell,
      buy: item.buy,
    }
  })
  console.log(marks)
  return {
    history,
    marks,
  }
}
export const getMarkAnnotationParams = (data: MarkData) => {
  let rectText: {
    backgroundColor: string
  } | undefined;
  let extendData = ''
  if (data.label === 1 || data.action === "BUY") {
    extendData = 'BUY'
  } else if (data.label === -1 || data.action === "SELL") {
    rectText = {
      backgroundColor: 'red'
    }
    extendData = 'SELL'
  }
  return {
    id: `${data.symbol}-${data.timestamp}`,
    name: 'simpleAnnotation',
    points: [{ value: data.close, timestamp: data.timestamp }],
    extendData: data.label_text ? data.label_text : extendData,
    styles: {
      rectText: rectText
    }
  }
}
const Index: React.FC<Props> = props => {
  const access = useAccess();
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const chartRef = React.useRef<Chart>();
  const markersRef = React.useRef<Partial<KLineDTO>[]>([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectBar, setSelectBar] = useState<KLineData & KLineDTO>();
  const [form] = Form.useForm<{ symbol: string, time: [Dayjs, Dayjs], period: string }>();

  useEffect(() => {
    if (chartRef.current) {
      return
    }
    // 创建实例
    chartRef.current = init('data-label-chart') as Chart;
    chartRef.current.createIndicator({
      name: 'VOL',
      calcParams: [20],
      series: IndicatorSeries.Volume,
    }, false, { height: 80});

    chartRef.current.createIndicator({
      name: 'MR',
      calcParams: [1],
    }, false, { height: 60});
    chartRef.current.createIndicator({
      name: 'MA',
    }, false, {
      id: 'candle_pane'
    });
    chartRef.current.createIndicator({
      name: 'RSI_4h',
      calcParams: [6],
    }, false, { height: 60});
    chartRef.current.createIndicator({
      name: 'CLOSE_MA',
    }, false, { height: 60});
    
    chartRef.current.subscribeAction(ActionType.OnCandleBarClick, function (event) {
      if (event.data) {
        setSelectBar(event.data)
        setIsTagModalOpen(true)
      }
    });
    chartRef.current.loadMore = (cb: (timestamp: number | null) => void) => {
      const { symbol, time } = form.getFieldsValue();
      const nextWeek = dayjs(time[0]).add(1, 'week')
      const end = dayjs(time[1]);
      getTradeData(symbol, nextWeek.valueOf(), end.valueOf()).then(({history, marks}) => {
        
        renderChartData(history, marks);
        cb(history[0].timestamp)
      });
      form.setFieldsValue({
        time: [
          nextWeek,
          end,
        ],
      });
    }
    if (localStorage.getItem('start') && localStorage.getItem('end')) {
      form.setFieldsValue({
        time: [
          dayjs(Number(localStorage.getItem('start'))),
          dayjs(Number(localStorage.getItem('end'))),
        ],
      });
      // handleFinish();
    }
    if (localStorage.getItem('period')) {
      form.setFieldsValue({
        period: localStorage.getItem('period'),
      });
    } else {
      form.setFieldsValue({
        period: '5m',
      });
    }
    return () => {
      dispose('data-label-chart')
    }
  }, []);


  const getTradeData = async (symbol: string, start: number, end: number,  period: string = '5m') => {
    setQueryLoading(true);
    try {
      const data = await chart.getKLineHistory({
        symbol: symbol,
        start,
        end,
        period,
      });
      setQueryLoading(false);
      return parserHistoryAndMarks(data);
    } catch (error) {
      setQueryLoading(false);
      return {
        history: [] as (KLineData & KLineDTO)[],
        marks: [] as MarkData[],
      }
    }
  };
  const queryStrategy = async () => {
    const { symbol, time, period} = form.getFieldsValue();
    time[0].set('hour', 0);
    time[0].set('minute', 0);
    time[1].set('hour', 23);
    time[1].set('minute', 59);
    const start = (time[0] as Dayjs).valueOf();
    const end = (time[1] as Dayjs).valueOf();
    localStorage.setItem('start', String(start));
    localStorage.setItem('end', String(end));
    localStorage.setItem('period', period);
    setQueryLoading(true);
    try {
      const { history, marks} = await strategy.analyserResultQuery(symbol, start, end,  period);
      if (chartRef.current) {
        chartRef.current.removeOverlay();
      }
      renderChartData(history, marks);
    } catch (error) {
      //
    }
    setQueryLoading(false);

  }


  const handleFinish = async () => {
    const { symbol, time, period } = form.getFieldsValue();

    time[0].set('hour', 0);
    time[0].set('minute', 0);
    time[1].set('hour', 23);
    time[1].set('minute', 59);
    const start = (time[0] as Dayjs).valueOf();
    const end = (time[1] as Dayjs).valueOf();
    localStorage.setItem('start', String(start));
    localStorage.setItem('end', String(end));
    localStorage.setItem('period', period);
    const { history, marks } = await getTradeData(symbol, start, end, period);
    if (chartRef.current) {
      chartRef.current.removeOverlay();
    }
    renderChartData(history, marks)
  };


  const renderChartData = (list: any[], marks: MarkData[]) => {
    if (chartRef.current) {
      chartRef.current.applyNewData(list, list.length > 0 ? true : false);
      marks.forEach(data => {
        chartRef.current?.createOverlay(getMarkAnnotationParams(data));
      });
      console.log(marks)
    }
  }
  const updateTradeData = async () => {
    const { symbol, time } = form.getFieldsValue();

    const updateList = markersRef.current.map(item => {
      return item;
    });
    setQueryLoading(true);
    try {
      await chart.updateChat(symbol, updateList);
    } catch (error) {
      //
    }
    setQueryLoading(false);
  };
  const handleDataMark = (data = selectBar) => {
    if (data) {
      if (data.time === undefined) {
        console.error('handleDataMark');
      }
      const targetIndex = markersRef.current.findIndex(item => {
        return ((item.time === data.time || (item as any).timestamp === data.timestamp)) && item.id === data.id
      });

      // 更新数据
      if (targetIndex > -1) {
        markersRef.current[targetIndex].is_deleted = data.is_deleted;
      } else {
        markersRef.current.push({
          id: data.id,
          symbol: data.symbol,
          time: data.time,
          label: data.label,
          is_deleted: data.is_deleted
        })
      }
      // 视图更新
      if (data.label === 0) {
        chartRef.current?.removeOverlay({
          name: 'simpleAnnotation',
          id: `${data.symbol}-${data.timestamp}`,
        });
      } else {
        const overlayId = chartRef.current?.createOverlay(getMarkAnnotationParams(data as any));
      }
    }
  }
  const handleCancel = () => {
    setSelectBar(undefined)
    setIsTagModalOpen(false)
  }
  const mark = (label: number) => {
    if (selectBar) {
      const newData = {
        ...selectBar,
        label: label
      }
      handleDataMark(newData)
      setSelectBar(undefined)
      setIsTagModalOpen(false)
    }
  }
  const fillData = async () => {
    const { symbol, time } = form.getFieldsValue();

    const start = (time[0] as Dayjs).valueOf();
    const end = (time[1] as Dayjs).valueOf();
    setQueryLoading(true);
    await chart.fillSymbolMissData(symbol, start, end);
    setQueryLoading(false);
  }
  const uploadLocalFIle = (file: File | null) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (chartRef.current) {
        chartRef.current.removeOverlay();
      }
      try {
        const result = JSON.parse(reader.result as string);
        if (typeof result[0].time === 'string') {
          result.forEach((item: any) => {
            item.timestamp = dayjs(item.time).valueOf();
          })
        }
        const { history, marks } = parserHistoryAndMarks(result as any[]);
        renderChartData(history, marks)
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        const result = transformCSVToJSON(reader.result as string);
        const { history, marks } = parserHistoryAndMarks(result as any[]);
        renderChartData(history, marks)
      }
    };
    if (file) {
      reader.readAsText(file, 'utf-8');
    }
  }
  const exportCSV = () => {
    downloadCSV(chartRef.current?.getDataList() || [], 'data.csv');
  }
  const formLayout = isMobile ? 'horizontal' : 'inline';
  const formItemLayout = formLayout === 'horizontal' ?  {
    labelCol: { span: 4, xs: {span: 4} },
    wrapperCol: { span: 16, xs: {span: 16} },

  } : undefined;

  return (
    <div className={styles.dataLabel}>
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{ symbol: 'ETHUSDT' }}
        onFinish={handleFinish}
        // size={isMobile ? 'small' : 'middle'}
      >
        <Form.Item label="period" name="period" style={{flex: ''}}>
          <Select>
            {['5m', '4h', '1d'].map((item) => (
              <Select.Option value={item} key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="symbol" name="symbol" style={{flex: ''}}>
          <Input placeholder="symbol" />
        </Form.Item>
        <Form.Item label="time" name="time" style={{flex: ''}}>
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Space style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Button loading={queryLoading} type="primary" htmlType="submit">
              查询
            </Button>
            <Button loading={queryLoading} type="primary" onClick={queryStrategy}>
              查询策略数据
            </Button>
            <Access
              accessible={access.canSeeAdmin}
              fallback={<Button
                type="primary"
                disabled
              >
                更新标记
              </Button>}
            >
              <Button
                danger
                loading={queryLoading}
                type="primary"
                onClick={updateTradeData}
              >
                更新标记
              </Button>
            </Access>
            <Access
              accessible={access.canSeeAdmin}
              fallback={<Button
                disabled
              >
                填充缺失数据
              </Button>}
            >
              <Button
                loading={queryLoading}
                onClick={fillData}
              >
                填充缺失数据
              </Button>

            </Access>
            <UploadTrigger onChange={uploadLocalFIle}>
              <Button
                type="primary"
              >
                导入本地JSON
              </Button>
            </UploadTrigger>
            <Button
                type="primary"
                onClick={exportCSV}
              >
                导出CSV
              </Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal centered title="标记" open={isTagModalOpen} onOk={() => handleDataMark()} onCancel={handleCancel}>
        <Space>

          <Button
            loading={queryLoading}
            type="primary"
            onClick={() => mark(1)}
          >
            BUY
          </Button>
          <Button
            loading={queryLoading}
            type="primary"
            onClick={() => mark(-1)}
            danger
          >
            SELL
          </Button>
          <Button
            loading={queryLoading}
            onClick={() => mark(0)}
          >
            Clear
          </Button>
        </Space>

      </Modal>
      <div className='chart' id="data-label-chart" style={{ height: 720 }}>

      </div>
    </div>
  );
};
export default Index;

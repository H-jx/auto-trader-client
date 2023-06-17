import { useEffect, useState, useRef } from 'react';
import { Col, Row, Tabs  } from 'antd';
import type { TabsProps } from 'antd';
import { KLineChartPro } from '@klinecharts/pro';
import { useAccess, Access } from 'umi';
import classNames from 'classnames';
import { CustomDatafeed } from '@/components/KLineChart/CustomDatafeed';
import DepthComponent from '@/components/DepthComponent';
import { LoginGuide } from '@/components/Login';
import { socket } from '@/ws';
import { Depth } from '@/interface/common';
import AutoOrder from '../AutoTrader/Order';
import History from '../AutoTrader/History';
import Exchange from '../AutoTrader/Exchange';
import { isMobile } from '@/utils/bom';
import styles from './index.less';


const HomePage: React.FC = () => {

  const [depth, setDepth] = useState<Omit<Depth, 'symbol' | 'timestamp'>>({
    asks: [],
    bids: [],
  });
  const [tabKey, setTabKey] = useState('auto-order')
  const chartRef = useRef<KLineChartPro>()
  const access = useAccess();

  useEffect(() => {
    if (chartRef.current) {
      return;
    }

    chartRef.current = new KLineChartPro({
      container: document.getElementById('kline-chart-1') as HTMLDivElement,
      // 初始化标的信息
      symbol: {
        exchange: 'BINANCE',
        market: 'cryptocurrency',
        shortName: 'ETHUSDT',
        ticker: 'ETHUSDT',
        priceCurrency: 'usdt',
      },
      drawingBarVisible: isMobile ? false : true,
      // 初始化周期
      period: { multiplier: 5, timespan: 'minute', text: '5m' },
      periods: [{ multiplier: 5, timespan: 'minute', text: '5m' }, { multiplier: 240, timespan: 'minute', text: '4h' }, { multiplier: 24, timespan: 'hour', text: '1d' }],
      // 这里使用默认的数据接入，如果实际使用中也使用默认数据，需要去 https://polygon.io/ 申请 API key
      datafeed: new CustomDatafeed()
    })

    return () => {
      //
    }
  }, [])
  useEffect(() => {
    const handleDepth = (data: Depth) => {
      data.asks = data.asks.sort((a, b) => b['quantity'] - a['quantity']);
      data.bids = data.bids.sort((a, b) => b['quantity'] - a['quantity']);
      setDepth(data);
    }
    socket.on('depth',handleDepth);
    return () => {
      socket.removeListener('depth', handleDepth);
    }
  }, [])
  const onChange = (key: string) => {
    setTabKey(key);
  };
  const items: TabsProps['items'] = [
    {
      key: 'auto-order',
      label: `进行中`,
      children: (
        <Access
          accessible={access.canSeeUser}
          fallback={<LoginGuide></LoginGuide>}
        >
          <AutoOrder></AutoOrder>
        </Access>
      ),
    },
    {
      key: 'history-order',
      label: `历史/挂单`,
      children: (
        <Access
          accessible={access.canSeeUser}
          fallback={<LoginGuide></LoginGuide>}
        >
          <History tabKey={tabKey}></History>
        </Access>
      ),
    },
    {
      key: 'exchange',
      label: `交易所账号配置`,
      children: (
        <Access
        accessible={access.canSeeUser}
        fallback={<LoginGuide></LoginGuide>}
      >
        <Exchange></Exchange>
      </Access>
      ),
    }
  ];
  return (

    <div className={classNames(styles.container, {
      [`${styles.containerMobile}`]: isMobile
    })}>
      <Row>
        <Col xs={{ span: 24}} lg={{ span: 19, offset: 0 }}>
          <div  style={{ maxWidth: window.innerWidth, overflow: 'hidden'}}>
            <div id="kline-chart-1" style={{height: 620, marginRight: 6, minWidth: 400}}>

            </div>
          </div>
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 5, offset: 0 }}>
          <div>
            <DepthComponent data={depth.asks} type="asks" height={266}></DepthComponent>

            <DepthComponent data={depth.bids} type="bids" height={266}></DepthComponent>
          </div>
        </Col>

      </Row>

      <Tabs activeKey={tabKey} items={items} onChange={onChange} />
    </div>

  );
};

export default HomePage;

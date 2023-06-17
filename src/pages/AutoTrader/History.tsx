import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Table, Button, message } from 'antd';
import { trade } from '@/api';
import './index.less';

const prefixCls = `auto-order-history`;

const AutoOrder: React.FC<{tabKey: string}> = (props) => {

  const [autoOrderHistoryList, setAutoOrderHistoryList] = React.useState<any[]>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    current: 1,
    defaultPageSize: 10,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (props.tabKey === 'history-order') {
      queryAutoOrderHistory(pagination);
    }
  }, [props.tabKey]);

  function queryAutoOrderHistory(pagination: any) {
    trade.queryOrderHistory(pagination).then(data => {
      setAutoOrderHistoryList(data.list);
      if (data.pagination) {
        setPagination(data.pagination as any);
      }
    });
  }

  const columns = [
    {
      title: 'symbol',
      key: 'symbol',
      dataIndex: 'symbol',
    },
    {
      title: 'price',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: 'amount',
      key: 'amount',
      dataIndex: 'amount',
    },
    {
      title: 'action',
      key: 'action',
      dataIndex: 'action',
    },
    {
      title: 'order_type',
      key: 'order_type',
      dataIndex: 'order_type',
    },
    {
      title: 'status',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'datetime',
      key: 'datetime',
      dataIndex: 'datetime',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      render: (text: string, record: any, index: number) => {
        if (record.status !== 'NEW') {
          return null;
        }
        return (
          <div>
            <Button
              type="text"
              onClick={() => {
                trade
                  .cancelOrder({
                    symbol: record.symbol,
                    id: record.id,
                  })
                  .then(data => {
                    message.success('取消成功');
                    queryAutoOrderHistory(pagination);
                  });
              }}
            >
              取消订单
            </Button>
          </div>
        );
      },
    },
  ];
  function handlePageChange(page: number, pageSize?: number) {
    const newPagination = {
      ...pagination,
      current: page,
    };
    if (pageSize) {
      newPagination.pageSize = pageSize;
    }
    queryAutoOrderHistory(newPagination);
    setPagination(newPagination);
  }
  return (
    <div className={classnames(prefixCls)}>
      <Table
        columns={columns}
        dataSource={autoOrderHistoryList}
        pagination={{
          onChange: handlePageChange,
          ...pagination,
        }}
      />
    </div>
  );
};
export default AutoOrder;

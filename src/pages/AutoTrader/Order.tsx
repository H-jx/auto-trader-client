import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, message, Switch, Select, Button, Table, InputNumber } from 'antd';

import { AutoOrderConfig } from '@/interface/trade';
import { trade } from '@/api';


const orderTypeOptions = [
  {
    value: 'futures',
    label: 'U本位',
  },
  {
    value: 'delivery',
    label: '币本位',
  },
  {
    value: 'spot',
    label: '现货',
  },
];
const markTypeOptions = [
  {
    value: 'MARKET',
    label: '市价',
  },
  {
    value: 'LIMIT',
    label: '限价',
  },
];
const leverRateOptions = [
  {
    value: 2,
    label: '2',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 60,
    label: '60',
  },
];
const initFormValues = {
  id: undefined,
  exchange: 'binance',
  order_type: 'futures',
  mark_type: 'LIMIT',
  enabled: true,
  lever_rate: 20,
  config: '',
}
const AutoOrder: React.FC<any> = () => {
  const [form] = Form.useForm<Partial<AutoOrderConfig>>();
  const [orderList, setOrderList] = useState<AutoOrderConfig[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectOrder, setSelectOrder] = useState<AutoOrderConfig | undefined>();

  useEffect(() => {
    getList();
  }, []);
  function getList() {
    setLoading(true)
    trade.querySymbolOrderConfigList().then(list => {
      setOrderList(list);
    }).finally(() => {
      setLoading(false)
    });
  }
  function postAutoOrder(postData: AutoOrderConfig) {
    // postData.config = postData.config;
    postData.enabled = Boolean(postData.enabled)
    setLoading(true)

    return trade.postSymbolOrderConfig(postData).then(data => {
      const newAutoOrderConfigList = [...orderList];

      if (postData.id) {
        const index = newAutoOrderConfigList.findIndex(
          row => row.id === postData.id,
        );
        if (index > -1) {
          newAutoOrderConfigList[index] = {
            ...newAutoOrderConfigList[index],
            ...postData,
          };
        }
      } else {
        newAutoOrderConfigList.push({
          ...data,
        });
      }
      setOrderList(newAutoOrderConfigList);
    }).finally(() => {
      setLoading(false)
    });
  }
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectOrder) {
        values.id = selectOrder.id
      }
      const msg = values.id ? '更新成功' : '提交成功';
      if (values.id) {
        postAutoOrder(values as AutoOrderConfig);
      } else {
        postAutoOrder(values as AutoOrderConfig);
      }
      message.success(msg);
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.log(error)
    }
  };
  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const handleAdd = () => {
    setVisible(true);
  };
  const handleDelete = (record: AutoOrderConfig) => {
    if (record.id) {
      trade.removeSymbolOrderConfig(record.id).then(data => {
        message.success('删除成功');
        getList();
      });
    }
  };
  const handleEdit = (record: AutoOrderConfig) => {

    setVisible(true);
    setSelectOrder(record);
    console.log(record)
    form.setFieldsValue(record);
  };
  const callAction = async (action: "BUY" | "SELL" | "ALL", record: AutoOrderConfig) => {
    setLoading(true)
    if (action === 'ALL') {
      await trade.closeAllOrder(record.symbol);
    } else {
      const positionSide = action === 'BUY' ? 'LONG' : 'SHORT';
      await trade.safeOrder(record.symbol, action as "BUY" | "SELL", positionSide)
    }
    message.success('成功');
    setLoading(false)
  };
  const columns = [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      width: 80,
    },
    {
      title: 'enabled',
      dataIndex: 'enabled',
      width: 60,
      render: (_: any, record: AutoOrderConfig) => (
        <Switch checked={record.enabled} disabled />
      ),
    },
    {
      title: 'Market',
      dataIndex: 'mark_type',
      width: 90,
    },
    {
      title: 'OrderType',
      dataIndex: 'order_type',
      width: 90,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: 80,
      render: (_: any, record: AutoOrderConfig) => {
        if (record.order_type === 'spot') {
          return <pre>
            买: {record.buy_usdt}
            卖: {record.sell_usdt}
          </pre>
        }
        return (
          <code>
            <pre>开多: {record.open_long} 平多: {record.close_long}</pre>
            <pre>开空: {record.open_short} 平空: {record.close_short}</pre>
          </code>
        )
      },
    },
    {
      title: 'lever',
      dataIndex: 'lever_rate',
      width: 40,
    },
    {
      title: 'Action',
      fixed: 'right' as const,
      width: 200,
      render: (_: any, record: AutoOrderConfig) => {
        return (
          <>
            <Button  type="link" onClick={handleEdit.bind(null, record)}  >
              编辑
            </Button>
            |<Button type="text" onClick={callAction.bind(null, 'BUY', record)}  >
              追多
            </Button>
            |<Button type="text" onClick={callAction.bind(null, 'SELL', record)}  >
              追空
            </Button>
            |<Button danger type="text" onClick={callAction.bind(null, 'ALL', record)}  >
              平单
            </Button>
            |<Button danger type="text" onClick={handleDelete.bind(null, record)}  >
              删除
            </Button>
          </>
        )
      },
    },
  ];
  return (
    <div style={{maxWidth: '100%', overflow: 'hidden'}}>
      <Modal
        open={visible}
        title="订单新增/编辑"
        okText="确定"
        cancelText="取消"
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="horizontal" initialValues={initFormValues}>
          <Form.Item name="enabled" label="开关" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            name="order_type"
            label="Order type"
            rules={[{ required: true }]}
          >
            <Select>
              {
                orderTypeOptions.map((item) => (
                  <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
            <Input placeholder='ETHUSDT' />
          </Form.Item>

          {
            form.getFieldValue('order_type') === 'spot' ? (
              <>
                <Form.Item
                  name="buy_usdt"
                  label="Buy USDT"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
                <Form.Item
                  name="sell_usdt"
                  label="Sell USDT"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="open_long"
                  label="开多"
                  rules={[{ required: true }]}
                >
                  <InputNumber  />
                </Form.Item>
                <Form.Item
                  name="close_long"
                  label="平多"
                  rules={[{ required: true }]}
                >
                  <InputNumber  />
                </Form.Item>
                <Form.Item
                  name="open_short"
                  label="开空"
                  rules={[{ required: true }]}
                >
                  <InputNumber  />
                </Form.Item>
       
                <Form.Item
                  name="close_short"
                  label="平空"
                  rules={[{ required: true }]}
                >
                  <InputNumber type="number" />
                </Form.Item>
              </>
            )
          }

          <Form.Item
            name="mark_type"
            label="Market type"
            rules={[{ required: true }]}
          >
            <Select>
              {markTypeOptions.map((item) => (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="lever_rate"
            label="Leverage rate"
            rules={[{ required: true, type: 'number' }]}
          >
             <Select>
              {leverRateOptions.map((item) => (
                <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="config" label="参数配置">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={handleAdd} loading={loading} size="small">
        新增
      </Button>
      <Table
        dataSource={orderList}
        columns={columns}
        size="small"
        rowKey="id"
      />
    </div>
  );
};
export default AutoOrder
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Table, Button, message, Form, Input, Modal } from 'antd';

// import { PlusOutlined } from '@ant-design/icons';
import { trade } from '@/api';
import { TradeAccountDto } from '@/interface/trade';
import { KEYS } from '@/constants';


const prefixCls = `trade-account`;

const TradeAccount: React.FC<object> = () => {
  const [form] = Form.useForm<Partial<TradeAccountDto>>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tradeAccountList, setTradeAccountList] = React.useState<
    TradeAccountDto[]
  >([]);

  useEffect(() => {
    getWatchSymbol();
  }, []);

  function getWatchSymbol() {
    setLoading(true)
    trade.queryTradeAccount().then(data => {
      setTradeAccountList(
        data.map((item: Record<string, any>) => {
          let access_key = item.secret_key;
          let secret_key = item.access_key;
          // Object.assign(item, {
          //   [KEYS['access_key']]: data[KEYS['access_key']],
          //   [KEYS['access_key']]: data[KEYS['secret_key']],
          // })
          item.secret_key = secret_key;
          item.access_key = access_key;
          return item;
        }),
      );

    }).finally(() => {
      setLoading(false);
    });
  }
  function postTradeAccount(postData: TradeAccountDto) {
    const { access_key, secret_key } = postData;
    postData.access_key = access_key;
    postData.secret_key = secret_key;
    trade.postTradeAccount(postData).then(data => {
      // const newTradeAccountList = [...tradeAccountList];
      const msg = postData.id ? '更新成功' : '提交成功';

      getWatchSymbol();
      message.success(msg);
    });
  }
  async function handleSubmit() {
    try {
      const values = form.getFieldsValue();
      await postTradeAccount(values as TradeAccountDto);
      setVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      console.error(errorInfo)
    }
  }
  const handleAdd = () => {
    setVisible(true);
  };
  function handleCancel() {
    setVisible(false);
    form.resetFields();
  }
  const columns = [
    {
      title: '交易所',
      key: 'exchange',
      dataIndex: 'exchange',
    },
    {
      title: 'access_key',
      key: 'access_key',
      dataIndex: 'access_key',
    },
    {
      title: 'secret_key',
      key: 'secret_key',
      dataIndex: 'secret_key',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 200,
      render: (text: string, record: any, index: number) => (
        <div key={index}>
          <Button type="primary" onClick={() => {
            setVisible(true);
            form.setFieldsValue(record);
          }}>
            编辑
          </Button>
          |
          <Button
            danger
            type="text"
            onClick={() => {
              setLoading(true)
              trade.removeTradeAccount(record.id).then(data => {
                message.success('删除成功');
                getWatchSymbol();
                setLoading(false)
              });
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={classnames(prefixCls)} style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Modal
        open={visible}
        title="账号新增/编辑"
        okText="确定"
        cancelText="取消"
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="horizontal" initialValues={{
          exchange: 'binance',
        }}>
          <Form.Item name="exchange" label="交易所" rules={[{ required: true }]}>
            <Input placeholder='binance' />
          </Form.Item>
          <Form.Item name="access_key" label="access_key" rules={[{ required: true }]}>
            <Input placeholder='' />
          </Form.Item>
          <Form.Item name="secret_key" label="secret_key" rules={[{ required: true }]}>
            <Input placeholder='' />
          </Form.Item>
          <Form.Item name="trade_password" label="交易密码" >
            <Input placeholder='' disabled />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={handleAdd} loading={loading} size="small">
        新增
      </Button>
      <Table columns={columns} dataSource={tradeAccountList} rowKey="id" />
    </div>
  );
};
export default TradeAccount;

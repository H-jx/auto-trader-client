import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Table, Button, message, Form, Input, Modal } from 'antd';

import { watchSymbol } from '@/api';


interface SymbolItem {
  id: string;
  symbol: string;
}
const prefixCls = `watch-symbol`;

const WatchSymbol: React.FC<object> = (props) => {
  const [form] = Form.useForm<Partial<SymbolItem>>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [symbolList, setData] = React.useState<SymbolItem[]>([]);

  useEffect(() => {
    getWatchSymbol();
  }, []);

  function getWatchSymbol() {
    setLoading(true)
    watchSymbol.query()
    .then(data => {
      setData(data);
    }).finally(() => {
      setLoading(false)
    });
  }
  function postWatchSymbol(value: string) {
    setLoading(true)
    watchSymbol.create(value).then(data => {
      const newSymbolList = [...symbolList];
      newSymbolList.push(data);
      setData(newSymbolList);
      message.success('提交成功');
    }).finally(() => {
      setLoading(false)
    });
  }
  async function handleSubmit() {
    try {
      const values = form.getFieldsValue();
      if (values.symbol) {
        await postWatchSymbol(values.symbol);
      }
      setVisible(false);
      form.resetFields();
    } catch (errorInfo) {
      console.error(errorInfo)
    }
  }
  function handleCancel() {
    setVisible(false);
    form.resetFields();
  }
  const handleAdd = () => {
    setVisible(true);
  };
  const columns = [
    {
      title: 'SYMBOL',
      key: 'symbol',
      dataIndex: 'symbol',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <a
          key="delete"
          onClick={() => {
            watchSymbol.remove(record.id).then(data => {
              message.success('删除成功');
              getWatchSymbol();
            });
          }}
        >
          删除
        </a>
      ),
    },
  ];
  return (
    <div className={classnames(prefixCls)}>
      <Modal
        open={visible}
        title="增加SYMBOL"
        okText="确定"
        cancelText="取消"
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
      >
        <Form form={form} layout="horizontal" initialValues={{
          exchange: 'binance',
        }}>
          <Form.Item name="symbol" label="symbol" rules={[{ required: true }]}>
            <Input placeholder='ETHUSDT' />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={handleAdd} loading={loading} size="small">
        新增
      </Button>
      <Table columns={columns} dataSource={symbolList} rowKey={'id'} />
    </div>
  );
};
export default WatchSymbol;

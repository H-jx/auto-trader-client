import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Table, Button, message, Form, Input, Modal } from 'antd';
import { useModel, useNavigate } from 'umi'
import { user } from '@/api';


interface SymbolItem {
  id: string;
  symbol: string;
}
const prefixCls = `watch-symbol`;

const Invite: React.FC<object> = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<Partial<SymbolItem>>();
  const [loading, setLoading] = useState(true);
  const [list, setList] = React.useState<{inviteCode: string}[]>([]);

  useEffect(() => {
    getInviteCode();
  }, []);

  function getInviteCode() {
    setLoading(true)
    user.getInviteCode()
    .then(data => {
      setList(data.map((item: string) => ({inviteCode: item})));
    }).finally(() => {
      setLoading(false)
    });
  }
  function createInviteCode() {
    setLoading(true)
    user.createInviteCode().then(() => {
      getInviteCode();
      message.success('成功');
    }).finally(() => {
      setLoading(false)
    });
  }
 function jumpToInvitePage(code: string) {
    navigate(`/login?inviteCode=${code}`)
  }

  const columns = [
    {
      title: 'inviteCode',
      dataIndex: 'inviteCode',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: {inviteCode: string}) => (
        <a
          key="delete"
          onClick={() => {
            jumpToInvitePage(record.inviteCode)
          }}
        >
          {record.inviteCode}
        </a>
      ),
    },
  ];
  return (
    <div className={classnames(prefixCls)}>
      <Button type="primary" onClick={createInviteCode} loading={loading} size="small">
        新增
      </Button>
      <Table columns={columns} dataSource={list} rowKey={'id'} />
    </div>
  );
};
export default Invite;

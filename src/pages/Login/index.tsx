import React from 'react';
import classnames from 'classnames';
import { Form, Input, Button } from 'antd';
import { parse } from 'query-string';
import { login, user } from '@/api';
import { useModel, useNavigate } from 'umi'
import './index.less';


interface FormData {
  username: string;
  password: string;
}
const prefixCls = `login`;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const Index: React.FC = () => {

  const navigate = useNavigate();
  const { initialState, error, refresh, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = React.useState(false);
  // 使用history
  const query = parse(window.location.search);
  const isSignIn = query.inviteCode ? true : false;
  const onFinish = async (values: Partial<FormData>) => {
    const { username, password } = values;
    if (username === undefined || password === undefined) {
      return;
    }
    setLoading(true)
    try {
      if (isSignIn) {
        await user.createUser(username, password, query.inviteCode as string);
      } else {
        const data = await login.loginAccount({
          userName: username,
          password: password,
        });
        setInitialState({
          ...initialState,
          name: data.user,
          role: data.role,
        })
        
      }
      setTimeout(() => {
        setLoading(false)
        navigate(query.path as string ? query.path as string : '/', { replace: true });
      }, 1000);

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const onFinishFailed = (errorInfo: Record<string, any>) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={classnames(prefixCls)}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item {...tailLayout}>
          {
            isSignIn ? 
            <Button loading={loading} type="primary" htmlType="submit">
              Sign in
            </Button>:
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          }

        </Form.Item>
      </Form>
    </div>
  );
};
export default Index;

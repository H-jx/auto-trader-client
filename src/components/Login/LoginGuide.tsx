import { Layout, Button, Row, Col } from 'antd';
import { useNavigate, Outlet, useModel } from 'umi';

const LoginGuide: React.FC<any> = () => {
  const navigate = useNavigate();
  const toLogin = () => {
    navigate(`/login?path=${window.location.pathname}`);
  };
  return (
    <div
      style={{
        height: '100%',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button type="primary" onClick={toLogin} style={{ width: 200 }}>
        登录
      </Button>
    </div>
  );
};

export default LoginGuide;

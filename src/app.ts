// 运行时配置
import { user, login } from './api'
import { User } from './interface/common';
import { getRightRenderContent } from './components/layout/rightRender';
import './assets/reset.css';
import '@klinecharts/pro/dist/klinecharts-pro.css'

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Partial<User>> {
  try {
    const userInfo = await user.queryCurrent()
    return {
      userid: userInfo.userid,
      name: userInfo.user,
      role: userInfo.role,
    };
  } catch (error) {
    return {
      name: '',
    }
  }
}

export const layout = () => {
  return {
    logo: '//minio.8and1.cn/static/auto-trader/auto-trader-logo.png',
    menu: {
      locale: false,
    },
    title: 'Auto Trader',
    layout: 'top',
    contentStyle: {
      padding: 8,
    },
    rightContentRender: getRightRenderContent,
  };
};

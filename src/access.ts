import { User } from "./interface/common";

export default (initialState: User) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const canSeeAdmin = initialState.role === 0;
  const canSeeUser = initialState.name !== '';
  return {
    canSeeUser,
    canSeeAdmin
  };
};

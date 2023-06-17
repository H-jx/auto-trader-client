import request, { checkResult } from '@/utils/request';

export function query() {
  return request({
    url: '/users',
  });
}

export function queryCurrent() {
  return checkResult(
    request({
      url: '/user/currentUser',
    }),
  );
}

export function createUser(userName: string, password: string, inviteCode: string) {
  return checkResult(
    request({
      url: '/user/create',
      method: 'POST',
      data: { userName, password, inviteCode },
    }),
  );
}

export function getInviteCode() {
  return checkResult(
    request<string[]>({
      url: '/user/invite-code',
    }),
  );
}
export function createInviteCode() {
  return checkResult(
    request({
      url: '/user/invite-code',
      method: 'POST',
    }),
  );
}
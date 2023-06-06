import {httpGet} from '@app/network';

// 登录
export const checkAppVersion = data  =>{
  return httpGet('/user/checkAppversion', data);
} 

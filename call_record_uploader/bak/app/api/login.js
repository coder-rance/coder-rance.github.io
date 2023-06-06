import {httpPost,httpGet} from '@app/network';

// 登录
export const checkLogin = data  =>{
  return httpPost('/user/checkLogin', data);
} 
//获取配置
export const getBaseConfig =()=>{
  return httpGet('/config/config');
} 

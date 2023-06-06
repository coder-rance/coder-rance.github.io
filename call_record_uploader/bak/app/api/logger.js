import {httpPost} from '@app/network';

// 登录
export const writeInfoLog = data  =>{
  return httpPost('/Log/writeInfoLog', data);
} 

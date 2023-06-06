import { httpPost } from '@app/network';

// 获取通讯录
export const getContactsLists = data => {
  return httpPost('/record/getContactsLists', data);
} 

// 获取所有录音
export const getCallRecord = data => {
  return httpPost('/record/getCallRecord', data);
} 

// 上传通话记录
export const saveCallRecord = data => {
  return httpPost('/record/saveCallRecord', data);
} 


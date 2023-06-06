import { httpPost } from '@app/network';

// 登录
export const tasksByID = data => {
  return httpPost('/task/tasksByID', data);
} 

// 收到任务
export const receiveTask = data => {
  return httpPost('/task/receiveTask', data);
} 

// 确认任务
export const confirmTask = data => {
  return httpPost('/task/confirmTask', data);
} 



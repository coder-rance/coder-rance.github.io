import { httpGet } from '@app/network';

// 获取所有站点
export const getOrgs = data => {
  return httpGet('/orgCar/orgs', data);
} 

// 获取站点车辆
export const getCarsByOrg = data => {
  return httpGet('/orgCar/carsByOrg', data);
} 
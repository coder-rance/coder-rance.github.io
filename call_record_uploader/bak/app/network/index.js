import axios from 'axios';
import store from '@app/store';

// 超时时间  默认10000ms
const timeout = 10000;
// 前端数据格式： (json/urlencoded)  默认json
// token
const getToken = _ => '';

// 对返回成功结果处理
const resolveSuccess = res => { 
  return res.data;
};

// 对返回失败结果处理
const resolveError = (err) => {
  return Promise.reject(err);
};

const setInterceptor = (instance, url) => {
  // 请求拦截
  instance.interceptors.request.use((config) => {
    return config; // 只是扩展请求的配置
  });

  // 响应拦截
  instance.interceptors.response.use((res) => {
    //对返回成功结果处理
    return resolveSuccess(res);
  }, (err) => {
    // 对返回失败结果处理
    return resolveError(err);
  })
}

// 通过request方法来进行请求操作
const request = async (options) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  options.cancelToken= source.token,

  store.getState()
  // console.log('axios请求:', options);
  let instance = axios.create();

  instance.defaults.headers.post['Content-Type'] = 'application/json';
  instance.defaults.headers.post['Authorization'] = 'Bearer ' + getToken();

  setInterceptor(instance, options.url);

  let timer = setTimeout(() => {
    source.cancel('Operation canceled by the user.');
    clearTimeout(timer);
  }, timeout);
  return instance(options); // 产生的是一个 promise  axios()
}

export const httpGet = async (url, params = {}) => {
  const baseURL = store.getState().serverURL;
  const method = 'get';
  
  return request({
    url,
    baseURL,
    timeout,
    params,
    method,
  });

}

export const httpPost = async (url, data = {}) => {
  const baseURL = store.getState().serverURL;
  const method = 'post';

  return request({
    url,
    baseURL,
    timeout,
    data,
    method,
  });
}

/**
 * 
 * 请求示例： 下面的返回值都是Promise实例
 * 1.使用vuex中配置的baseURL
 * 1.1 get方式    
 * import axios from '@network';
 * 
 * axios.get('/api/getList', {
 *  params: {
 *    page:1,
 *    rows:10
 *  }
 * });
 * 
 * 1.2 post方式
 * import axios from '@network';
 * 
 * axios.post('/api/getList', {
 *  page:1,
 *  rows:10
 * });
 * 
 * 2.临时使用某个第三方baseURL
 * 
 * axios.request({
 *  baseURL: 'http://192.168.10.15:7977',
 *  url: '/api/getUserInfo',
 *  method: 'post',
 *  data: {
 *    id: 19,
 *    name: 'rance',
 *  },
 * });
 * 
 */
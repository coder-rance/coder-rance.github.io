//核心库
import {
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import {showTopMessage} from '@app/utils/toast';
import dayjs from 'dayjs';
// import { useSelector} from 'react-redux';
/********************************事件回调 start******************************************/


// 登录MQ
const loginack = data => {
  const isLogin = data.isLogin ? 0 : 1;
  const UserId = data.UserId;
  // let msg = isLogin == 0 ? '登录MQ成功' : '登录MQ失败,请检查网络';

  NativeModules.MqEventBss.SubscripRmq(UserId);
};

// 登出MQ
const logoutack = data => {
  DeviceEventEmitter.emit('logoutack', data);
};

// 任务状态变化
const bss5002 = data => {
  console.log('bss5002',data);
  DeviceEventEmitter.emit('bss5002', data);
  // showTopMessage('bss5002');
};

// 新任务
const bss5004 = data => {
  console.log('bss5004',data);
  DeviceEventEmitter.emit('bss5004', data);
  // showTopMessage('bss5004');
};

// 任务取消
const bss5009 = data => {
  console.log('bss5009',data);
  DeviceEventEmitter.emit('bss5009', data);
  // showTopMessage('bss5009');
};

const error = data => {
  console.log('bss-error', data)
  DeviceEventEmitter.emit('error', data);
};

const loginfo = data => {
  DeviceEventEmitter.emit('loginfo', data);
};

const SubscripRmqack = data => {
  DeviceEventEmitter.emit('SubscripRmqack', data);
};

const getimeiack = data => {
  DeviceEventEmitter.emit('getimeiack', data);
};

// 版本升级
const upgradeappack = data => {
  console.log('upgradeappack:' + JSON.stringify(data));
  if (!data.isupgrade && data.code == 0) {
    showTopMessage("已经是最新版本,不需要更新！");
  }
  else if (data.code == -1) {
    showTopMessage("版本检查出错，请重试！");
  }
  else if (data.code == -2) {
    showTopMessage("服务地址为空！");
  }else{ 
    showTopMessage("版本检查出错，请重试！");
  }
};

/********************************事件回调 end******************************************/

// 获取IMEI
export const Native_GetIMEI = () => {
  NativeModules.MqEventBss.GetIMEI();
}

// 提醒
export const Native_NotifyMsg = (msg) => {
  const content = `状态，${msg} ${dayjs().format('YYYY-MM-DD hh:mm:ss')}`;
  NativeModules.MqEventBss.NotifyMsg("外勤通", content);
};

// 登入MQ
export const Native_LoginInMQ = (config) => {
  config = JSON.stringify(config);
  console.log('config......',config);
  NativeModules.MqEventBss.LoginServer(config);
};

// 登出MQ
export const Native_LoginOutMQ = (userId) => {
  NativeModules.MqEventBss.LoginOutServer(userId);
}

// 自动订阅
export const Native_Subscribe = (userInfo, bindInfo, serverURL,flag)=>{

  if (bindInfo?.station?.name && bindInfo?.vehicle?.name) {
    const config = {
      MQServerIP: userInfo.MQServerIP,
      MQServerPort: userInfo.MQServerPort,
      MQLoginName: userInfo.MQLoginName,
      MQLoginPwd: userInfo.MQLoginPwd,
      Userid: userInfo.UserId,
      Tel: bindInfo.vehicle.id,
      Username: userInfo.UserName,
      //Username:bindInfo.vehicle.name,
      ServerUrl: serverURL,
      XZBM:userInfo.XZBM
    };
  if(!flag){
    Native_LoginOutMQ(userInfo.UserId);
  }

  
    let timer = setTimeout(() => {
      Native_LoginInMQ(config);
      clearTimeout(timer);
    }, 500);
  }0
}

// 检查更新
export const Native_CheckUpdate = (serverURL) => {
  console.log('serverURL',serverURL);
  const data = JSON.stringify({
    serverurl: serverURL
  });
  NativeModules.MqEventBss.UpgradeAppVersion(data);
}

// 订阅MQ原生Android消息
export const Native_MQListener = () => {
  
  const map = new Map([
    ['loginack', loginack],
    ['logoutack', logoutack],
    ['bss5002', bss5002],
    ['bss5004', bss5004],
    ['bss5009', bss5009],
    ['error', error],
    ['loginfo', loginfo],
    ['SubscripRmqack', SubscripRmqack],
    ['getimeiack', getimeiack],
    ['upgradeappack', upgradeappack],
  ]);

  let eventBssSubscriber = DeviceEventEmitter.addListener(
    'EventBss',
    e => {
      const eventData = JSON.parse(e.eventData);
      const commandID = eventData.CommandID;
      const data = eventData.objData;

      if (map.has(commandID)) {
        console.log(`收到来自原生安卓${commandID}消息：`, e.eventData);
        map.get(commandID)(data);
      }
    },
  );

  return eventBssSubscriber;
};
import { ToastAndroid, PermissionsAndroid, BackHandler } from 'react-native';

export const requestPermission = async () => {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,//读通话记录
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS, //通讯录 
      PermissionsAndroid.PERMISSIONS.CALL_PHONE, //打电话
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE, //读取电话状态
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //录音
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, //读写存储
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, //读写存储
    ];
    const granted = await PermissionsAndroid.requestMultiple(
      permissions,
    );

    if (
      granted['android.permission.READ_CALL_LOG'] === 'granted' &&
      granted['android.permission.READ_CONTACTS'] === 'granted' &&
      granted['android.permission.CALL_PHONE'] === 'granted' &&
      granted['android.permission.READ_PHONE_STATE'] === 'granted' &&
      granted['android.permission.RECORD_AUDIO'] === 'granted' &&
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted'
    ) {
      ToastAndroid.show('已获取所有权限', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('授予所有权限后，方可使用外勤通', ToastAndroid.SHORT);
      return new Promise((resolve)=>{
        let timer = setTimeout(() => {
          resolve();
          BackHandler.exitApp();
          clearTimeout(timer);
        }, 3000);
      });
    }
  } catch (err) {
    console.log(err);
    ToastAndroid.show('权限异常，即将退出外勤通', ToastAndroid.SHORT);
    return new Promise((resolve)=>{
      let timer = setTimeout(() => {
        resolve();
        BackHandler.exitApp();
        clearTimeout(timer);
      }, 3000);
    });
  }
};
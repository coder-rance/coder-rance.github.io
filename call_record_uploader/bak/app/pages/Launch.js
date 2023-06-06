// 启动页
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { getData,storeData } from '@app/utils/storage';
import { useSelector, useDispatch } from 'react-redux';
import { requestPermission } from '@app/utils/android-permission';
import { phoneRecordPath } from '@app/utils/phone-config';
import {getBrand} from 'react-native-device-info';
import {getBaseConfig} from "@app/api/login"

const banner = require("@app/assets/img/banner.png");

export default function LaunchPage({ launchEnd }) {
  // const [latencyTime] = useState(1000);
  const dispatch = useDispatch();
  useEffect(() => {
     loadStorage(); // 启动动画播放完毕
  }, []);

  const getConfig= async()=>{
    try{
      const config= await getBaseConfig();
      console.log('config.data.VIDEOTIME',config,config.data.VIDEOTIME);
      await storeData('$serverSec',config.data.VIDEOTIME)
    }catch(err){
      console.log(err);
    }
  }

  const getRecordPathByBrand = ()=>{
    try {
      const brand = getBrand().toUpperCase();
      return phoneRecordPath[brand] ? phoneRecordPath[brand] : '';
    } catch (err) { 
      console.log(err);
      return '';
    }
  };

  // 加载本地缓存到redux
  const loadStorage = async () => {
    try {
      await requestPermission();
      const serverURL = await getData('$serverURL');
      const serverSec = await getData('$serverSec');
      const loginInfo = await getData('$loginInfo');
      const bindInfo = await getData('$bindInfo');
      const recordPath = await getData('$recordPath');
      const recordPathByBrand = getRecordPathByBrand();
   
      dispatch({
        type: 'setServerURL',
        data: serverURL == null ? '' : serverURL,
      });

      dispatch({
        type: 'setServerSec',
        data: serverSec == null ? '' : serverSec,
      });

      dispatch({
        type: 'setLoginInfo',
        data: loginInfo == null ? {} : loginInfo,
      });

      dispatch({
        type: 'setBindInfo',
        data: bindInfo == null ? {} : bindInfo,
      });
      dispatch({
        type: 'setRecordPath',
        data: recordPath == null ? recordPathByBrand : recordPath,
      });

      console.log(`本地: 
      serverURL: ${serverURL}
      serverSec:${serverSec}
      loginInfo: ${JSON.stringify(loginInfo)}
      bindInfo: ${JSON.stringify(bindInfo)}
      recordPathByBrand: ${JSON.stringify(recordPathByBrand)}
      recordPath: ${JSON.stringify(recordPath)}
      `);
      let timer = setTimeout(() => {
        console.log('动画结束',launchEnd);
        launchEnd(true);
        clearTimeout(timer);
      }, 1000);
      getConfig();
    } catch (err) {
      console.log(err)
    } finally {

    }

  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image style={styles.cover} resizeMode='cover' source={banner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: '#fff'
  },
  cover: {
    flex: 1,
  }
});




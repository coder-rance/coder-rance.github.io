import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ZitHeader, ZitDialog } from '@app/components';
import { AvatarInfo } from './Me/AvatarInfo';
import { ZitListItem } from '@app/components';
import { getVersion } from 'react-native-device-info';
import { storeData } from '@app/utils/storage';
import { showTopMessage } from '@app/utils/toast';
import { Native_LoginOutMQ, Native_CheckUpdate } from '@app/mq';
import {getLatestCallInfo} from '@app/common/utils';

export function Me({ navigation }) {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const bindInfo = useSelector(state => state.bindInfo);
  const serverURL = useSelector(state => state.serverURL);
  const userInfo = useSelector(state => state.userInfo);
  const flag = useSelector(state => state.flag)
  const dispatch = useDispatch();

  useEffect(() => {
  
  }, []);

  // 前往设置
  const setting = () => {
    navigation.navigate('Setting');
  };

  // 测试
  const test = () => {
    DeviceEventEmitter.emit('bss5004', {
      "dtDataTime": "2022-07-07 16:43:49.819",
      "TEL": "18106721348",
      "LSH_Split": "20221010330301000007",
      "LSH": "20221010330301000007",
      "LSH_XH": "20221010330301000007:1",
      "CCXH": "1",
      "XX": "jfkldsjfklsajfdkl(鹿城区)/常规急救-非创伤-头晕-眩晕(未知)//不详",
      "LXDH": "16621092548",
      "LD": "16621092548",
      "JD": "",
      "WD": "",
      "JCDZ": "jfkldsjfklsajfdkl(鹿城区)",
      "KJDZ": "",
      "FBDZ": "",
      "HCYY": "常规急救-非创伤-头晕/眩晕(未知)",
      "XM": "",
      "XB": "不详",
      "NL": ""
    });
  }

  // 退出登录
  const logOut = () => {
    Native_LoginOutMQ(userInfo.UserId);
    // 清除本地绑定车辆信息
    storeData('$bindInfo', {});
    // 清除本地的登录信息
    storeData('$loginInfo', {});
    dispatch({
      type: 'setUserInfo',
      data: {},
    });
    dispatch({
      type: 'setBindInfo',
      data: {},
    });
    dispatch({
      type: 'setLoginInfo',
      data: {},
    });
    dispatch({
      type:'setFlag',
      data: false
    })
    setLogoutVisible(false);
    navigation.navigate('Login');
  };

  // 更新版本
  const checkUpdate = () => {
    console.log('版本',getVersion());
    Native_CheckUpdate(serverURL);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title=""
      />
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          console.log('first');
        }}>
          <AvatarInfo
            account={userInfo.Account}
            typeName={userInfo.TYPENAME}
            userName={userInfo.UserName}
            phoneNumber={userInfo.PHONE_NUM}
          />
        </TouchableOpacity>
        <View style={{ marginTop: 10, }}>
          <ZitListItem title='车载电话' content={bindInfo.vehicle?.id || <Text style={{ color: '#E6A23C' }}>请先绑定车辆</Text>}></ZitListItem>
          <ZitListItem title='车辆名称' content={bindInfo.vehicle?.name || <Text style={{ color: '#E6A23C' }}>请先绑定车辆</Text>}></ZitListItem>
          <ZitListItem title='最近登录时间' content={userInfo.LogTime}></ZitListItem>
          <ZitListItem title='关于' content={'版本 '+getVersion()}></ZitListItem>
        </View>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={setting}
        >
          <ZitListItem title='更多信息'  showIcon={true} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={checkUpdate}
        >
          <ZitListItem title='检查更新' color='#409EFF' showIcon={true} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={() => {
        
            setLogoutVisible(true)}}
        >
          <ZitListItem title='退出登录' color='#F56C6C' showIcon={true} />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={ async ()=>{
            storeData('$callInfoList', []);
          }}
        >
          <ZitListItem title='测试' showIcon={true} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={test}
        >
          <ZitListItem title='测试bss5004' showIcon={true} />
        </TouchableOpacity> */}
        <ZitDialog
          visible={logoutVisible}
          title="提 醒"
          content="是否返回登录界面？"
          onConfirm={logOut}
          onCancel={() => setLogoutVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  contentWrapper: {

  }
});
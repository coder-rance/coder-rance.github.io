import React, { useState, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';
import { ZitInput, ZitButton, ZitDivider, ZitDialog } from '@app/components';
import { showTopMessage } from '@app/utils/toast';
import { checkLogin } from '@app/api/login';
import { getData, storeData } from '@app/utils/storage';
import { Config } from './Login/Config';
import { Native_Subscribe } from '@app/mq';

let disabled = false;
const insetImg = require('@app/assets/img/inset.png');

export const Login = memo(({ navigation, route }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [configVisible, setConfigVisible] = useState(false);
  const loginInfo = useSelector(state => state.loginInfo);
  const serverURL = useSelector(state => state.serverURL);
  const flag=useSelector(state =>state.flag);
  const serverSec=useSelector(state => state.serverSec);
  const bindInfo = useSelector(state => state.bindInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    autoLogin();
  }, []);

  // 自动登录
  const autoLogin = async () => {
    if (serverURL !== '' && loginInfo && loginInfo.account) {
      console.log('自动登录!');
      dispatch({
        type:'setFlag',
        data:true
      })
      const { account, password } = loginInfo;
      login(account, password);
    } else {
      console.log('无法自动登录');
    }
  };

  // 进入主界面
  const nextPage = (username) => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'TabNavigator' }],
    },
      null,
    );
    navigation.dispatch(resetAction);
    let timer = setTimeout(() => {
      showTopMessage(`欢迎回来,${username}`);
      clearTimeout(timer);
    }, 1000);
  };

  // 登录
  const login = async (account, password) => {
    if (!disabled) {
      disabled = true;
    } else {
      return;
    }

    try {
      if (account.trim() === '') {
        dispatch({
          type:'setFlag',
          data: false
        })
        return showTopMessage('请输入工号');
      }

      if (password.trim() === '') {
        dispatch({
          type:'setFlag',
          data: false
        })
        return showTopMessage('请输入密码');
      }

      dispatch({
        type: 'setLoadingVisible',
        data: true,
      });

      const { data: { Success, entity: userInfo } } = await checkLogin({
        Account: account.trim(),
        Password: password.trim(),
        LoginType: 2,
      });

      if (Success) {
        storeData('$loginInfo', {
          account,
          password,
        });

        dispatch({
          type: 'setUserInfo',
          data: userInfo
        });



        Native_Subscribe(userInfo, bindInfo, serverURL,serverSec,flag);
        nextPage(userInfo.UserName);
        console.log('userInfo',userInfo);
      } else {
        console.log(account,
          password,Success,userInfo
          );
        showTopMessage('账号或密码错误');
      }
    } catch (err) {
      console.log('err',err);
      showTopMessage('登录超时,请稍后再试+',err);
    } finally {
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });
      disabled = false;
    }
  };

  return (
    <View style={styles.container}>
      {/* logo */}
      <Image resizeMode='contain' style={styles.inset} source={insetImg} />
      {/* 欢迎语 */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeContent}>欢迎使用外勤通</Text>
      </View>
      {/* 用户名 */}
      <ZitInput
        style={{ marginBottom: 15 }}
        iconName="person-outline"
        value={account}
        onChangeText={setAccount}
        placeholder="请输入工号"
      />
      {/* 密码 */}
      <ZitInput
        iconName="lock-open-outline"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="请输入密码"
      />
      {/* 登录按钮 */}
      <ZitButton
        title="登 录"
        style={{ marginTop: 30 }}
        onPress={() => login(account, password)}
      />
      {/* 分割线 */}
      <ZitDivider title="或"></ZitDivider>
      {/* 配置 */}
      <View style={styles.config}>
        <Text style={styles.tips}>还没配置？</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setConfigVisible(true)}>
          <View style={styles.configContainer}>
            <Text style={styles.configLink}>配置</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* 版本号 */}
      <View style={styles.version}>
        <Text>版本: {getVersion()}</Text>
      </View>
      {/* 配置项 */}
      <Config visible={configVisible} setVisible={setConfigVisible}></Config>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: 'flex-start',
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  inset: {
    width: '100%',
    height: 200
  },
  welcome: {
    display: 'flex',
    alignItems: 'center',
    padding: 15,
  },
  welcomeTitle: {
    fontSize: 14,

  },
  welcomeContent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  login: {
    backgroundColor: '#94acfd'
  },

  config: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tips: {
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  configContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 20,
    backgroundColor: '#C0C4CC',
    borderRadius: 5,
  },
  configLink: {
    color: '#fff',
    fontSize: 14,
    // textAlign: 'center',
  },
  version: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    // flex: 1,
    // display: 'flex',
    // justifyContent: 'flex-end',
    // alignItems: 'flex-end',
    // paddingBottom:20,
  }
});


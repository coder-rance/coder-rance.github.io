import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  View,
  Text,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { tasksByID } from '@app/api/task';
import { showTopMessage } from '@app/utils/toast';
import { ZitHeader } from '@app/components';
import { TaskList } from '@app/common/TaskList';
import { playSound } from '@app/utils/sound-player';
import { navigate } from '@app/router/RootNavigation';
import NetInfo from '@react-native-community/netinfo';
import { colors } from '@app/config';

export const Task = memo(({ navigation }) => {
  const [list, setList] = useState([]);
  const [netConn, setNetConn] = useState(false);
  const [mqConn, setMqConn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userInfo = useSelector(state => state.userInfo);
  const serverURL = useSelector(state => state.serverURL);
  const bindInfo = useSelector(state => state.bindInfo);
  const dispatch = useDispatch();

  // 首次获取任务列表
  useEffect(() => {
    const isBind = checkBindInfo(); // 是否绑定车辆
    if (isBind) {
      getList();
    }
  }, []);

  // 订阅bss5002  任务状态变化
  useEffect(() => {
    let bss5002Listener = DeviceEventEmitter.addListener('bss5002', (data) => {
      getList();
      // dispatch({
      //   type: 'setNewTaskTipsVisible',
      //   data: false,
      // });

      // 驶向现场
      if (data.STATUS === '01') {
        playSound('ambul_out.mp3', 1);
      }
      // 任务结束
      if (data.STATUS === '05') {
        playSound('task_complete.mp3', 1);
      }
    });

    return () => {
      bss5002Listener ?.remove();
      bss5002Listener = null;
    };
  }, []);

  // 订阅bss5009 任务被取消
  useEffect(() => {
    let bss5009Listener = DeviceEventEmitter.addListener('bss5009', (data) => {
      getList();
      dispatch({
        type: 'setNewTaskTipsVisible',
        data: false,
      });
      playSound('task_cancel.mp3', 1);
    });

    return () => {
      bss5009Listener ?.remove();
      bss5009Listener = null;
    };
  }, []);

  // 订阅网络状态
  useEffect(() => {
    let netConnListener = NetInfo.addEventListener(state => {
      const isInternetReachable = state.isInternetReachable;

      setNetConn(isInternetReachable);
      // !isInternetReachable && setMqConn(false); // 网络不通时, mq应该也不通
    });

    return () => {
      netConnListener();
    };
  }, []);

  // 订阅MQ连接状态
  useEffect(() => {
    let errorListener = DeviceEventEmitter.addListener('error', () => {
      showTopMessage('mq连接失败，请重新绑定车辆');
      setMqConn(false);
      let timer = setTimeout(() => {
        navigate('Binding');
        clearTimeout(timer);
      }, 2000);

    });
    let SubscripRmqackListener = DeviceEventEmitter.addListener('SubscripRmqack', (info) => {
      const eventData = info;// JSON.parse(info);
      const data = eventData.objData;
      //const data = eventData.objData;
      if (data && data.Result) {
        setMqConn(true);
      }
      else {
        setMqConn(false);
      }

    });

    return () => {
      errorListener ?.remove();
      SubscripRmqackListener ?.remove();
      errorListener = null;
      SubscripRmqackListener = null;
    };
  }, []);

  // 查看连接状况
  const checkConnection = () => {
    const link = netConn ? '正常' : '异常';
    showTopMessage(`网络连接: ${link}`);
  };

  // 检查是否绑定车辆
  const checkBindInfo = () => {
    if (bindInfo ?.station ?.name && bindInfo ?.vehicle ?.name) {
      // 已绑定
      dispatch({
        type: 'setBindingTipsVisible',
        data: false,
      });

      return true;
    } else {
      // 未绑定
      dispatch({
        type: 'setBindingTipsVisible',
        data: true,
      });

      return false;
    }
  };

  // 下拉刷新
  const onRefresh = () => {
    const isBind = checkBindInfo();
    if (isBind) {
      setRefreshing(true);
      getList();
    }
  };



  // 获取任务列表
  const getList = async () => {
    setLoading(true);
    try {
      const tel = bindInfo.vehicle ?.id;
      const id = userInfo.Account;
      const begin_slsj = dayjs(Date.now() - 7 * 86400 * 1000).format('YYYY-MM-DD HH:mm:ss');
      const end_slsj = dayjs().format('YYYY-MM-DD HH:mm:ss');

      const {
        data: { Success, entity }
      } = await tasksByID({
        id,
        tel,
        begin_slsj,
        end_slsj,
        hjyy: "",
        jcdz: ""
      });
      console.log(entity);

      if (Success) {
        setList(entity || []);
      } else {
        showTopMessage('拉取失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('拉取失败,请检查网络');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title={loading ? '加载中' : '任 务(最近1周)'}
        indicator={loading}
        leftIcon={
          <TouchableOpacity onPress={checkConnection} style={styles.connStatus}>
            {
              netConn
                ? <Ionicons name="swap-horizontal-outline" size={20} color={colors['success']} />
                : <Ionicons name="warning-outline" size={20} color={colors['danger']} />


            }

          </TouchableOpacity>
        }
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('Binding')}>
            <Ionicons name="add-circle-outline" size={28} color="#fff" />
          </TouchableOpacity>
        }
      ></ZitHeader>
      <View style={{ flex: 1 }}>
        {
          (list && list.length === 0)
            ?
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Image
                style={{ width: 200, height: 200 }}
                resizeMode='cover'
                source={require("@app/assets/img/empty.jpg")}
              />
              <Text>暂无数据</Text>
            </ScrollView>
            :
            <TaskList
              refreshing={refreshing}
              onRefresh={onRefresh}
              data={list}
            />
        }
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connStatus: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 3,
    paddingTop: 3,
  },
});

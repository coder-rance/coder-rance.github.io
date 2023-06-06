import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { ZitDialog, ZitButton } from '@app/components';
import { playSound, stopSound } from '@app/utils/sound-player';
import { confirmTask, receiveTask } from '@app/api/task';
import {writeLogger} from './utils'
import dayjs from 'dayjs';
import { showTopMessage } from '@app/utils/toast';
import { Native_NotifyMsg } from '@app/mq';
import * as RootNavigation from '@app/router/RootNavigation';

export const NewTaskTips = ({ visible }) => {
  const [info, setInfo] = useState({});
  const dispatch = useDispatch();

  // 订阅bss5004消息
  useEffect(() => {
    let bss5004 = DeviceEventEmitter.addListener('bss5004', (info) => {
      setInfo(info);
      playSound('newtask.mp3', 3); //播放语音提示
      feedback(info); // 反馈收到任务的时间
      Native_NotifyMsg('新任务');
      dispatch({
        type: 'setNewTaskTipsVisible',
        data: true,
      });
      // 关闭新任务信息
      dispatch({
        type: 'setNewTaskInfoVisible',
        data: false,
      });

      //关闭当前任务信息
      dispatch({
        type: 'setCurTaskInfoVisible',
        data: false,
      });

      // 关闭导航
      dispatch({
        type: 'setNaviVisible',
        data: false,
      });

      // 关闭拨打电话
      dispatch({
        type: 'setCallPhoneVisible',
        data: false,
      });

      // 关闭拨打电话
      dispatch({
        type: 'setExitAppVisible',
        data: false,
      });

      // 关闭拨打电话
      dispatch({
        type: 'setCallPhoneVisible',
        data: false,
      });
    });

    return () => {
      bss5004?.remove();
      bss5004 = null;
    };
  }, []);

  // 反馈收到任务的时间   收到时间用服务端生成的，客户端不关心
  const feedback = async (info) => {
    try {
      const { result, data: { WQSDSJ } } = await receiveTask({
        lsh: info.LSH,
        ccxh: info.CCXH,
      });

      console.log(result, WQSDSJ);
      setInfo({
        ...info,
        WQSDSJ,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const navigateToLogin = () => {
    const resetAction = CommonActions.reset(
      {
        index: 0,
        routes: [{
          name: 'Task',
        }],
      },
      null
    );

    RootNavigation.dispatch(resetAction);
  };

  // 忽略任务
  const onCancel = () => {
    dispatch({
      type: 'setNewTaskTipsVisible',
      data: false,
    });
    stopSound();
    navigateToLogin();
  };

  // 确认任务
  const onConfirm = async () => {
    stopSound();
    dispatch({
      type: 'setLoadingVisible',
      data: true,
    });

    try {
      const { result, data:{WQQRSJ} } = await confirmTask({
        lsh: info.LSH,
        ccxh: info.CCXH,
        tel: info.TEL,
      });

      console.log('this is 123456',result, WQQRSJ);
      if (result == 1) {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          playSound('confirm_success.mp3', 1);
          dispatch({
            type: 'setNewTaskTipsVisible',
            data: false,
          });
          showTopMessage('任务确认成功');

          writeLogger(`
          LSH:${ info.LSH}
          任务确认成功！！！
          `);

          navigateToLogin();

          //  打开新任务
          dispatch({
            type: 'setNewTaskInfoVisible',
            data: true,
          });

          dispatch({
            type: 'setNewTaskInfo',
            data: {
              ...info,
              WQQRSJ,
            }
          });

          dispatch({
            type: 'setLoadingVisible',
            data: false,
          });
        }, 3000);
      } else {
        console.log('????? 失败？？？'+result);
        showTopMessage('任务确认失败');
        writeLogger(`
        LSH:${ info.LSH}
        任务确认失败
        `);
        playSound('confirm_failure.mp3', 1);
      }
    } catch (err) {
      console.log(err);
      showTopMessage('任务确认失败');
      writeLogger(`
      LSH:${ info.LSH}
      接口原因
      任务确认失败
      失败原因：${err}
      `);
      playSound('confirm_failure.mp3', 1);
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });
    } finally {

    }
  };

  return (
    <View>
      <ZitDialog
        visible={visible}
        title="新任务"
        // cancelBtnTitle="忽 略"
        confirmBtnTitle="确认任务"
        // onCancel={onCancel}
        onConfirm={onConfirm}
      >
        <View>
          <Text style={styles.text}>任务流水: {info.LSH_XH}</Text>
          <Text style={styles.text}>接车地址: {info.JCDZ}</Text>
          <Text style={styles.text}>呼救原因: {info.HCYY}</Text>
          <Text style={styles.text}>任务收到时间: {info.dtDataTime}</Text>
        </View>
      </ZitDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#455465',
    marginBottom: 3,
    fontSize: 14,
  },

});



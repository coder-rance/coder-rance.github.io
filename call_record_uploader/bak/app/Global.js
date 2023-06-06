import React, { useState, useEffect, useCallback } from 'react';
import { BackHandler, StatusBar, DeviceEventEmitter, NativeModules } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { Native_MQListener, Native_GetIMEI } from '@app/mq';
import { ZitDialog, ZitLoading } from '@app/components';
import { CallPhone } from '@app/common/CallPhone';
import { NewTaskTips } from '@app/common/NewTaskTips';
import { NewTaskInfo } from '@app/common/NewTaskInfo';
import { MapNavigator } from '@app/common/MapNavigator';
import { BindingTips } from '@app/common/BindingTips';
import { CurTaskInfo } from '@app/common/CurTaskInfo';
import { ExitApp } from '@app/common/ExitApp';
import { UploadRecord } from '@app/common/UploadRecord';
import { uploadCallInfo } from '@app/common/utils';
import { showTopMessage } from '@app/utils/toast';
import { getData, removeData } from '@app/utils/storage';

export function GlobalComponents() {
  const naviVisible = useSelector(state => state.naviVisible);
  const loadingVisible = useSelector(state => state.loadingVisible);
  const exitAppVisible = useSelector(state => state.exitAppVisible);
  const callPhoneVisible = useSelector(state => state.callPhoneVisible);
  const newTaskTipsVisible = useSelector(state => state.newTaskTipsVisible);
  const newTaskInfoVisible = useSelector(state => state.newTaskInfoVisible);
  const bindingTipsVisible = useSelector(state => state.bindingTipsVisible);
  const curTaskInfoVisible = useSelector(state => state.curTaskInfoVisible);
  const uploadRecordVisible = useSelector(state => state.uploadRecordVisible);
  const dispatch = useDispatch();
  let once=0;

  // 订阅Android回退按键触发
  useEffect(() => {
    let subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      e => {
        dispatch({
          type: 'setExitAppVisible',
          data: true,
        });
        return true;
      },
    );

    return () => {
      subscription?.remove();
      subscription = null;
    };
  }, []);

  // 订阅IMEI事件
  useEffect(() => {
    let IMEIListener = DeviceEventEmitter.addListener('getimeiack', (IMEI) => {
      dispatch({
        type: 'setIMEI',
        data: IMEI,
      });
      console.log(IMEI);
    });

    Native_GetIMEI(); // 获取IMEI

    return () => {
      IMEIListener?.remove();
      IMEIListener = null;
    };
  }, []);

  // 订阅Android消息
  useEffect(() => {
    let MQListener = Native_MQListener();

    return () => {
      MQListener?.remove();
      MQListener = null;
    };
  }, []);

  useEffect(()=> {
    let bss5002Listener = DeviceEventEmitter.addListener('bss5002', async (data) => {
      let list= await getData('$callInfoList');
      // 任务结束
      if (data.STATUS === '05'&& list) {
        for(let i in list){
          console.log('list[i]',list[i]);
          await uploadInfo(list[i]);
        }
        // removeData('$callInfoList');
      }
      console.log('once',once);
      if(list){
        if(once==list.length)
        removeData('$callInfoList');
      }

    });

    return () => {
      bss5002Listener?.remove();
      bss5002Listener = null;
    };
  })

//自动上传记录
  const uploadInfo = async (info) => {
    console.log(info);
    try {
      const { isOK } = await uploadCallInfo(info);
      if (isOK) {
        // console.log(newList)
        once++;
        console.log('once',once);
        showTopMessage('通话信息上传成功');
      } else {
        showTopMessage('通话信息上传失败');
      }
    } catch (err) {
      showTopMessage('通话信息上传失败');

    }
  };

  return (
    <>
      {/* 状态栏 */}
      <StatusBar barStyle="dark-content" backgroundColor='#409EFF' />
      {/* loading */}
      <ZitLoading visible={loadingVisible} />
      {/* 退出App */}
      <ExitApp visible={exitAppVisible} />
      {/* 拨打电话 */}
      <CallPhone visible={callPhoneVisible} />
      {/* 导航 */}
      <MapNavigator visible={naviVisible} />
      {/* 新任务提示 */}
      <NewTaskTips visible={newTaskTipsVisible} />
      {/* 新任务信息 */}
      <NewTaskInfo visible={newTaskInfoVisible} />
      {/* 当前任务信息 */}
      <CurTaskInfo visible={curTaskInfoVisible} />
      {/* 绑定车辆提示 */}
      <BindingTips visible={bindingTipsVisible} />
      {/* 上传录音 */}
      <UploadRecord visible={uploadRecordVisible} />
    </>
  );
}
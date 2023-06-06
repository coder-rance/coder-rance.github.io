import React, { useState,useRef } from "react";
import { View, DeviceEventEmitter } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ZitDialog } from '@app/components';
import { useEffect } from "react";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import CallDetectorManager from 'react-native-call-detection';
import { showTopMessage, showTopMessageLong } from "@app/utils/toast";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
import {
  getLatestCallInfo,
  getLatestCallRecording,
  uploadCallInfo,
  uploadCallRecording,
  writeLogger,
  deleteCallRecording,
  insertLocalStorage,
} from './utils';
import { getBrand, getVersion } from "react-native-device-info";
import {UPDATE_LIST} from '@app/constants';
dayjs.extend(isBetween);
let incoming = false;
let RECALL_TIME = '';
let TEST_TIME='';
let LAST_RECORD='';
let phoneNumber = '';
let taskInfo = {};
export const CallPhone = ({ visible }) => {
  const [lastRecord,setLastRecord]=useState('');
  const recordPath = useSelector(state => state.recordPath);
  const serverURL = useSelector(state => state.serverURL);
  const userInfo = useSelector(state => state.userInfo);
  const bindInfo = useSelector(state => state.bindInfo);
  const IMEI = useSelector(state => state.IMEI);
  const serverSec=useSelector(state => state.serverSec);
  const recordPathRef = useRef();
  const serverURLRef = useRef();
  const userInfoRef = useRef();
  const bindInfoRef = useRef();
  const dispatch = useDispatch();

  recordPathRef.current = recordPath;
  serverURLRef.current = serverURL;
  userInfoRef.current = userInfo;
  bindInfoRef.current = bindInfo;

  // 监听拨打
  useEffect(() => {
    let listener = DeviceEventEmitter.addListener('callPhone', (data) => {
      console.log(data);
      phoneNumber = data.phoneNumber;
      taskInfo = data.taskInfo;
      dispatch({
        type: 'setCallPhoneVisible',
        data: true
      });
    });

    return () => {
      listener?.remove();
      listener = null;
    };
  }, []);

  // 监听电话状态
  useEffect(() => {
    console.log('开始监听电话状态');
    let callDetector = new CallDetectorManager(callDetectorCallback,
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {
        showTopMessage("权限不足，请检查权限");
      }, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
      } // a custom permission request message to explain to your user, why you need the permission [recommended] - this is the default one
    )

    return () => {
      callDetector?.dispose();
      callDetector = null;
      console.log('结束监听电话状态');
    }
  }, []);

  // 电话事件回调
  const callDetectorCallback = (event, targetPhone) => {
    targetPhone = targetPhone + "";
    if (event === 'Disconnected') {
      // 挂断
      onDisconnected(targetPhone, phoneNumber, { ...taskInfo });
      phoneNumber = '';
      taskInfo = {};
    } else if (event === 'Offhook') {
      // uploadCallInfo摘机
      onOffhook(targetPhone);
    } else if (event === 'Incoming') {
      // 来电
      onIncoming(targetPhone);
    } else if (event === 'Missed') {
      // 已打通，但是被其中一方挂断了
      onMissed(targetPhone);
      phoneNumber = '';
      taskInfo = {};
    }
  };

  // 处理通话信息上传
  const handle = async (callInfo, msg, log) => {
    const { isOK } = await uploadCallInfo(callInfo);

    showTopMessageLong(msg);

    // log && 
    if(!log){
      writeLogger(`
      log:"上传成功！！！"
      BRAND: ${getBrand()}
      APP_VERSION:${getVersion()}
      LSH:${callInfo.LSH}
      CCXH:${callInfo.CCXH}
      TASK_TIME:${callInfo.TASK_TIME} 
      RECALL_TIME:${callInfo.RECALL_TIME}
      HANGUP_TIME:${callInfo.HANGUP_TIME}
      CALL_TIME:${callInfo.CALL_TIME}
    `);
    }
    console.log('写入日志',log,msg);
   if(log) 
    {
    console.log('触发！！！！');
    writeLogger(`
    log:${log}
    BRAND: ${getBrand()}
    APP_VERSION:${getVersion()}
    LSH:${callInfo.LSH}
    CCXH:${callInfo.CCXH}
    TASK_TIME:${callInfo.TASK_TIME} 
    RECALL_TIME:${callInfo.RECALL_TIME}
    HANGUP_TIME:${callInfo.HANGUP_TIME}
    CALL_TIME:${callInfo.CALL_TIME}
  `);
   }

    // 上传通话信息失败
    if (!isOK) {
      // 添加到待上传记录中
      insertLocalStorage('$callInfoList', { ...callInfo });
      console.log(`上传通话信息 Failed, 已添加到待上传记录中`);
      console.log(`流程完毕`);
      DeviceEventEmitter.emit(UPDATE_LIST);
    } else {
      console.log(`上传通话信息 Success`);
      console.log(`流程完毕`);
      DeviceEventEmitter.emit(UPDATE_LIST);
    }
  };

  // 下一步操作
  const next = async (RECALL_TIME, HANGUP_TIME, phoneNumber, taskInfo) => {
    // 1.获取最新一条通话信息 
    const latestCallInfo = await getLatestCallInfo(RECALL_TIME, HANGUP_TIME);
    console.log('最新一条通话信息latestCallInfo',latestCallInfo);
    const { DURATION, START_TIME, IS_ANSWERED,type } = latestCallInfo;

    // 2.获取最新一条通话信息 失败,写入日志
    if (!latestCallInfo.isOK) {
      writeLogger(`
        获取最新一条通话信息失败：
        APP_VERSION:${getVersion()}
        LSH:${taskInfo.LSH}
        CCXH:${taskInfo.CCXH}
        TASK_TIME:${taskInfo.WQQRSJ} 
        RECALL_TIME:${RECALL_TIME}
        HANGUP_TIME:${HANGUP_TIME}
        CALL_TIME:${callInfo.CALL_TIME}
      `);
    }
    console.log('获取最新一条通话信息 Success');

    const callInfo = {
      FULLNAME: '未找到通话录音',
      FILENAME: '未找到通话录音',
      URL: '',
      MEMBER_ID: userInfoRef.current.UserId,
      CZDH: bindInfoRef.current.vehicle?.id,
      ZJHM: userInfoRef.current.PHONE_NUM,
      BJHM: phoneNumber,
      XZBM: userInfoRef.current.XZBM,
      FILE_CREATE_TIME: '',
      IMEI,
      DURATION,
      LSH: taskInfo.LSH,
      CCXH: taskInfo.CCXH,
      TASK_TIME: taskInfo.WQQRSJ,
      CALL_TIME: TEST_TIME,
      RECALL_TIME,
      START_TIME,
      HANGUP_TIME,
      IS_ANSWERED,
      REMARK: getBrand(),
      VERSION: getVersion(),
    };

    if(DURATION == 0){
      handle(callInfo, '电话未接通,无需上传记录');
      return;
    }

    // 3.获取最新一条录音 
    console.log(`本地录音路径是: ${recordPathRef.current}`);
    const latestCallRecording = await getLatestCallRecording(recordPathRef.current);
    const { FULLNAME, MTIME } = latestCallRecording;
     console.log('1111MTIME', dayjs(MTIME).format('YYYY-MM-DD HH:mm:ss'));
     console.log('serverSec',serverSec);
    // 4.获取最新一条录音 失败，只上传通话信息
  

    if (!latestCallRecording.isOK) {
      console.log(`获取最新一条录音 Failed, 原因: 没找到录音文件`);
      handle(callInfo, '录音上传失败', "未找到录音");
      return;
    }

    // console.log('最新录音',latestCallRecording);
    // console.log('最新录音长度',latestCallRecording.LENGTH);
    // console.log('接通前的录音长度',LAST_RECORD.LENGTH);
    // if(latestCallRecording.LENGTH -LAST_RECORD.LENGTH !== 1){
      // 5.获取最新一条录音 成功，校验录音时间
    // console.log('12345646546',Math.abs(dayjs(RECALL_TIME).diff(dayjs(MTIME), 'second')));
    // console.log('55555555555',Math.abs(dayjs(HANGUP_TIME).diff(dayjs(MTIME), 'second')));
    // console.log('serverSec',serverSec);
    // const condition = Math.abs(dayjs(RECALL_TIME).diff(dayjs(MTIME), 'second')) <= serverSec || Math.abs(dayjs(HANGUP_TIME).diff(dayjs(MTIME), 'second')) <= serverSec;
    console.log('提前5s',dayjs(TEST_TIME).subtract(5, 'second'));
    console.log('延后5s',dayjs(HANGUP_TIME).add(5, 'second'));
    const condition=dayjs(MTIME).isBetween(dayjs(TEST_TIME).subtract(5, 'second'), dayjs(HANGUP_TIME).add(5, 'second'),'millisecond',[]);
    console.log('校验结果',condition);
    // 6.校验不通过， 只上传通话信息
    if (!condition) {
      console.log(`获取最新一条录音 Failed, 原因: 文件日期校验不通过, 相差：${Math.abs(dayjs(HANGUP_TIME).diff(dayjs(MTIME), 'second'))} 秒`);
      handle(callInfo, '录音上传失败', `获取最新一条录音 Failed, 原因: 文件日期校验不通过, ,MTIME:${MTIME},最新一条录音:${latestCallRecording}`);
      return;
    }   
    // }
  
    // 7.校验通过，上传通话录音
    console.log(`获取最新一条录音 Success`);
    const { isOK, errMsg, URL, FILENAME, FILE_CREATE_TIME } = await uploadCallRecording(serverURLRef.current + '/record/uploadRecord', FULLNAME);

    


    // 8.上传通话录音失败, 只上传通话信息
    if (!isOK) {
      console.log(`录音文件上传 Failed, 原因: ${errMsg}`);
      callInfo.FILENAME = '待上传';
      callInfo.FULLNAME = FULLNAME;
      handle(callInfo, '录音上传失败', '可能是网络原因导致录音上传失败');
      return;
    }

    // 9.上传成功，删除本地录音
    const delRes = await deleteCallRecording(FULLNAME);
    console.log(delRes.errMsg);

    // 10.上传通话信息
    callInfo.URL = URL;
    callInfo.FULLNAME = FULLNAME;
    callInfo.FILENAME = FILENAME;
    callInfo.FILE_CREATE_TIME = FILE_CREATE_TIME;
    handle(callInfo, '录音上传成功');
  };

  // 通话断开  最重要的事件: 在这里触发录音上传的操作
  const onDisconnected = (targetPhone, phoneNumber, taskInfo) => {
    console.log('targetPhone:', targetPhone);
    console.log('phoneNumber:', phoneNumber);
    console.log('taskInfo:', taskInfo);

    const HANGUP_TIME = dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log('disconnected');
    console.log('挂机时间', HANGUP_TIME);

    // 1.检查是否是来电，如果是，return
    if (incoming) {
      incoming = false;
      console.log('当前是来电，无需上传录音');
      console.log(`流程完毕`);
      return;
    }

    // 2.判断targetPhone是否和任务phoneNumber一致，如果不一致，return
    if (!(taskInfo.LSH && targetPhone.trim() == phoneNumber.trim())) {
      console.log(`targetPhone:${targetPhone}和任务phoneNumber:${phoneNumber}不一致,无需上传录音`);
      console.log(`流程完毕`);
      return;
    }

    // 3.一定时间的延迟后，开始下一步操作
    let timer = setTimeout(() => {
      next(RECALL_TIME, HANGUP_TIME, phoneNumber, taskInfo);
      clearTimeout(timer);
    }, 3000);
  };

  // 摘机 (只有本机主动摘机才会触发)
  const onOffhook = async (targetPhone) => {
    RECALL_TIME = dayjs().format('YYYY-MM-DD HH:mm:ss');
    LAST_RECORD=await getLatestCallRecording(recordPathRef.current);
    // RECALL_TIME = new Date();
    console.log('offhook');

    console.log('摘机时间: ', RECALL_TIME);
  };

  // 来电
  const onIncoming = (targetPhone) => {
    console.log('incoming');
    incoming = true;
  };

  // 来电失败
  const onMissed = (targetPhone) => {
    console.log('missed')
    incoming = false;
  }

  // 取消拨打
  const onCancel = () => {
    dispatch({
      type: 'setCallPhoneVisible',
      data: false,
    });
    phoneNumber = '';
    taskInfo = {};
  };

  // 确认拨打
  const onConfirm = () => {
    const phone = phoneNumber.replace(/\s+/g, "");
    TEST_TIME=dayjs().format('YYYY-MM-DD HH:mm:ss');
    console.log('测试的拨打时间：TEST_TIME:',TEST_TIME);
    dispatch({
      type: 'setCallPhoneVisible',
      data: false,
    });

    if (phone.length === 0) {
      showTopMessage("号码格式不正确");
      return;
    }

    RNImmediatePhoneCall.immediatePhoneCall(phone);
  };

  return (
    <View>
      <ZitDialog
        visible={visible}
        title="提 醒"
        content={'是否拨打电话给：' + phoneNumber + ' ?'}
        onConfirm={onConfirm}
        onCancel={onCancel}
      ></ZitDialog>
    </View>
  );
};
import React, { useState, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ZitButton, ZitDialog } from '@app/components';
import { confirmTask } from '@app/api/task';
import { playSound, stopSound } from '@app/utils/sound-player';
import { showTopMessage } from '@app/utils/toast';
import { CommonActions } from '@react-navigation/native';
import * as RootNavigation from '@app/router/RootNavigation';
import { DeviceEventEmitter } from 'react-native';
import { writeLogger } from './utils'

export const CurTaskInfo = ({ visible }) => {
  const bindInfo = useSelector(state => state.bindInfo);
  const curTaskInfo = useSelector(state => state.curTaskInfo);
  const dispatch = useDispatch();


  // 打开导航
  const onNavi = () => {
    dispatch({
      type: 'setNaviVisible',
      data: true,
    });

    dispatch({
      type: 'setNaviInfo',
      data: {
        lng: null,
        lat: null,
        address: curTaskInfo.JCDZ || ''
      }
    });
  };

  // 关闭页面
  const onCancel = () => {
    dispatch({
      type: 'setCurTaskInfoVisible',
      data: false,
    });
    dispatch({
      type: 'setCurTaskInfo',
      data: {},
    });
  };

  // 打电话
  const onCallPhone = () => {
    dispatch({
      type: 'setCurTaskInfoVisible',
      data: false,
    });

    DeviceEventEmitter.emit('callPhone', {
      phoneNumber: curTaskInfo.LXDH,
      taskInfo: { ...curTaskInfo }
    });
  };

  // 重置页面
  const resetPage = () => {
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

  // 重新确认任务
  const onReConfirm = async () => {
    console.log('...curTaskInfo...',curTaskInfo);
    dispatch({
      type: 'setLoadingVisible',
      data: true,
    });

    try {
      const { result, data } = await confirmTask({
        lsh: curTaskInfo.LSH,
        ccxh: curTaskInfo.CCXH,
        tel: bindInfo.vehicle?.id,
      });

      console.log(result, data);
      if (result == 1) {
        let timer = setTimeout(() => {
          dispatch({
            type: 'setLoadingVisible',
            data: false,
          });
          showTopMessage('任务确认成功');

          writeLogger(`
          LSH:${ curTaskInfo.LSH}
          任务确认成功！！！
          `);

          playSound('confirm_success.mp3', 1);
          onCancel();
          resetPage();
          clearTimeout(timer);
        }, 3000);
      } else {
        console.log('1231231321');
        showTopMessage('任务确认失败');

        writeLogger(`
        LSH:${ curTaskInfo.LSH}
        任务确认失败
        `);

        playSound('confirm_failure.mp3', 1);
        dispatch({
          type: 'setLoadingVisible',
          data: false,
        });
      }
    } catch (err) {
      console.log(err);
      showTopMessage('任务确认失败');
      
      writeLogger(`
      LSH:${ curTaskInfo.LSH}
      接口问题：任务确认失败
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
    <ZitDialog visible={visible} title="任务详情" showButton={false}>
      <View style={styles.content}>
        <Text style={styles.itemText}>任务流水: {curTaskInfo.LSH} : {curTaskInfo.CCXH}</Text>
        <Text style={styles.itemText}>接车地址: {curTaskInfo.JCDZ}</Text>
        <Text style={styles.itemText}>呼救原因: {curTaskInfo.HJYYBC}</Text>
        <Text style={styles.itemText}>联系电话: <Text style={{ color: '#409EFF' }}>{curTaskInfo.LXDH}</Text></Text>
        <View style={styles.status}>
          <Text style={styles.itemText}>任务状态: </Text>
          <Text style={{
            fontSize: 14,
            textAlign: 'right',
            color: curTaskInfo.FLAG == 0 ? '#F56C6C' : curTaskInfo.SFQXPC == 1 ? '#E6A23C' : '#67C23A'
          }}>
            {
              curTaskInfo.FLAG == 0
                ? curTaskInfo.STATUS_NAME
                : curTaskInfo.SFQXPC == 1 ? '取消派车' : curTaskInfo.FLAG_SM
            }
          </Text>
        </View>
        <Text style={styles.itemText}>派车时间: {curTaskInfo.PCSJ ? curTaskInfo.PCSJ : '时间未知'}</Text>
        <Text style={styles.itemText}>外勤收到时间: {curTaskInfo.WQSDSJ ? curTaskInfo.WQSDSJ : '时间未知'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.itemText}>外勤确认时间: {curTaskInfo.WQQRSJ ? curTaskInfo.WQQRSJ : '时间未知'}</Text>
          {
            (curTaskInfo.FLAG != 1 && curTaskInfo.SFQXPC != 1 && !curTaskInfo.WQQRSJ)
            &&
            (<ZitButton title="重新确认"
              style={{ height: 30, width: 90, marginLeft: 5 }}
              onPress={onReConfirm}
            >
            </ZitButton>)
          }
        </View>
        <View style={styles.footer}>
          <ZitButton
            type="primary"
            title="拨打联系电话"
            iconName="call"
            style={styles.button}
            onPress={onCallPhone}
          ></ZitButton>
          <View style={styles.support}>
            <ZitButton
              type="danger"
              title="关闭"
              iconName="close-circle-outline"
              style={styles.cancelBtn}
              onPress={onCancel}
            ></ZitButton>
            <ZitButton
              type="success"
              title="导航"
              iconName="map"
              style={styles.naviBtn}
              onPress={onNavi}
            ></ZitButton>
          </View>
        </View>
      </View>
    </ZitDialog>

  );
};

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  footer: {
    width: '100%',
    display: 'flex',
    // flexDirection:'row',
  },
  itemText: {
    fontSize: 15,
    marginBottom: 3,
    color: '#455465',
  },
  button: {

    width: '100%',
    marginTop: 10,
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: '#767676',
  },
  support: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,

  },
  naviBtn: {
    flex: 1,
    marginLeft: 7.5,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 7.5,
  }
});
import React, { useState, memo } from 'react';
import { View, Text, StyleSheet ,DeviceEventEmitter} from 'react-native';
import {useSelector, useDispatch } from 'react-redux';
import { ZitButton, ZitDialog } from '@app/components';

export const NewTaskInfo = ({ visible }) => {
  const newTaskInfo = useSelector(state=>state.newTaskInfo);
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
        address: newTaskInfo.JCDZ || ''
      }
    });
  };

  const onCallPhone = ()=>{
    dispatch({
      type: 'setNewTaskInfoVisible',
      data: false,
    });
    DeviceEventEmitter.emit('callPhone', {
      phoneNumber: newTaskInfo.LXDH,
      taskInfo: {...newTaskInfo}
    });
  }

  const onCancel = () => {
    dispatch({
      type: 'setNewTaskInfoVisible',
      data: false,
    });
  };

  return (
    <ZitDialog
      visible={visible}
      title="新任务信息"
      showButton={false}>
      <View style={styles.content}>
        <Text style={styles.itemText}>任务流水: {newTaskInfo.LSH} : {newTaskInfo.CCXH}</Text>
        <Text style={styles.itemText}>接车地址: {newTaskInfo.JCDZ}</Text>
        <Text style={styles.itemText}>呼救原因: {newTaskInfo.HCYY}</Text>
        <Text style={styles.itemText}>联系电话: <Text style={{ color: '#409EFF' }}>{newTaskInfo.LXDH}</Text></Text>
        
        <Text style={styles.itemText}>收到任务时间: {newTaskInfo.dtDataTime ? newTaskInfo.dtDataTime : '时间未知'}</Text>
        
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
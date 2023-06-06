import React, { useCallback } from 'react';
import { RefreshControl, FlatList,DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import { TaskListItem } from './TaskList/TaskListItem';

export const TaskList = ({ refreshing, onRefresh, data }) => {
  const dispatch = useDispatch();

  const renderItem = useCallback(({ item }) => {
    return (
      <TaskListItem
        item={item}
        onPress={() => {
          dispatch({
            type: 'setCurTaskInfoVisible',
            data: true
          });
          const curTaskInfo = { ...item };
          dispatch({
            type: 'setCurTaskInfo',
            data: curTaskInfo
          });
        }}
        onLongPress={() => {
          const curTaskInfo = { ...item };
          dispatch({
            type: 'setCurTaskInfo',
            data: curTaskInfo
          });
          DeviceEventEmitter.emit('callPhone', {
            phoneNumber: curTaskInfo.LXDH,
            taskInfo: {...curTaskInfo}
          });
        }}
      />
    );
  }, []);
  return (
    <FlatList
      refreshControl={
        onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={data}
      keyExtractor={item => (item.LSH + ':' + item.CCXH)}
      renderItem={renderItem}
    />
  );
}

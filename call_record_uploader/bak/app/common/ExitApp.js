import React, { memo } from "react";
import { View, Text, BackHandler, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { ZitDialog } from '@app/components';

export const ExitApp = ({ visible }) => {
  const dispatch = useDispatch();

  // 取消退出
  const onCancel = () => {
    dispatch({
      type: 'setExitAppVisible',
      data: false,
    });
  };

  // 退出App
  const onConfirm = () => {
    dispatch({
      type: 'setExitAppVisible',
      data: false,
    });
    BackHandler.exitApp();
  };

  return (
    <View>
      <ZitDialog
        visible={visible}
        title="提 醒"
        onConfirm={onConfirm}
        onCancel={onCancel}
        content="是否退出应用?"
      >
      </ZitDialog>
    </View>
  );
};

const styles = StyleSheet.create({

});
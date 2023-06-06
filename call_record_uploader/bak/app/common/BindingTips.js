import React, { useState } from 'react';
import { View, } from 'react-native';
import { useDispatch } from 'react-redux';
import { ZitDialog } from '@app/components';
import {navigate} from '@app/router/RootNavigation';

export const BindingTips = ({ visible }) => {
  const dispatch = useDispatch();

  const onCancel = () => {
    dispatch({
      type: 'setBindingTipsVisible',
      data: false,
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'setBindingTipsVisible',
      data: false,
    });
    navigate('Binding');
  };

  return (
    <View>
      <ZitDialog
        visible={visible}
        title="检测到尚未绑定车辆"
        onCancel={onCancel}
        onConfirm={onConfirm}
        cancelBtnTitle="忽 略"
        confirmBtnTitle="前往绑定"
      ></ZitDialog>
    </View>
  );
};

import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {ZitNavi } from '@app/components';

export const MapNavigator = ({ visible }) => {
  const naviInfo = useSelector(state => state.naviInfo);
  const dispatch = useDispatch();

  const onCancel = () => {
    dispatch({
      type: 'setNaviVisible',
      data: false,
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'setNaviVisible',
      data: false,
    });
  };

  return (
    <ZitNavi
      visible={visible}
      naviInfo={naviInfo}
      onConfirm={onConfirm}
      onCancel={onCancel}>
    </ZitNavi>
  );
}
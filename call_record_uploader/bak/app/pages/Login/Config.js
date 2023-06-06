import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native'
import { ZitButton, ZitInput, ZitDialog } from '@app/components';
import { storeData, getData } from '@app/utils/storage';
import { showTopMessage } from '@app/utils/toast';
import { useSelector, useDispatch } from 'react-redux';

export const Config = memo(({ visible, setVisible }) => {
  const [URL, setURL] = useState('');
  const serverURL = useSelector(state => state.serverURL);
  const dispatch = useDispatch();

  useEffect(() => {
    setURL(serverURL);
  }, []);


  // 取消
  const onCancel = ()=>{
    setVisible(false)
  };

  // 保存serverURL到本地
  const onConfirm = async () => {
    try {
  
      const isOk = await storeData('$serverURL', URL);
      if (isOk) {
        showTopMessage('保存配置成功');
        setVisible(false);
        dispatch({
          type: 'setServerURL',
          data: URL
        });
      } else {
        showTopMessage('保存配置失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('保存配置失败');
    }
  };

  return (
    <ZitDialog
      visible={visible}
      title="配 置"
      cancelBtnTitle="取 消"
      confirmBtnTitle="保 存"
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <ZitInput
        iconName="globe-outline"
        value={URL}
        onChangeText={setURL}
        placeholder="请输入服务器地址"
      />
    </ZitDialog>
  );
});

const styles = StyleSheet.create({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
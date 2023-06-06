import React, { useState, useEffect } from "react";
import { View, DeviceEventEmitter, BackHandler, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { ZitDialog } from '@app/components';
import { UPDATE_LIST, UPLOAD_RECORD } from '@app/constants';
import { uploadCallRecording, uploadCallInfo, deleteCallRecording } from '@app/common/utils';
import { showTopMessage } from "@app/utils/toast";
import { writeLogger } from './utils';

export const UploadRecord = ({ visible }) => {
  const [recordInfo, setRecordInfo] = useState({});
  const serverURL = useSelector(state => state.serverURL);
  const dispatch = useDispatch();

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener(UPLOAD_RECORD, recordInfo => {
      console.log('------recordInfo------',recordInfo);
      dispatch({
        type: 'setUploadRecordVisible',
        data: true,
      });
      setRecordInfo(recordInfo);
    });

    return () => {
      listener?.remove();
      listener = null;
    };
  }, []);

  // 取消上传
  const onCancel = () => {
    dispatch({
      type: 'setUploadRecordVisible',
      data: false,
    });
    setRecordInfo({});
  };

  // 确定上传
  const onConfirm = async () => {
    dispatch({
      type: 'setUploadRecordVisible',
      data: false,
    });
    
    dispatch({
      type: 'setLoadingVisible',
      data: true,
    });


    try {
      const { isOK, FILENAME, FILE_CREATE_TIME, URL } = await uploadCallRecording(serverURL + '/record/uploadRecord', recordInfo.fullPath);
      if (isOK) {
        const {LSH, CCXH, START_TIME, IS_ANSWERED, XZBM} = recordInfo.taskInfo;
        const callInfo = {
          FULLNAME: recordInfo.fullPath,
          FILENAME,
          URL,
          FILE_CREATE_TIME,
          LSH,
          CCXH,
          START_TIME,
          IS_ANSWERED,
          XZBM,
        };

        console.log(callInfo);
        const { isOK } = await uploadCallInfo(callInfo);
        if (isOK) {
          showTopMessage('录音上传成功');
          DeviceEventEmitter.emit(UPDATE_LIST);
          writeLogger(`
         手动上传成功
         LSH:${LSH}
        `);
          const {isOK,errMsg} = await deleteCallRecording(recordInfo.fullPath);
          console.log(isOK, errMsg);
        } else {
          console.log('isOk');
          writeLogger(`
          通话记录callInfo isOk:${isOK}
          手动上传失败
          LSH:${LSH}
         `);
          showTopMessage('录音上传失败');
        }
      } else {
       console.log('第一个isOk');
       writeLogger(`
       isOK:${isOK}
       手动上传录音失败
       LSH:${recordInfo.LSH}
      `);
        showTopMessage('录音上传失败');
      }
    } catch (err) {
      console.log(err);
      writeLogger(`
      接口问题
      手动上传录音失败
      LSH:${recordInfo.LSH}
     `);
      showTopMessage('录音上传失败');
    } finally {
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });
    }
  };

  return (
    <View>
      <ZitDialog
        visible={visible}
        title="提 醒"
        onConfirm={onConfirm}
        onCancel={onCancel}
        content={`是否确定上传 ${recordInfo.fullPath} ?`}
      >
      </ZitDialog>
    </View>
  );
};

const styles = StyleSheet.create({

});

import React, { useState, useEffect, memo, useCallback, useRef, } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, Image, DeviceEventEmitter } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getCallRecord } from '@app/api/record';
import { showTopMessage } from '@app/utils/toast';
import { ZitButton } from '@app/components';
import dayjs from 'dayjs';
import TrackPlayer from 'react-native-track-player';
import DocumentPicker from 'react-native-document-picker';
import { UPLOAD_RECORD, UPDATE_LIST } from '@app/constants';

let disabled = false;
export const RecordList = memo(() => {
  const [recordList, setRecordList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const bindInfo = useSelector(state => state.bindInfo);
  const serverURL = useSelector(state => state.serverURL);
  const serverURLRef = useRef();
  const dispatch = useDispatch();


  useEffect(() => {
    getRecordList();
  }, []);

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener(UPDATE_LIST, () => {
      getRecordList();
    });


    return () => {
      listener?.remove();
      listener = null;
    }
  });

  serverURLRef.current = serverURL;

  const play = useCallback(async (URL) => {
    console.log(`${serverURLRef.current}/record/getRecordLink?name=${URL}`)
    await TrackPlayer.setupPlayer();
    await TrackPlayer.add([{
      id: 'trackId',
      url: `${serverURLRef.current}/record/getRecordLink?name=${URL}`,
      // url: `${serverURLRef.current}/record/getRecordLink?name=/UploadFiles/RNWqt/20221010/2022101020061298785.m4a`,
      title: 'Track Title',
    }]);

    await TrackPlayer.play();
  }, []);

  const stop = useCallback(async () => {
    await TrackPlayer.stop();
  }, []);

  const selectFile = useCallback(async (taskInfo) => {
    console.log('.....手动上传taskInfo......',taskInfo);
    if (disabled) {
      return;
    }

    disabled = true;
    if(taskInfo.FULLNAME!=='未找到通话录音')
  {
    DeviceEventEmitter.emit(UPLOAD_RECORD, {
      fullPath:taskInfo.FULLNAME,
      taskInfo: JSON.parse(JSON.stringify(taskInfo)),
    });
    disabled = false;
  }
  else{
    try {
      const { uri } = await DocumentPicker.pickSingle();

      const path = decodeURIComponent(uri).split(':')[2];
      const fullPath = '/storage/emulated/0/' + path;

      // 上传录音
      // showTopMessage('路径：' + fullPath);
      DeviceEventEmitter.emit(UPLOAD_RECORD, {
        fullPath,
        taskInfo: JSON.parse(JSON.stringify(taskInfo)),
      });
      console.log(fullPath);
    } catch (err) {
      console.log(err);
    } finally {
      disabled = false;
    }
  }

  }, []);

  // 列表项
  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.top}>
          <Text style={styles.text}>关联任务：<Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.LSH} : {item.CCXH}</Text></Text>
          <Text style={styles.text}>上传者ID：{item.MEMBER_ID}</Text>
          <Text style={styles.text}>被叫号码：{item.BJHM}</Text>
          <Text style={styles.text}>拨号时间：<Text style={{ color: '#409EFF' }}>{dayjs(item.CALL_TIME).format('YYYY-MM-DD HH:mm:ss')}</Text> </Text>
          <Text style={styles.text}>通话开始时间：{dayjs(item.START_TIME).format('YYYY-MM-DD HH:mm:ss')}</Text>
          <Text style={styles.text}>通话结束时间：{dayjs(item.HANGUP_TIME).format('YYYY-MM-DD HH:mm:ss')}</Text>
          <Text style={styles.text}>通话时长：{item.DURATION}秒</Text>
          <Text style={styles.text}>本地录音位置：{item.FULLNAME}</Text>
        </View>
        <View style={styles.bottom}>
          {
            item.URL && (
              <>
                <ZitButton style={styles.playBtn} iconName="play-circle-outline" type='primary' title="播放" onPress={() => play(item.URL)}></ZitButton>
                <ZitButton style={styles.stopBtn} iconName="stop-circle-outline" type='danger' title="停止" onPress={stop}></ZitButton>
              </>
            )
          }
          {
            item.IS_ANSWERED == 1
              ? (
                item.URL
                  ? <ZitButton style={styles.opBtn} iconName='checkmark-circle-outline' type='success' title="已上传"></ZitButton>
                  : <ZitButton style={styles.opBtn} iconName='cloud-upload-outline' type='warning' title="手动上传" onPress={() => selectFile(item)}></ZitButton>
              )
              : <ZitButton style={styles.opBtn} iconName="notifications-off-outline" type='info' title="电话未接通"></ZitButton>
          }
        </View>
      </View>
    );
  }

  const getRecordList = async () => {
    setRefreshing(true);

    try {
      const { result, data: { Success, entity } } = await getCallRecord({
        CZDH: bindInfo.vehicle?.id
      });

      // console.log(entity);

      if (result == 1 && Success) {
        console.log('entity数据：',entity.slice(0, 30));
        let newList=entity.slice(0, 30);
        // newList.map((item)=>{
        //     if(item.FULLNAME!='未找到通话录音' && !item.URL){
        //       DeviceEventEmitter.emit(UPLOAD_RECORD, {
        //         fullPath:item.FULLNAME,
        //         taskInfo: JSON.parse(JSON.stringify(item)),
        //       });
        //     }
        //     return item
        // })
        setRecordList(newList);
      } else {
        showTopMessage('通话录音获取失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('通话录音获取失败');
    } finally {
      setRefreshing(false);
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });

    }
  };

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getRecordList();
  }, []);

  return (
    <View style={styles.container}>
      {
        (recordList && recordList.length === 0)
          ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Image
              style={{ width: 200, height: 200 }}
              resizeMode='cover'
              source={require("@app/assets/img/empty.jpg")}
            />
            <Text>暂无数据</Text>
          </ScrollView>
          :
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={recordList}
            keyExtractor={item => (item.ID)}
            renderItem={renderItem}
          />
      }
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // width: 60,
    // height:100,
    marginTop: 10,
  },
  text: {
    color: '#455465',
  },
  playBtn: {
    flex: 1,
  },
  stopBtn: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  opBtn: {
    flex: 1,
  }


});

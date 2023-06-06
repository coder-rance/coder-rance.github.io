import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Image, } from 'react-native';
import { getData, storeData } from '@app/utils/storage';
import { ZitButton } from '@app/components';
import dayjs from 'dayjs';
import { uploadCallInfo } from '@app/common/utils';
import { showTopMessage } from '@app/utils/toast';

export const RemainingList = memo(() => {
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef();
  listRef.current = list;
  // var flag=false;

  useEffect(() => {
    getCallInfoList();
  }, []);

  const getCallInfoList = async () => {
    setRefreshing(true);
    const callInfoList = await getData('$callInfoList');

    console.log(callInfoList);

    if (callInfoList == null) {
      setList([]);
    } else {
      setList(callInfoList);
    }
    setRefreshing(false);
  };

  // 上传记录
  const uploadInfo = async (info) => {
    console.log(info);
    try {
      const { isOK } = await uploadCallInfo(info);
      if (isOK) {
        // console.log(newList)
        const newList = listRef.current.filter(item => item.RECALL_TIME != info.RECALL_TIME);
        setList(newList);
        storeData('$callInfoList', newList);
        showTopMessage('通话信息上传成功');

      } else {
        showTopMessage('通话信息上传失败');
      }
    } catch (err) {
      showTopMessage('通话信息上传失败');

    }
  };

  const renderItem = useCallback(({ item }) => {
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
          <ZitButton
            style={styles.playBtn}
            iconName="cloud-upload-outline"
            type='warning'
            title="上传记录"
            onPress={() => uploadInfo(item)}>
          </ZitButton>
        </View>
      </View>
    );
  }, []);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    getCallInfoList();
  }, []);

  return (
    <View style={styles.container}>
      {
        (list && list.length === 0)
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
            data={list}
            keyExtractor={item => (item.START_TIME)}
            renderItem={renderItem}
          />
      }
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
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
  playBtn: {
    flex: 1,
    marginTop: 10,
  },
});
import React, { memo, useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Image } from 'react-native';
import CallRecord from 'react-native-call-record';
import { showTopMessage } from '@app/utils/toast';

const callType = {
  MISSED_TYPE: {
    title: '失败',
    color: '#F56C6C'
  },
  OUTGOING_TYPE: {
    title: '呼出',
    color: '#409EFF',
  },
  INCOMING_TYPE: {
    title: '来电',
    color: '#409EFF',
  },
  5:{
    title: '未知',
    color: '#409EFF',
  },
  6:{
    title: '未知',
    color: '#409EFF',
  }
};

// 列表项
const renderItem = ({ item }) => {
  console.log('test Data',item);
  return (
    <View key={item.dateTime} style={styles.item}>
      <View style={styles.left}>
        <Text style={[styles.type, { color: callType[item.type].color }]}>{callType[item.type]?.title}</Text>
      </View>
      <View style={styles.right}>
        <Text>对方号码：{item.phoneNumber}</Text>
        <Text>通话时间：{item.dateTime}</Text>
        <Text>持续时间：{item.duration}秒</Text>
      </View>
    </View>
  );
}

export const CallList = memo(() => {
  const [callLogList, setCallLogList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCallLogList();
  }, []);

  //获取所有通话记录
  const getCallLogList = async () => {
    setRefreshing(true);
    try {
      let callLogList = await CallRecord.getAll({ limit: 30 });

      setCallLogList(callLogList);
      // console.log('=====通话记录=====');
      // console.log(callLogList);
    } catch (err) {
      console.log(err)
      showTopMessage('获取通话记录失败');
    } finally {
      setRefreshing(false);
    }
  }

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCallLogList();
  }, []);

  return (
    <View style={styles.container}>
      {
        (callLogList && callLogList.length === 0)
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
            data={callLogList}
            keyExtractor={item => (item.dateTime)}
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
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 1,
    padding: 15,
  },
  left: {
    display: 'flex',
    width: 80,
    height: 80,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#ecf0f1',
  },
  type: {
    color: '#000',
    fontWeight: 'bold',
  },
  right: {

  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
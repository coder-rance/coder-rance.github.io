import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Image, StatusBar, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { ZitHeader, ZitInput, ZitButton } from '@app/components';
import { tasksByID } from '@app/api/task';
import { showTopMessage } from '@app/utils/toast';
import { TaskList } from '@app/common/TaskList';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export const History = memo(({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [HJYY, setHJYY] = useState('');
  const [JCDZ, setJCDZ] = useState('');
  const [beginTime, setBeginTime] = useState(dayjs().format('YYYY-MM-DD 00:00:00'));
  const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DD 23:59:59'));
  const [beginTimeVisible, setBeginTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  const [list, setList] = useState([]);
  const userInfo = useSelector(state => state.userInfo);
  const bindInfo = useSelector(state => state.bindInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    getList(beginTime, endTime, JCDZ, HJYY);
  }, []);


  // 获取任务列表
  const getList = async (begin_slsj, end_slsj, hjyy, jcdz) => {
    setLoading(true);

    try {
      const tel = bindInfo.vehicle?.id;
      const id = userInfo.Account;

      const { data: { Success, entity } } = await tasksByID({
        id,
        tel,
        begin_slsj,
        end_slsj,
        hjyy,
        jcdz,
      });

      if (Success) {
        setList(entity || []);
      } else {
        showTopMessage('拉取失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('拉取失败,请检查网络');
    } finally {
      setLoading(false);
    }
  };

  // 查询
  const query = () => {
    console.log(HJYY, JCDZ, beginTime, endTime);
    getList(beginTime, endTime, HJYY, JCDZ);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title={loading ? '加载中' : '历史查询'}
        indicator={loading}
      />
      {
        beginTimeVisible && <DateTimePicker
          testID="datePickerStart"
          value={new Date()}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            console.log(selectedDate)
            setBeginTimeVisible(false);
            setBeginTime(dayjs(selectedDate).format('YYYY-MM-DD 00:00:00'));
          }}
        />
      }
      {
        endTimeVisible && <DateTimePicker
          testID="datePickerEnd"
          value={new Date()}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(event, selectedDate) => {
            setEndTimeVisible(false);
            setEndTime(dayjs(selectedDate).format('YYYY-MM-DD 23:59:59'));
          }}
        />
      }
      <View style={{ flex: 1 }}>
        <View style={styles.bg}></View>
        <View style={styles.queryContainer}>
          <View style={styles.query}>
            <View style={styles.tabs}>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.tabItem, activeIndex == 0 && styles.active]}
                onPress={() => setActiveIndex(0)}
              >
                <Text style={[{ paddingBottom: 10, paddingTop: 10 }, activeIndex == 0 && styles.activeText]}>时间选择</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.tabItem, activeIndex == 1 && styles.active]}
                onPress={() => setActiveIndex(1)}
              >
                <Text style={[{ paddingBottom: 10, paddingTop: 10 }, activeIndex == 1 && styles.activeText]}>附加条件</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              {
                activeIndex == 0
                  ?
                  <View style={styles.date}>
                    <TouchableOpacity style={styles.dateItem} onPress={() => setBeginTimeVisible(true)}>
                      <Text>{beginTime}</Text>
                    </TouchableOpacity>
                    <Text>至</Text>
                    <TouchableOpacity style={styles.dateItem} onPress={() => setEndTimeVisible(true)}>
                      <Text>{endTime}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View>
                    <ZitInput
                      style={{ marginBottom: 10 }}
                      iconName="chatbox-ellipses-outline"
                      value={HJYY}
                      onChangeText={setHJYY}
                      placeholder="请输入呼救原因"
                    />
                    <ZitInput
                      style={{ marginBottom: 10 }}
                      iconName="location-outline"
                      value={JCDZ}
                      onChangeText={setJCDZ}
                      placeholder="请输入接车地址"
                    />
                  </View>
              }
              <ZitButton
                title="查 询"
                onPress={query}
              />
            </View>
          </View>
          <View style={styles.result}>
            {
              (list && list.length == 0)
                ?
                <View style={styles.emptyView}>
                  <Image
                    style={{ width: 200, height: 200 }}
                    resizeMode='cover'
                    source={require("@app/assets/img/empty.jpg")}
                  />
                  <Text>暂无数据</Text>
                </View>
                :
                <TaskList
                  data={list}
                />
            }
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  bg: {
    height: 100,
    backgroundColor: '#409EFF',
  },
  queryContainer: {
    display: 'flex',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: -100,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
  },
  query: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: 15,
  },

  tabs: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  tabItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content: {
    padding: 10,
  },
  date: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateItem: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  active: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  activeText: {
    borderBottomColor: '#409EFF',
    borderBottomWidth: 2,
  },
  result: {
    flex: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 5,

  },
  emptyView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
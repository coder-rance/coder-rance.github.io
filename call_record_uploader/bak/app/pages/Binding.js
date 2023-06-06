import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';
import { ZitHeader, ZitButton } from '@app/components';
import { Selector } from './Binding/Selector';
import { SelectionList } from './Binding/SelectionList';
import { getCarsByOrg, getOrgs } from '@app/api/binding'
import { showTopMessage } from '@app/utils/toast';
import { storeData } from '@app/utils/storage';
import { Native_Subscribe } from '@app/mq';

export function Binding({ navigation }) {
  const [stationVisible, setStationVisible] = useState(false);
  const [vehicleVisible, setVehicleVisible] = useState(false);
  const [curStation, setCurStation] = useState({});
  const [curVehicle, setCurVehicle] = useState({});
  const [stationList, setStationList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const serverURL = useSelector(state => state.serverURL);
  const bindInfo = useSelector(state => state.bindInfo);
  const userInfo = useSelector(state => state.userInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    setCurStation(bindInfo.station ?? {});
    setCurVehicle(bindInfo.vehicle ?? {});
  }, []);

  // 获取所有站点
  const getStations = async () => {
    dispatch({
      type: 'setLoadingVisible',
      data: true,
    });

    try {
      const { result, data } = await getOrgs({});
      if (result == 1) {
        setStationVisible(true);
        setStationList(data);
      } else {
        showTopMessage('获取站点失败');
      }
    } catch (err) {
      showTopMessage('获取站点失败');
      console.log(err);
    } finally {
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });
    }
  };

  // 获取站点车辆
  const getVehicles = async (id) => {
    dispatch({
      type: 'setLoadingVisible',
      data: true,
    });
    try {
      const { result, data } = await getCarsByOrg({ id });
      console.log('222222222222222',data)
      if (result == 1) {
        setVehicleVisible(true);
        setVehicleList(data);
      } else {
        showTopMessage('获取车辆失败');
      }
    } catch (err) {
      showTopMessage('获取车辆失败');
      console.log(err);
    } finally {
      dispatch({
        type: 'setLoadingVisible',
        data: false,
      });
    }
  };

  // 进入主界面
  const prevPage = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'TabNavigator' }],
    },
      null,
    );
    navigation.dispatch(resetAction);
  };

  // 绑定车辆
  const bindVehicle = async () => {
    if (!curStation.name) {
      return showTopMessage('请选择站点');
    }

    if (!curVehicle.name) {
      return showTopMessage('请选择车辆');
    }

    const bindInfo = {
      vehicle: curVehicle,
      station: curStation,
    };
    console.log('新绑定车辆信息: ', bindInfo);
    dispatch({
      type: 'setLoadingVisible',
      data: true
    });

    try {
      const isOk = await storeData('$bindInfo', bindInfo);
      if (isOk) {
        dispatch({
          type: 'setBindInfo',
          data: bindInfo
        });

        showTopMessage('绑定成功');
        prevPage();
        
        dispatch({
          type: 'setLoadingVisible',
          data: false
        });
        let timer = setTimeout(() => {
          Native_Subscribe(userInfo, bindInfo, serverURL);
          clearTimeout(timer);
        }, 300);
      } else {
        showTopMessage('绑定失败');
        dispatch({
          type: 'setLoadingVisible',
          data: false
        });
      }
    } catch (err) {
      console.log(err);
      showTopMessage('绑定失败');
      dispatch({
        type: 'setLoadingVisible',
        data: false
      });
    } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title="设置车辆信息"
        leftIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
        }
      />
      <Selector
        title="站点信息"
        content={curStation.name ? curStation.name : '请选择'}
        btnText="选择站点"
        onPress={() => getStations()}
      />
      <Selector
        title="车辆信息"
        content={curVehicle.name ? curVehicle.name : '请选择'}
        btnText="选择车辆"
        onPress={() => getVehicles(curStation.id)}
      />
      <View style={{ margin: 10, marginTop: 30 }}>
        <ZitButton title="绑定车辆信息" onPress={bindVehicle}></ZitButton>
      </View>
      <SelectionList
        title="请选择站点"
        visible={stationVisible}
        current={curStation}
        data={stationList}
        onConfirm={(selection) => {
          setCurStation(selection);
          setCurVehicle({});
          setStationVisible(false);
        }}
        onCancel={() => setStationVisible(false)}>
      </SelectionList>
      <SelectionList
        title="请选择车辆"
        current={curVehicle}
        visible={vehicleVisible}
        data={vehicleList}
        onConfirm={(selection) => {
          setCurVehicle(selection);
          setVehicleVisible(false);
        }}
        onCancel={() => setVehicleVisible(false)}>
      </SelectionList>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
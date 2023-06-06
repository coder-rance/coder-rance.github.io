//核心库
import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Linking,
  Alert,
} from 'react-native';
//第三方库
import { BottomSheet, ListItem, Divider } from 'react-native-elements';

// const { width, height } = Dimensions.get('window');

// 打开地图
const openMap = async (url, text) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    Linking.openURL(url);
  } else {
    Alert.alert('提示', text, [{ text: "确认" }]);
  }
};

export default function ZitNavi({ visible, naviInfo, onCancel, onConfirm }) {
  const { address = '', lng = 0, lat = 0 } = naviInfo;

  return (
    <BottomSheet isVisible={visible}>
      <View>
        <ListItem
          containerStyle={styles.containerStyle}
          onPress={() => {
            onConfirm();
            const destination =
              (lng && lat) ? `name:${address}|latlng:${lat},${lng}` : address;
            const coord_type = 'gcj02';
            const mode = 'driving';
            const url = `baidumap://map/direction?destination=${destination}&coord_type=${coord_type}&mode=${mode}&sy=0&src=andr.baidu.openAPIdemo`;
            openMap(url, "请安装百度地图!");
          }}>
          <ListItem.Content>
            <ListItem.Title style={styles.titleStyle}>
              百度地图
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Divider style={{ backgroundColor: '#b2bec3' }} />

        <ListItem
          containerStyle={styles.containerStyle}
          onPress={() => {
            onConfirm();
            const dname = address;
            let url = `amapuri://route/plan/?sname=我的位置&dname=${dname}&dev=0&t=0&pkg=com.autonavi.minimap`;

            if (lng && lat) {
              url = `amapuri://route/plan/?sname=我的位置&dname=${dname}&dlon=${lng}&dlat=${lat}&dev=0&t=0&pkg=com.autonavi.minimap`;
            }

            openMap(url, "请安装高德地图!");
          }}>
          <ListItem.Content>
            <ListItem.Title style={styles.titleStyle}>
              高德地图
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <Divider style={{ backgroundColor: '#b2bec3' }} />

        <ListItem
          onPress={onCancel}>
          <ListItem.Content>
            <ListItem.Title style={{color: '#F56C6C'}}>取消</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  overlayStyle: {
    width: '90%',
    // height: 500,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 0,
  },
  cardContainerStyle: {
    // padding: 0,
    margin: 0,
    width: '90%',
    // width: width / 1.2,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#34495e',
  },
  text: {
    height: 24,
    lineHeight: 24,
    fontSize: 16,
    color: '#34495e',
  },
  buttonStyle: {
    // width: 80,
    borderRadius: 10,
  },
  lxdh: {
    color: '#2980b9',
  },
});



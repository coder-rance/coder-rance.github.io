import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const icon = require('@app/assets/img/ambulance.png');

export const TaskListItem = ({ item, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          {
            item.isHot && <View style={styles.hot}></View>
          }
          <Image resizeMode='contain' style={styles.icon} source={icon} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.items}>
          <Text style={styles.LSH}>流水号:{item.LSH} : {item.CCXH}</Text>
        </View>
        <Text style={styles.text}>接车地址: {item.JCDZ}</Text>
        <Text style={styles.text}>呼救原因: {item.HJYYBC}</Text>
        <Text style={styles.text}>联系电话: <Text style={{ color: '#409EFF' }}>{item.LXDH}</Text></Text>
        <View style={styles.status}>
          <Text style={styles.text}>任务状态: </Text>
          <Text style={{
            fontSize: 14,
            textAlign: 'right',
            color: item.FLAG == 0 ? '#F56C6C' : item.SFQXPC == 1 ? '#E6A23C' : '#67C23A'
          }}>
            {
              item.FLAG == 0
                ? item.STATUS_NAME
                : item.SFQXPC == 1 ? '取消派车' : item.FLAG_SM
            }
          </Text>
        </View>

        <Text style={styles.text}>派车时间: {item.PCSJ ? item.PCSJ : '时间未知'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#ecf0f1',
    borderBottomWidth: 2,
    padding: 10,

  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#409EFF',
    padding: 5,
    borderRadius: 10,
  },
  hot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F56C6C',
  },
  icon: {
    width: 36,
    height: 36,
  },
  items: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  LSH: {
    textAlign: 'left',
    // fontSize:15,
    fontWeight: 'bold',
  },
  CCXH: {
    color: '#767676'
  },
  status: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: '#767676',
  }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


export function AvatarInfo({ userName, account,phoneNumber, typeName }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <Image style={styles.img} resizeMode='contain' source={require('@app/assets/img/avatar.png')} />
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.item}>账号：{account}</Text>
          <View style={styles.typeNameWrapper}>
            <Text style={styles.item}>职务：{typeName}</Text>
          </View>
          <Text style={styles.item}>电话：{phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.rightWrapper} >
        {/* <Ionicons
          name="chevron-forward-outline"
          size={24}
          color="#a2a2a2"
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  leftWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    marginRight: 20,
    marginLeft: 10,
    width: 70,
    height: 70,
  },
  rightWrapper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  // account: {
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  typeNameWrapper: {
    borderColor: '#ededed',
  },
  typeName: {
    fontSize: 16,
  }
});

// 启动页
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';


const banner = require("../assets/img/banner.png");

export default function LaunchPage({ launchEnd }) {
  let timer = setTimeout(() => {
    console.log('动画结束', launchEnd);
    launchEnd(true);
    clearTimeout(timer);
  }, 1000);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image style={styles.cover} resizeMode='cover' source={banner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    backgroundColor: '#fff'
  },
  cover: {
    flex: 1,
  }
});




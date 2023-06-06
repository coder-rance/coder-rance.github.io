import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ZitHeader, ZitListItem, ZitInput, ZitButton } from '@app/components';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Setting = ({ navigation }) => {
  const serverURL = useSelector(state => state.serverURL);
  const IMEI = useSelector(state => state.IMEI);

  const editRecordPath = ()=>{
    navigation.navigate('EditRecordPath');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title="更多信息"
        leftIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1 }}>
        <ZitListItem title='录音上传策略' content='通话相关'></ZitListItem>
        <ZitListItem title='服务地址' content={serverURL}></ZitListItem>
        <ZitListItem title='IMEI' content={IMEI}></ZitListItem>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          activeOpacity={0.7}
          onPress={editRecordPath}
        >
          <ZitListItem title='通话录音路径' showIcon={true} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    // backgroundColor: '#fff',
  },
});
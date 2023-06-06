import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ZitHeader, ZitListItem, ZitInput, ZitButton } from '@app/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { storeData } from '@app/utils/storage';
import { showTopMessage } from '@app/utils/toast';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export const EditRecordPath = ({ navigation }) => {
  const [tempRecordPath, setTempRecordPath] = useState('');
  const recordPath = useSelector(state => state.recordPath);
  const dispatch = useDispatch();

  useEffect(() => {
    setTempRecordPath(recordPath);
  }, []);

  // 选择路径
  const selectPath = async () => {
    try {
      const { uri } = await DocumentPicker.pickDirectory();
      const path = decodeURIComponent(uri).split(':')[2];
      const fullPath = '/storage/emulated/0/' + path;
      setTempRecordPath(fullPath);

      const res = await RNFS.readDir(fullPath);
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  // 保存
  const save = async () => {
    if (tempRecordPath === '') {
      return showTopMessage('通话录音路径不能为空');
    }

    try {
      const isOk = await storeData('$recordPath', tempRecordPath);
      if (isOk) {
        dispatch({
          type: 'setRecordPath',
          data: tempRecordPath,
        });
        navigation.goBack();
        showTopMessage('通话录音路径保存成功');

      } else {
        showTopMessage('通话录音路径保存失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('通话录音路径保存失败');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title="通话录音路径"
        leftIcon={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
        }
        // rightIcon={
        //   <TouchableOpacity onPress={save}>
        //     <Text style={{ color: '#fff', fontSize: 14 }}>保存</Text>
        //   </TouchableOpacity>
        // }
      />
      <ScrollView style={{ flex: 1, padding: 15, paddingTop: 30 }}>
        <ZitInput
          iconName="folder-outline"
          value={tempRecordPath}
          onChangeText={setTempRecordPath}
          placeholder="请输入通话录音路径"
        />
        <View style={{
          flexDirection: 'row',
          marginTop: 30,
        }}>
          <ZitButton style={{ flex: 1, marginRight: 5 }} type="warning" title="选择路径" onPress={selectPath}></ZitButton>
          <ZitButton style={{ flex: 1, marginLeft:5}} title="保存" onPress={save}></ZitButton>
        </View>
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
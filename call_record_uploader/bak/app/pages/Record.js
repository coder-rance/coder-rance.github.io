import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import 'react-native-gesture-handler';
import { View, Text, StatusBar, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ZitHeader } from '@app/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CallList } from './Record/CallList';
import { ContactList } from './Record/ContactList';
import { RecordList } from './Record/RecordList';
import { RemainingList } from './Record/RemainingList';

// const TabTop = createMaterialTopTabNavigator(); 

export function Record({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#409EFF" />
      <ZitHeader
        title="通 话"
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' }}>
        <TouchableOpacity onPress={() => setActiveIndex(0)}>
          <Text style={{ color: activeIndex == 0 ? '#3f9cfb' : '#000' }}>通话记录</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveIndex(1)}>
          <Text style={{ color: activeIndex == 1 ? '#3f9cfb' : '#000' }}>通讯录</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveIndex(2)}>
          <Text style={{ color: activeIndex == 2 ? '#3f9cfb' : '#000' }}>录音记录</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveIndex(3)}>
          <Text style={{ color: activeIndex == 3 ? '#3f9cfb' : '#000' }}>待上传</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        {
          activeIndex == 0 && <CallList></CallList>
        }
        {
          activeIndex == 1 && <ContactList></ContactList>
        }
        {
          activeIndex == 2 && <RecordList></RecordList>
        }
        {
          activeIndex == 3 && <RemainingList></RemainingList>
        }
      </View>
      {/* <TabTop.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 15 },
          tabBarIndicatorStyle: { backgroundColor: '#409EFF' },
          tabBarActiveTintColor: '#409EFF',
          tabBarInactiveTintColor: '#909399',
          tabBarPressColor: '#fff',
          tabBarStyle: { backgroundColor: '#fff' },
        }}>
        <TabTop.Screen options={{ tabBarLabel: "通话记录" }} name="CallList" component={CallList} />
        <TabTop.Screen options={{ tabBarLabel: "通讯录" }} name="ContactList" component={ContactList} />
        <TabTop.Screen options={{ tabBarLabel: "录音记录" }} name="RecordList" component={RecordList} />
        <TabTop.Screen options={{ tabBarLabel: "待上传" }} name="RemainingList" component={RemainingList} />

      </TabTop.Navigator> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
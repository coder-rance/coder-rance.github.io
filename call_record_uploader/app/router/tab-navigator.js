import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RecordPage } from '@app/pages/record';
import { HistoryPage } from '@app/pages/history';
import { MePage } from '@app/pages/me';
import { useExitApp } from '@app/hooks/useExitApp';

const icons = {
  'History': { active: 'ios-book', inactive: 'ios-book-outline' },
  'Record': { active: 'ios-call', inactive: 'ios-call-outline' },
  'Me': { active: 'person', inactive: 'person-outline' },
};


const screenOptions = ({ route }) => ({
  headerShown:false,
  tabBarColor: false,
  tabBarLabel: '',
  tabBarActiveTintColor: "#409EFF",
  tabBarInactiveTintColor: "#000",
  tabBarLabelStyle: {
    fontSize: 12,
    marginBottom: 5
  },
  tabBarItemStyle: {},
  tabBarLabelPosition: "below-icon",
  tabBarStyle: [
    {
      "display": "flex"
    },
    null
  ],
  tabBarIcon: ({ focused, color }) => {
    const name = focused
      ? icons[route.name]['active']
      : icons[route.name]['inactive'];
    return <Ionicons name={name} size={18} color={color} />;
  },
});

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  // useExitApp();
  return (
    <Tab.Navigator
      initialRouteName="Task"
      // backBehavior='none'
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="History"
        component={HistoryPage}
        options={{
          tabBarLabel: '历史',
        }}
      />
      <Tab.Screen
        name="Record"
        component={RecordPage}
        options={{
          tabBarLabel: '通话',
        }}
      />
      <Tab.Screen
        name="Me"
        component={MePage}
        options={{
          tabBarLabel: '我',
        }}
      />
    </Tab.Navigator>
  );
}
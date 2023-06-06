import React ,{useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getVersion } from 'react-native-device-info';
import { Native_CheckUpdate } from '@app/mq';
import { useSelector } from 'react-redux';
import { Task } from '@app/pages/Task';
import { Record } from '@app/pages/Record';
import { History } from '@app/pages/History';
import { Me } from '@app/pages/Me';

const icons = {
  'Task': { active: 'list', inactive: 'list-outline' },
  'History': { active: 'ios-book', inactive: 'ios-book-outline' },
  'Record': { active: 'ios-call', inactive: 'ios-call-outline' },
  'Me': { active: 'person', inactive: 'person-outline' },
};


const screenOptions = ({ route }) => ({
  tabBarColor: false,
  tabBarLabel: '',
  tabBarIcon: ({ focused, color }) => {
    const name = focused
      ? icons[route.name]['active']
      : icons[route.name]['inactive'];
    return <Ionicons name={name} size={18} color={color} />;
  },
});

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const serverURL = useSelector(state => state.serverURL);
  useEffect(() => {
    console.log('版本',getVersion());
    Native_CheckUpdate(serverURL);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Task"
      screenOptions={screenOptions}
      tabBarOptions={{
        activeTintColor: "#409EFF",
        inactiveTintColor: "#000",
        tabStyle: {
          // height:60
        },
        labelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        labelPosition: 'below-icon'
      }}
    >
      <Tab.Screen
        name="Task"
        component={Task}
        options={{
          tabBarLabel: '任务',

        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: '历史',
        }}
      />
      <Tab.Screen
        name="Record"
        component={Record}
        options={{
          tabBarLabel: '通话',
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        options={{
          tabBarLabel: '我',
        }}
      />
    </Tab.Navigator>
  );
}
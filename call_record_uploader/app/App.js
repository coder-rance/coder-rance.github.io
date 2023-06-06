import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import store from './store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setAllTaskList } from './store/features/taskSlice';
import LaunchPage from './pages/Launch';

function HomeScreen() {
  const { taskList } = useSelector(state => state.task);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="rocket" size={30} color="#900" />
      <Text>
        {taskList}
      </Text>
      <Button title='btn' onPress={() => {
        const result = Date.now();

        dispatch(setAllTaskList(result));
      }
      }></Button>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  const [isLaunched, setLaunch] = useState(false);

  const launchEnd = (flag) => {
    setLaunch(flag);
  }

  return (
    <Provider store={store}>
      {
        isLaunched
          ? <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          : <LaunchPage launchEnd={launchEnd}></LaunchPage>
      }

    </Provider>
  );
}

export default App;
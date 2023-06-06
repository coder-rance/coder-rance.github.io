import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Login} from '@app/pages/Login';
import {TabNavigator} from './TabNavigator';
import {Binding} from '@app/pages/Binding';
import {navigationRef} from './RootNavigation';
import {Setting} from '@app/pages/Setting';
import {EditRecordPath} from '@app/pages/EditRecordPath';

const Stack = createStackNavigator();

const LoginOptions = {};

const TabNavigatorOptions = {};

export default function StackNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        mode="card"
        headerMode="none"
        screenOptions={{
          cardOverlayEnabled: true,
          animationTypeForReplace: 'push',
          headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={LoginOptions} />
        <Stack.Screen name="Binding" component={Binding} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="EditRecordPath" component={EditRecordPath} />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={TabNavigatorOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

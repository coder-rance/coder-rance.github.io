import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginPage } from '@app/pages/login';
import { HomePage } from '@app/pages/home';
import { TabNavigator } from '@app/router/tab-navigator';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

// 登录页面配置
const LoginOptions = {
  title: '欢迎使用'
};

const TabNavigatorOptions = {
  // animationTypeForReplace: 'push',
  // animation:'slide_from_right'
};

export function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            presentation: 'card',
            cardOverlayEnabled: true,
            animationTypeForReplace: 'push',
            animation: 'slide_from_right',
            // headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
            // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}

        >
          <Stack.Screen name="Login" component={LoginPage} options={LoginOptions} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={TabNavigatorOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
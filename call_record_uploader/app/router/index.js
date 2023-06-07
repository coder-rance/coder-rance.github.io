import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoginPage } from '@app/pages/login';
import { HomePage } from '@app/pages/home';

const Stack = createNativeStackNavigator();

// 登录页面配置
const LoginOptions = {
  title: '欢迎使用'
};



export function Navigation() {
  return (<NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginPage} options={LoginOptions}/>
      <Stack.Screen name="Home" component={HomePage} />
    </Stack.Navigator>
  </NavigationContainer>)
}
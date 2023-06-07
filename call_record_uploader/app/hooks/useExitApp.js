import { useState, useEffect, useCallback, useRef } from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

export function useExitApp() {
  let backPress = false;
  const routesLength = useNavigationState(state => state.routes.length);

  const onBackPress = () => {
    if (routesLength > 1) return false;

    if (backPress) {
      backPress = false;
      BackHandler.exitApp();
      return false;
    } else {
      ToastAndroid.show('再按一次退出应用', 2000);
      let timer = setTimeout(()=>{
        backPress = false;
        clearTimeout(timer);
      }, 2000);
      backPress = true;
      return true;
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
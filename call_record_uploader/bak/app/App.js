import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StatusBar, useWindowDimensions, BackHandler } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import store from '@app/store';
import Launch from "@app/pages/Launch.js"
import Navigations from "@app/router/Navigations.js";
import { GlobalComponents } from '@app/Global';

export default function App() {
  const [launch, setLaunch] = useState(false);
  //获取手机宽度和高度
  const width = useWindowDimensions().width;
  const height = useWindowDimensions().height;

  // 动画结束后展示主界面
  const launchEnd = (flag) => {
    setLaunch(flag);
  }

  return (
    <Provider store={store}>
      <View style={{ width, height, backgroundColor: '#fff' }}>
        {
          launch
            ?
            (<SafeAreaView style={{ flex: 1}}>
              <Navigations />
              <GlobalComponents />
            </SafeAreaView>)
            : (<Launch launchEnd={launchEnd} />)
        }
      </View>
    </Provider>
  );
}
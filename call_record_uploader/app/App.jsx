import React, {useState, useEffect} from 'react';
import store from '@app/store';
import {Provider} from 'react-redux';
import {Navigation} from '@app/router';
import {LaunchPage} from '@app/pages/launch';
import {NativeBaseProvider} from 'native-base';

function App() {
  const [isLaunched, setLaunch] = useState(false);

  // 启动结束调用
  const launchEnd = flag => {
    setLaunch(flag);
  };

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        {isLaunched ? (
          <Navigation></Navigation>
        ) : (
          <LaunchPage launchEnd={launchEnd}></LaunchPage>
        )}
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;

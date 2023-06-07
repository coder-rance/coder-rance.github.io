import {useNavigation, CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Box, Container, Button, Flex, Text} from 'native-base';
import {EasyInput} from '@app/components';
import {useExitApp} from '@app/hooks/useExitApp';
import {Image, StyleSheet} from 'react-native';

const logoIcon = require('@app/assets/img/china-night.png');

export function LoginPage() {
  const navigation = useNavigation();
  const [account, setAccount] = useState();
  const [password, setPassword] = useState();

  const onLogin = () => {
    const resetAction = CommonActions.reset(
      {
        index: 0,
        routes: [{name: 'TabNavigator'}],
      },
      null,
    );
    navigation.dispatch(resetAction);
    // navigation.navigate('TabNavigator');
  };

  useExitApp();

  return (
    <Flex direction="column" p={5} flex={1} bgColor={'#fff'}>
      <Image resizeMode="contain" style={styles.inset} source={logoIcon} />

      <EasyInput
        value={account}
        setValue={setAccount}
        placeholder="请输入账号"
        icon="person"
        mt={5}></EasyInput>

      <EasyInput
        type="password"
        value={password}
        setValue={setPassword}
        placeholder="请输入密码"
        icon="key"
        mt={5}></EasyInput>

      <Button mt={8} onPress={onLogin}>
        登录
      </Button>
    </Flex>
  );
}

const styles = StyleSheet.create({
  inset: {
    width: '100%',
    height: 200,
    borderRadius:15
  },
});

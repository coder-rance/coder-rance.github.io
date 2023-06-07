import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  Stack,
  Box,
  Button,
  Flex,
  Text,
  Input,
  useToast,
  Spacer,
  Icon,
  Pressable,
} from 'native-base';
import {EasyInput} from '@app/components';

export function LoginPage() {
  const navigation = useNavigation();
  const toast = useToast();
  const [show, setShow] = useState();
  const [account, setAccount] = useState();
  const [password, setPassword] = useState();

  const onLogin = () => {
    toast.show({
      description: '登录成功',
      duration: 2000,
    });

    navigation.navigate('Home');
  };

  return (
    <Box>
      <Flex direction="column" m={5}>
        <EasyInput
          value={account}
          setValue={setAccount}
          placeholder="请输入账号"
          icon="person"
          mt={2.5}></EasyInput>

        <EasyInput
          type="password"
          value={password}
          setValue={setPassword}
          placeholder="请输入密码"
          icon="key"
          mt={2.5}></EasyInput>

        <Button  mt={8} onPress={onLogin}>
          登录
        </Button>
      </Flex>
    </Box>
  );
}

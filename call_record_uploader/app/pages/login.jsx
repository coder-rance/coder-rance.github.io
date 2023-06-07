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

export function LoginPage() {
  const navigation = useNavigation();
  const toast = useToast();
  const [show, setShow] = useState();
  const [account, setAccount] = useState();
  const [password, setPassword] = useState();

  const onLogin = () => {
    toast.show({
      description:'登录成功',
      duration: 2000
    });

    navigation.navigate('Home');
  };

  return (
    <Box>
      <Flex direction="column" align="center" justifyContent="center" m={5}>
        <Input
          value={account}
          InputLeftElement={
            <Icon
              as={<Ionicons name="person" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          mt={2.5}
          mb={2.5}
          size="md"
          placeholder="请输入账号"
        />
        <Input
          value={password}
          InputLeftElement={
            <Icon
              as={<Ionicons name="key" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          type={show ? 'text' : 'password'}
          InputRightElement={
            <Pressable onPress={() => setShow(!show)}>
              <Icon
                as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
                size={5}
                mr="2"
                color="muted.400"
              />
            </Pressable>
          }
          size="md"
          placeholder="请输入密码"
        />
      </Flex>
      <Button
        variant="outline"
        m={5}
        onPress={onLogin}>
        登录
      </Button>
    </Box>
  );
}

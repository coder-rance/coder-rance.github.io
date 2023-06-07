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

export function EasyInput({
  value,
  setValue,
  type = 'text',
  placeholder = '请输入',
  icon,
  m,
  ml,
  mr,
  mt,
  mb,
}) {
  const [show, setShow] = useState(type == 'text');

  return (
    <Input
      m={m}
      mt={mt}
      mb={mb}
      ml={ml}
      mr={mr}
      value={value}
      InputLeftElement={
        icon ? (
          <Icon
            as={<Ionicons name={icon} />}
            size={5}
            ml="2"
            color="muted.400"
          />
        ) : null
      }
      onChangeText={text => {
        setValue(text);
      }}
      type={show ? 'text' : 'password'}
      InputRightElement={
        type == 'password' ? (
          <Pressable onPress={() => setShow(!show)}>
            <Icon
              as={<Ionicons name={show ? 'eye' : 'eye-off'} />}
              size={5}
              mr="2"
              color="muted.400"
            />
          </Pressable>
        ) : null
      }
      size="md"
      placeholder={placeholder}
    />
  );
}

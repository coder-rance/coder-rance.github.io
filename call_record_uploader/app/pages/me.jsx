import React from 'react';
import {StatusBar} from 'react-native';
import {Flex,Text} from 'native-base';
import {useIsFocused} from '@react-navigation/native';

const FocusAwareStatusBar = (props) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

export function MePage() {

  return (
    <Flex direction="column" p={5} flex={1} bgColor={'#fff'}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text>MePage</Text>
    </Flex>
  );
}

import React from 'react';
import {StatusBar} from 'react-native';
import {Flex, Text, Button} from 'native-base';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';

const FocusAwareStatusBar = (props) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

export function HistoryPage() {
  const navigation = useNavigation();

  return (
    <Flex direction="column" p={5} flex={1} bgColor={'#fff'}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Text>HistoryPage</Text>
      <Button onPress={() => navigation.navigate('Home')}>ce</Button>
    </Flex>
  );
}

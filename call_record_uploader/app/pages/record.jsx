import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, PermissionsAndroid} from 'react-native';
import {Flex, Text, Heading, Container, ScrollView} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import dayjs from 'dayjs';

import CallRecord from 'react-native-call-record';


const FocusAwareStatusBar = props => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

export function RecordPage() {
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    getCallLogs();
  }, []);

  const getCallLogs = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: 'Call Log Example',
          message: 'Access your call logs',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        CallRecord.getAll({limit: 10}).then(callLogs => {
          setCallLogs(callLogs);
        });
      } else {
        console.log('Call Log permission denied');
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  // const getCallLogs = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
  //       {
  //         title: 'Call Log Example',
  //         message: 'Access your call logs',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log(CallLogs);
  //       CallLogs.load(5).then(c => console.log(c));
  //     } else {
  //       console.log('Call Log permission denied');
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  return (
    <>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Flex direction="column" p={5} flex={1} bgColor={'#fff'}>
        <Heading>通话</Heading>
        <ScrollView>
          {callLogs.map((call, i) => (
            <Container key={i} mb={10}>
              <Text>dateTime: {call.dateTime}</Text>
              <Text>duration: {call.duration}</Text>
              <Text>phoneNumber: {call.phoneNumber}</Text>
              <Text>type: {call.type}</Text>
            </Container>
          ))}
        </ScrollView>
      </Flex>
    </>
  );
}

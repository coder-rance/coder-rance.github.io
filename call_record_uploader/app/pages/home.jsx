import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setAllTaskList} from '@app/store/features/taskSlice';
import {
  Stack,
  Box,
  Button,
  Flex,
  Text,
  Input,
  useToast,
  Spacer,
  Modal,
  Center,
  FormControl,
  Pressable,
} from 'native-base';

import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useExitApp} from '@app/hooks/useExitApp';


export function HomePage() {
  const {taskList} = useSelector(state => state.task);
  const routesLength = useNavigationState(state => state.routes.length);
  const dispatch = useDispatch();
  useExitApp();


  return (
    <Box style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
      <Icon name="rocket" size={30} color="#900" />
      <Text>{taskList} {routesLength}</Text>
      <Button
        onPress={() => {
          const result = Date.now();

          dispatch(setAllTaskList(result));
        }}>
        change
      </Button>
      <Text>Home Screen</Text>
      <Example></Example>
    </Box>
  );
}

const Example = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <Center>
      <Button onPress={() => setShowModal(true)}>Button</Button>
      <Modal
        size='xl'
        isOpen={showModal}
        avoidKeyboard
        closeOnOverlayClick={false}
        onClose={() => setShowModal(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>配置</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>服务器地址</FormControl.Label>
              <Input />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="secondary"
                onPress={() => {
                  setShowModal(false);
                }}>
                取消
              </Button>
              <Button
                onPress={() => {
                  setShowModal(false);
                }}>
                保存
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
};

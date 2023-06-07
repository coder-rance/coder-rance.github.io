import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setAllTaskList} from '@app/store/features/taskSlice';

export function HomePage() {
  const {taskList} = useSelector(state => state.task);
  const dispatch = useDispatch();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Icon name="rocket" size={30} color="#900" />
      <Text>{taskList}</Text>
      <Button
        title="btn"
        onPress={() => {
          const result = Date.now();

          dispatch(setAllTaskList(result));
        }}></Button>
      <Text>Home Screen</Text>
    </View>
  );
}

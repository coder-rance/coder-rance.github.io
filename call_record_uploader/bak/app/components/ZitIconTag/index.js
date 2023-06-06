import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

export default function ZitIconTag(props) {
  const {
    iconName="help-circle-outline",
    iconSize = 22,
    iconColor = "#000",
    width=36,
    height=36,
    backgroundColor = "#f5f5f5",
    onPress,
  } = props;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, {backgroundColor, width,height}]}>
        {/* 图标 */}
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}


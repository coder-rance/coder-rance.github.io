import React, { useState } from 'react';
import { TextInput, View, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';

export default function ZitInput({
  iconName='help-circle-outline',
  iconColor='#7B6F72',
  value,
  children,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
}) {
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.container, style]}>
      {/* 图标 */}
      <Ionicons
        style={styles.icon}
        name={iconName}
        size={18}
        color={iconColor}
      />
      {/* 输入框 */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        placeholder={placeholder}
      />
      {/* 关闭按钮 */}
      {
        value.length > 0
        &&
        (
          <TouchableWithoutFeedback hitSlop={true}  onPress={() => onChangeText('')}>
            <Ionicons
              style={styles.icon}
              name="close-circle-outline"
              size={20}
              color={iconColor}
            />
          </TouchableWithoutFeedback>
        )
      }
      {/* 显示密码 */}
      {
        (secureTextEntry && value.length > 0)
        &&
        (
          <TouchableWithoutFeedback hitSlop={true} onPress={() => setSecure(!secure)}>
            <Ionicons
              style={styles.icon}
              name={secure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={iconColor}
            />
          </TouchableWithoutFeedback>
        )
      }
      {
        children
      }
    </View>
  );
}


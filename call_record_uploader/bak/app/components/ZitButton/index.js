import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../style'
import styles from './style';

export default function ZitButton({ style, type = 'primary', iconName, title, activeOpacity = 0.7, onPress }) {

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors[type] }, style]}
      activeOpacity={activeOpacity}
      onPress={onPress}
    >
      {
        iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color="#fff"
            style={{ marginRight: 5 }}
          />
        )
      }
      <Text style={{ color: '#fff', fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  )
}

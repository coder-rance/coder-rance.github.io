import React from 'react';
import { Text, View } from 'react-native';
import styles from './style';

export default function ZitButton(props) {
  const { title, color = '#000' } = props;

  return (
    <View style={styles.container}>
      <View style={[styles.line, {backgroundColor: color}]}></View>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.line, {backgroundColor: color}]}></View>
    </View>
  )
}

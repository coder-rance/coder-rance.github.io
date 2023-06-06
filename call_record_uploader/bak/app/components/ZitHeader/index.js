import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from './style';

export default function ZitHeader({ leftIcon, title, indicator =false, rightIcon, bgColor = '#409EFF', color = '#fff' }) {
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.leftIcon}>
        {leftIcon}
      </View>

      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        {
          indicator && <ActivityIndicator style={{ marginLeft: 10 }} size="small" color="#fff" />
        }
      </View>

      <View style={styles.rightIcon}>
        {rightIcon}
      </View>
    </View>
  );
}


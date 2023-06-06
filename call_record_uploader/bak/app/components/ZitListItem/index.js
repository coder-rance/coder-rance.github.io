import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ZitListItem({ title, color='#000', content, showIcon }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
      {
        showIcon && <Ionicons
          name="chevron-forward-outline"
          size={20}
          color="#a2a2a2"
        />
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 1,
    padding: 15,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 2,
    fontSize: 16,
    textAlign: 'right',
    marginRight: 5,
    color: '#686868'
  }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ZitButton } from '@app/components';

export function Selector({ title, content, onPress, btnText = ''}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.contentWrapper}>
        <Text style={styles.contentText}>{content}</Text>
        <ZitButton title={btnText} style={{ width: 80, height: 40, }} onPress={onPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 1
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  contentText: {
    fontSize: 16,
    flex: 1,
    color: '#686868'
  }
});
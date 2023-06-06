import React, { useCallback } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ZitButton } from '@app/components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRef } from 'react';

export function SelectionList({ title, data, current, visible, onConfirm, onCancel }) {

  const currentRef = useRef();
  currentRef.current = current;

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onConfirm(item)}
      >
        <Text style={{ color: item.id == currentRef.current.id ? '#67C23A' : '#000' }}>{item.name+"("+item.clid+")"}</Text>
        {
          item.id == currentRef.current.id && <Ionicons
            style={{ position: 'absolute', right: 10 }}
            name="checkmark-circle-outline"
            size={24}
            color="#67C23A"
          />
        }

      </TouchableOpacity>
    );
  }, []);

  return (
    <Modal
      style={styles.modalView}
      visible={visible}
      transparent={true}
    >
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <Text style={{ marginBottom: 15, fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
          <FlatList
            style={styles.scrollView}
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          ></FlatList>

          <ZitButton type="danger" title="取消" style={{ width: '100%' }} onPress={onCancel}></ZitButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    // margin: 20,
    // width: 400,

  },
  outerContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: 20,
    backgroundColor: "#fff",
    elevation: 1,
    borderRadius: 15,
    padding: 15,
    width: '85%',
    height: '70%',
    // backgroundColor:'yellow'
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 15,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    // backgroundColor:'pink',
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 2,
    margin: 5,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  }
});
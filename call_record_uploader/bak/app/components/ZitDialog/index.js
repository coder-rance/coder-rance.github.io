import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import ZitButton from '../ZitButton';

export default function ZitDialog({
  visible,
  children,
  title = "提示",
  animationType = 'fade',
  onConfirm,
  onCancel,
  confirmBtnTitle = '确定',
  cancelBtnTitle = '取消',
  content = '',
  showButton = true,
}) {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={true}
    >
      <View style={styles.outerContainer} >
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>
            {
              children
            }
          </View>
          {
            content
              ?
              <Text style={styles.contentText}>
                {content}
              </Text>
              : <View></View>
          }
          <View style={styles.content}>
            {
              showButton && (
                <View>
                  <View style={styles.buttons}>
                    {
                      onCancel ?
                      <ZitButton type="danger" title={cancelBtnTitle} onPress={onCancel} style={styles.cancel} /> 
                      : <View></View>
                    }   
                    <ZitButton type="primary" title={confirmBtnTitle} onPress={onConfirm} style={styles.confirm} />
                  </View>
                </View>
              )
            }
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '90%',
    padding: 15,
    // paddingTop:7.5,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 1,
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 7.5,
    borderBottomColor: '#f3f3f3',
    borderBottomWidth: 1,
    color:'#455465',
  },
  content: {
    width: '100%',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 15,
  },
  contentText: {
    fontSize: 16,
    textAlign: 'center',
    color:'#455465',
  },
  cancel: {
    flex: 1,
    marginRight: 10,
    height: 40,
  },
  confirm: {
    flex: 1,
    marginLeft: 10,
    height: 40,
  },
});
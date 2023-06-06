import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';

export default function ZitLoading(props) {
  const { visible } = props;

  return (
    <Overlay
      visible={visible}
      overlayStyle={{
        backgroundColor:'#000',
        opacity:0.2
      }}
      backdropStyle={{
        backgroundColor: "#000",
        opacity: 0,
      }}>
      <ActivityIndicator size="large" color="#000" />
    </Overlay>
  );
}



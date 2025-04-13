import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AxisPad } from '@fustaro/react-native-axis-pad';

const ControlPad = ({ onMove }) => {
  return (
    <View style={styles.padContainer}>
      <AxisPad
        resetOnRelease
        autoCenter
        onValue={({ x, y }) => {
          if (onMove) {
            onMove(x, y);
          }
        }}
        style={styles.pad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  padContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 120,
    height: 120,
    zIndex: 999,
  },
  pad: {
    width: '100%',
    height: '100%',
  },
});

export default ControlPad;

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ControlPad = ({ handleButtonPress }) => {
  return (
    <View style={styles.controlContainer}>
      <TouchableOpacity style={styles.controlButton} onPress={() => handleButtonPress("move-up")}>
        <Text style={styles.buttonText}>Up</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleButtonPress("move-left")}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleButtonPress("move-down")}>
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleButtonPress("move-right")}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 5,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ControlPad;

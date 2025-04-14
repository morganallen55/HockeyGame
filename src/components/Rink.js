import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GAME_CONSTANTS } from '../constants/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Rink = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rinkSurface}>
        <View style={styles.centerLine} />
        <View style={styles.centerCircle}>
          <View style={styles.centerDot} />
        </View>
        <View style={[styles.blueLine, { top: '25%' }]} />
        <View style={[styles.blueLine, { bottom: '25%' }]} />
        <View style={[styles.goal, styles.topGoal]} />
        <View style={[styles.goal, styles.bottomGoal]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  rinkSurface: {
    flex: 1,
    backgroundColor: GAME_CONSTANTS.ICE_COLOR,
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#FF0000',
    marginTop: -2,
  },
  centerCircle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FF0000',
    marginLeft: -40,
    marginTop: -40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  blueLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#0000FF',
  },
  goal: {
    position: 'absolute',
    width: GAME_CONSTANTS.GOAL_WIDTH,
    height: GAME_CONSTANTS.GOAL_HEIGHT,
    backgroundColor: '#222',
  },
  topGoal: {
    top: 20,
    left: (screenWidth - GAME_CONSTANTS.GOAL_WIDTH) / 2,
  },
  bottomGoal: {
    bottom: 80, // Restored to original position
    left: (screenWidth - GAME_CONSTANTS.GOAL_WIDTH) / 2,
  },
});

export default Rink;

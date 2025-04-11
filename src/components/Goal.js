import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import goalImage from '../assets/goal_net.png';
import { GAME_CONSTANTS } from '../constants';

const Goal = ({ position, isLeft }) => {
  const x = position.x;
  const y = position.y;

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      <Image
        source={goalImage}
        style={[styles.image, isLeft && { transform: [{ scaleX: -1 }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.GOAL_WIDTH,
    height: GAME_CONSTANTS.GOAL_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Goal;

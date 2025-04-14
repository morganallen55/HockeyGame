import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import goalImage from '../assets/goal_net.png';
import { GAME_CONSTANTS } from '../constants/constants';

const Goal = ({ position, isLeft, isTopGoal }) => {
  const x = position.x; // Keep x as it was from the position prop
  const y = isTopGoal ? 20 : 710; // Adjusted bottom goal y-value to -20

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      <Image
        source={goalImage}
        style={[
          styles.image,
          isLeft && { transform: [{ scaleX: -1 }] },
          !isTopGoal && { transform: [{ scaleY: -1 }] }, // Flip bottom goal vertically
        ]}
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

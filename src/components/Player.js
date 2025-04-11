import React, { useState } from 'react';
import { View, Image, StyleSheet, PanResponder } from 'react-native';
import playerImage from '../assets/player.png';
import { GAME_CONSTANTS } from '../constants';

const Player = ({ body, isSelected, onDrag }) => {
  const [position, setPosition] = useState({ x: body.position.x, y: body.position.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const newX = position.x + gestureState.dx;
      const newY = position.y + gestureState.dy;
      setPosition({ x: newX, y: newY });
      if (onDrag) onDrag(newX, newY);
    },
    onPanResponderRelease: () => {
      // Handle release logic if needed
    },
  });

  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = position.x - width / 2;
  const y = position.y - height / 2;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { left: x, top: y },
        isSelected && styles.glow
      ]}
    >
      <Image source={playerImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.PLAYER_SIZE,
    height: GAME_CONSTANTS.PLAYER_SIZE,
  },
  glow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Player;

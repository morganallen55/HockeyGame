// src/components/Puck.js
import React, { useRef } from 'react';
import { View, Image, StyleSheet, PanResponder } from 'react-native';
import puckImage from '../assets/puck.png';
import { GAME_CONSTANTS } from '../constants';

const Puck = ({ body, onShoot }) => {
  const position = useRef({ x: body.position.x, y: body.position.y });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      const velocity = Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2);
      if (velocity > GAME_CONSTANTS.MIN_SHOOT_VELOCITY) {
        const direction = {
          x: gestureState.vx / velocity,
          y: gestureState.vy / velocity,
        };
        if (onShoot) onShoot(direction, velocity * GAME_CONSTANTS.SHOOTING_POWER);
      }
    },
  });

  const radius = body.circleRadius;
  const x = position.current.x - radius;
  const y = position.current.y - radius;

  return (
    <View
      {...panResponder.panHandlers}
      style={[styles.container, { left: x, top: y }]}
    >
      <Image source={puckImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.PUCK_SIZE,
    height: GAME_CONSTANTS.PUCK_SIZE,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Puck;


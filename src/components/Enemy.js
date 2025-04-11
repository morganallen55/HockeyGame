import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import enemyImage from '../assets/enemy.png';
import { GAME_CONSTANTS } from '../constants';

const Enemy = ({ body }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      <Image source={enemyImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.ENEMY_SIZE,
    height: GAME_CONSTANTS.ENEMY_SIZE,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Enemy;

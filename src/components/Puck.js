import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import puckImage from '../assets/puck.png';

const Puck = ({ body }) => {
  const radius = body.circleRadius;
  const x = body.position.x - radius;
  const y = body.position.y - radius;

  return (
    <View style={[styles.container, { left: x, top: y }]}> 
      <Image source={puckImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 20,
    height: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Puck;

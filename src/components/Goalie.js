import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import goalieImage from '../assets/goalie.png';
import { GAME_CONSTANTS } from '../constants/constants';

const Goalie = ({ body, isFlipped, isTopGoalie, topGoalieOffset = 0, bottomGoalieOffset = 0 }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2 + (isTopGoalie ? topGoalieOffset : bottomGoalieOffset); // Adjust separately for top and bottom goalies

  return (
    <View style={[styles.container, { left: x, top: y }]}>
      <Image
        source={goalieImage}
        style={[
          styles.image,
          isFlipped && { transform: [{ scaleY: -1 }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.GOALIE_SIZE,
    height: GAME_CONSTANTS.GOALIE_SIZE,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Goalie;

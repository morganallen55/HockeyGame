import React from 'react';
import { View, StyleSheet } from 'react-native';
import Rink from './Rink';
import Player from './Player';
import Enemy from './Enemy';
import Goalie from './Goalie';
import Puck from './Puck';
import Goal from './Goal';
import ControlPad from './ControlPad';

const GameBoard = ({ gameState, onMove }) => {
  const { selectedPlayer } = gameState;

  return (
    <View style={styles.container}>
      <Rink />

      {/* Players */}
      <Player
        body={gameState.player1.body}
        isSelected={selectedPlayer === 'player1'}
      />
      <Player
        body={gameState.player2.body}
        isSelected={selectedPlayer === 'player2'}
      />

      {/* Enemies */}
      <Enemy body={gameState.enemy1.body} />
      <Enemy body={gameState.enemy2.body} />

      {/* Goalies */}
      <Goalie body={gameState.goalie1.body} />
      <Goalie body={gameState.goalie2.body} isFlipped />

      {/* Puck */}
      <Puck body={gameState.puck.body} />

      {/* Goals (static visuals) */}
      <Goal position={gameState.goal1.position} isLeft={true} />
      <Goal position={gameState.goal2.position} isLeft={false} />

      {/* Control Pad */}
      <ControlPad onMove={onMove} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default GameBoard;

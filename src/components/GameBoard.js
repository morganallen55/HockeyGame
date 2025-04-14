import React from 'react';
import { View, StyleSheet } from 'react-native';
import Rink from './Rink';
import Player from './Player';
import Enemy from './Enemy';
import Goalie from './Goalie';
import Puck from './Puck';
import Goal from './Goal';

const GameBoard = ({ gameState, onSelectPlayer }) => {
  const { selectedPlayer } = gameState;

  return (
    <View style={styles.container}>
      <Rink />

      {/* Player (Only One Now) */}
      <Player
        body={gameState.player1.body}
        isSelected={selectedPlayer === 'player1'}
        onTap={() => onSelectPlayer('player1')}
      />

      {/* Enemies */}
      <Enemy body={gameState.enemy1.body} />
      <Enemy body={gameState.enemy2.body} />

      {/* Goalies */}
      <Goalie body={gameState.goalie1.body} isTopGoalie={true} topGoalieOffset={0} />
      <Goalie body={gameState.goalie2.body} isFlipped isTopGoalie={false} bottomGoalieOffset={-55} />

      {/* Puck */}
      <Puck body={gameState.puck.body} />

      {/* Goals (Visual Only) */}
      <Goal position={gameState.goal1.position} isLeft={true} isTopGoal={true} />
      <Goal position={gameState.goal2.position} isLeft={false} isTopGoal={false} />
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

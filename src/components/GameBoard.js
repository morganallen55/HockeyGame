import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Rink from './Rink';
import Player from './Player';
import Enemy from './Enemy';
import Goalie from './Goalie';
import Puck from './Puck';
import Goal from './Goal';

const GameBoard = ({ gameState, onUpdateGameState }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerDrag = (playerId, x, y) => {
    onUpdateGameState((prevState) => ({
      ...prevState,
      [playerId]: {
        ...prevState[playerId],
        body: {
          ...prevState[playerId].body,
          position: { x, y },
        },
      },
    }));
  };

  const handlePuckShoot = (direction, velocity) => {
    // Update puck state based on shoot direction and velocity
    onUpdateGameState((prevState) => ({
      ...prevState,
      puck: {
        ...prevState.puck,
        body: {
          ...prevState.puck.body,
          velocity: {
            x: direction.x * velocity,
            y: direction.y * velocity,
          },
        },
      },
    }));
  };

  return (
    <View style={styles.container}>
      <Rink />

      {/* Players */}
      <Player
        body={gameState.player1.body}
        isSelected={selectedPlayer === 'player1'}
        onDrag={(x, y) => handlePlayerDrag('player1', x, y)}
      />
      <Player
        body={gameState.player2.body}
        isSelected={selectedPlayer === 'player2'}
        onDrag={(x, y) => handlePlayerDrag('player2', x, y)}
      />

      {/* Enemies */}
      <Enemy body={gameState.enemy1.body} />
      <Enemy body={gameState.enemy2.body} />

      {/* Goalies */}
      <Goalie body={gameState.goalie1.body} />
      <Goalie body={gameState.goalie2.body} flip />

      {/* Puck */}
      <Puck body={gameState.puck.body} onShoot={handlePuckShoot} />

      {/* Goals (visuals) */}
      <Goal position={gameState.goal1.position} isLeft={true} />
      <Goal position={gameState.goal2.position} isLeft={false} />
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


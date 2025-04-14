import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Matter from 'matter-js';

import createGameEntities from './src/entities';
import Physics from './src/physics';
import { GAME_CONSTANTS } from './src/constants/constants';
import GameBoard from './src/components/GameBoard';
import StartScreen from './src/screens/StartScreen';

const SCORE_CAP = 5;

export default function App() {
  const [running, setRunning] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [entities, setEntities] = useState({});
  const [score, setScore] = useState({ player: 0, enemy: 0 });
  const [gameTime, setGameTime] = useState(GAME_CONSTANTS.GAME_DURATION);
  const [winner, setWinner] = useState('');
  const [showGoalText, setShowGoalText] = useState(false);

  const startGame = () => {
    const newEntities = createGameEntities();
    setEntities({ ...newEntities, selectedPlayer: 'player1' });
    setRunning(true);
    setShowStart(false);
    setGameOver(false);
    setWinner('');
    setScore({ player: 0, enemy: 0 });
    setGameTime(GAME_CONSTANTS.GAME_DURATION);
  };

  const resetGame = () => {
    const newEntities = createGameEntities();
    setEntities({ ...newEntities, selectedPlayer: 'player1' });
    setScore({ player: 0, enemy: 0 });
    setGameTime(GAME_CONSTANTS.GAME_DURATION);
    setRunning(true);
    setGameOver(false);
    setWinner('');
    gameEngine?.dispatch({ type: 'reset' });
  };

  const onGoal = (team) => {
    setShowGoalText(true);
    setTimeout(() => setShowGoalText(false), 1000);

    setScore((prev) => {
      const updated = { ...prev, [team]: prev[team] + 1 };
      if (updated[team] >= SCORE_CAP) {
        setWinner(team === 'player' ? 'You Win!' : 'Enemy Wins!');
        setRunning(false);
        setGameOver(true);
      }
      return updated;
    });

    // Reset puck position after goal
    if (entities.puck?.body) {
      Matter.Body.setPosition(entities.puck.body, {
        x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
        y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
      });
      Matter.Body.setVelocity(entities.puck.body, { x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (!running) return;
    if (gameTime <= 0) {
      setWinner(score.player > score.enemy ? 'You Win!' : 'Enemy Wins!');
      setRunning(false);
      setGameOver(true);
      return;
    }

    const interval = setInterval(() => {
      setGameTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, gameTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectPlayer = (playerId) => {
    setEntities((prev) => ({
      ...prev,
      selectedPlayer: playerId,
    }));
  };

  if (showStart) return <StartScreen onStart={startGame} />;

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Player: {score.player}</Text>
        <Text style={styles.timeText}>{formatTime(gameTime)}</Text>
        <Text style={styles.scoreText}>Enemy: {score.enemy}</Text>
      </View>

      <GameEngine
        ref={(ref) => setGameEngine(ref)}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={entities}
        running={running}
        onEvent={(e) => {
          if (e.type === 'goal') onGoal(e.team);
          if (e.type === 'select-player') handleSelectPlayer(e.id);
        }}
      >
        {entities.player1 && (
          <GameBoard
            gameState={entities}
            onSelectPlayer={handleSelectPlayer}
          />
        )}
      </GameEngine>

      {showGoalText && (
        <View style={styles.goalTextOverlay}>
          <Text style={styles.goalText}>GOAL!</Text>
        </View>
      )}

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>{winner}</Text>
          <Text style={styles.restartText} onPress={startGame}>
            Play Again
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: GAME_CONSTANTS.ICE_COLOR,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#333',
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
  },
  gameOverText: {
    fontSize: 36,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restartText: {
    fontSize: 20,
    color: '#00f',
    textDecorationLine: 'underline',
  },
  goalTextOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  goalText: {
    fontSize: 48,
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});

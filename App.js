import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Matter from 'matter-js';
import createGameEntities from './src/entities';
import Physics from './src/physics';
import { GAME_CONSTANTS } from './src/constants';
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
    setScore(prev => {
      const updated = { ...prev, [team]: prev[team] + 1 };
      if (updated[team] >= SCORE_CAP) {
        setWinner(team === 'player' ? 'You Win!' : 'Enemy Wins!');
        setRunning(false);
        setGameOver(true);
      }
      return updated;
    });
  };

  const onUpdateGameState = (updateFn) => {
    setEntities((prevEntities) => updateFn(prevEntities));
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
      setGameTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, gameTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          if (e.type === 'select-player') {
            setEntities(prev => ({ ...prev, selectedPlayer: e.id }));
          }
        }}
      >
        {entities.player1 && <GameBoard gameState={entities} onUpdateGameState={onUpdateGameState} />}
      </GameEngine>

      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>{winner}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={startGame}>
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setRunning(!running)}>
          <Text style={styles.buttonText}>{running ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
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
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
  restartButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  restartButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text, Image } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Matter from 'matter-js';
import entities from './entities';
import Physics from './physics';
import { GAME_CONSTANTS } from './constants';
import spriteSheet from './assets/hockey-spritesheet.png';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [running, setRunning] = useState(true);
  const [gameEngine, setGameEngine] = useState(null);
  const [score, setScore] = useState({ player: 0, enemy: 0 });
  const [gameTime, setGameTime] = useState(GAME_CONSTANTS.GAME_DURATION);
  
  // Create the physics world
  const world = Matter.World.create({ gravity: { x: 0, y: 0 } });
  
  // Reset the game
  const resetGame = () => {
    setScore({ player: 0, enemy: 0 });
    setGameTime(GAME_CONSTANTS.GAME_DURATION);
    gameEngine.dispatch({ type: 'reset' });
  };
  
  // Handle goal scored
  const onGoal = (team) => {
    if (team === 'player') {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setScore(prev => ({ ...prev, enemy: prev.enemy + 1 }));
    }
  };
  
  // Update game time
  useEffect(() => {
    if (!running || gameTime <= 0) return;
    
    const interval = setInterval(() => {
      setGameTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [running, gameTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
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
        entities={entities(world)}
        running={running}
        onEvent={(e) => {
          if (e.type === 'goal') {
            onGoal(e.team);
          }
        }}
      />
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setRunning(!running)}
        >
          <Text style={styles.buttonText}>{running ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={resetGame}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
}); 
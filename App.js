import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { GAME_CONSTANTS } from './constants';
import { checkCollision, calculatePuckMovement, applyFriction, calculatePlayerMovement, calculateEnemyMovement, checkGoal } from './physics';

export default function App() {
    const [gameState, setGameState] = useState({
        score: 0,
        gameTime: GAME_CONSTANTS.GAME_DURATION,
        isGameOver: false,
        selectedPlayer: null,
        players: [
            { id: 1, position: { x: GAME_CONSTANTS.SCREEN_WIDTH * 0.3, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.5 }, velocity: { x: 0, y: 0 } },
            { id: 2, position: { x: GAME_CONSTANTS.SCREEN_WIDTH * 0.4, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.5 }, velocity: { x: 0, y: 0 } },
        ],
        enemies: [
            { id: 1, position: { x: GAME_CONSTANTS.SCREEN_WIDTH * 0.6, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.3 }, velocity: { x: 0, y: 0 } },
            { id: 2, position: { x: GAME_CONSTANTS.SCREEN_WIDTH * 0.7, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.7 }, velocity: { x: 0, y: 0 } },
        ],
        puck: {
            position: { x: GAME_CONSTANTS.SCREEN_WIDTH / 2, y: GAME_CONSTANTS.SCREEN_HEIGHT / 2 },
            velocity: { x: 0, y: 0 },
        },
        nets: {
            left: { x: 50, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.5 - 40 },
            right: { x: GAME_CONSTANTS.SCREEN_WIDTH - 150, y: GAME_CONSTANTS.SCREEN_HEIGHT * 0.5 - 40 },
        },
    });
    const [showWelcome, setShowWelcome] = useState(true);
    const gameLoop = useRef(null);

    const startGame = () => {
        setShowWelcome(false);
        setGameState(prevState => ({
            ...prevState,
            score: 0,
            gameTime: GAME_CONSTANTS.GAME_DURATION,
            isGameOver: false,
            selectedPlayer: null,
        }));
        startGameLoop();
    };

    const startGameLoop = () => {
        gameLoop.current = setInterval(() => {
            setGameState(prevState => {
                const newState = { ...prevState };
                
                // Update puck position
                newState.puck.velocity = applyFriction(newState.puck.velocity);
                newState.puck.position = calculatePuckMovement(newState.puck.position, newState.puck.velocity);
                
                // Update enemy positions
                newState.enemies.forEach(enemy => {
                    enemy.position = calculateEnemyMovement(enemy.position, newState.puck.position);
                });
                
                // Check for goals
                if (checkGoal(newState.puck.position, newState.nets.right)) {
                    newState.score += 1;
                    newState.puck.position = { x: GAME_CONSTANTS.SCREEN_WIDTH / 2, y: GAME_CONSTANTS.SCREEN_HEIGHT / 2 };
                    newState.puck.velocity = { x: 0, y: 0 };
                }
                
                // Update game time
                if (newState.gameTime > 0) {
                    newState.gameTime -= 1;
                } else {
                    newState.isGameOver = true;
                }
                
                return newState;
            });
        }, 1000 / 60); // 60 FPS
    };

    useEffect(() => {
        return () => {
            if (gameLoop.current) {
                clearInterval(gameLoop.current);
            }
        };
    }, []);

    if (showWelcome) {
        return (
            <View style={styles.welcomeContainer}>
                <Text style={styles.title}>Hockey Game</Text>
                <Text style={styles.instructions}>
                    Tap a player to control them{'\n'}
                    Swipe to hit the puck{'\n'}
                    Score goals to win!
                </Text>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.startButtonText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.rink} />
            
            {/* Score and Timer */}
            <View style={styles.gameInfo}>
                <Text style={styles.score}>Score: {gameState.score}</Text>
                <Text style={styles.timer}>Time: {Math.floor(gameState.gameTime / 60)}:{(gameState.gameTime % 60).toString().padStart(2, '0')}</Text>
            </View>
            
            {/* Game Objects */}
            {gameState.players.map(player => (
                <View
                    key={player.id}
                    style={[
                        styles.player,
                        {
                            left: player.position.x - GAME_CONSTANTS.PLAYER_SIZE / 2,
                            top: player.position.y - GAME_CONSTANTS.PLAYER_SIZE / 2,
                            backgroundColor: gameState.selectedPlayer === player.id ? '#FFD700' : GAME_CONSTANTS.PLAYER_COLOR,
                        },
                    ]}
                />
            ))}
            
            {gameState.enemies.map(enemy => (
                <View
                    key={enemy.id}
                    style={[
                        styles.enemy,
                        {
                            left: enemy.position.x - GAME_CONSTANTS.ENEMY_SIZE / 2,
                            top: enemy.position.y - GAME_CONSTANTS.ENEMY_SIZE / 2,
                        },
                    ]}
                />
            ))}
            
            <View
                style={[
                    styles.puck,
                    {
                        left: gameState.puck.position.x - GAME_CONSTANTS.PUCK_SIZE / 2,
                        top: gameState.puck.position.y - GAME_CONSTANTS.PUCK_SIZE / 2,
                    },
                ]}
            />
            
            {/* Game Over Screen */}
            {gameState.isGameOver && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>Game Over!</Text>
                    <Text style={styles.finalScore}>Final Score: {gameState.score}</Text>
                    <TouchableOpacity style={styles.restartButton} onPress={startGame}>
                        <Text style={styles.restartButtonText}>Play Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GAME_CONSTANTS.ICE_COLOR,
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GAME_CONSTANTS.ICE_COLOR,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    instructions: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 10,
    },
    startButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    rink: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: GAME_CONSTANTS.ICE_COLOR,
        borderWidth: 5,
        borderColor: GAME_CONSTANTS.RINK_BORDER,
    },
    gameInfo: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    timer: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    player: {
        position: 'absolute',
        width: GAME_CONSTANTS.PLAYER_SIZE,
        height: GAME_CONSTANTS.PLAYER_SIZE,
        borderRadius: GAME_CONSTANTS.PLAYER_SIZE / 2,
    },
    enemy: {
        position: 'absolute',
        width: GAME_CONSTANTS.ENEMY_SIZE,
        height: GAME_CONSTANTS.ENEMY_SIZE,
        borderRadius: GAME_CONSTANTS.ENEMY_SIZE / 2,
        backgroundColor: GAME_CONSTANTS.ENEMY_COLOR,
    },
    puck: {
        position: 'absolute',
        width: GAME_CONSTANTS.PUCK_SIZE,
        height: GAME_CONSTANTS.PUCK_SIZE,
        borderRadius: GAME_CONSTANTS.PUCK_SIZE / 2,
        backgroundColor: GAME_CONSTANTS.PUCK_COLOR,
    },
    gameOverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    gameOverText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    finalScore: {
        fontSize: 36,
        color: 'white',
        marginBottom: 40,
    },
    restartButton: {
        backgroundColor: '#4CAF50',
        padding: 20,
        borderRadius: 10,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
}); 
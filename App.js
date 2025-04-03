import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, PanResponder } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { GAME_CONSTANTS } from './constants';
import { checkCollision, calculatePuckMovement, applyFriction, calculatePlayerMovement, calculateEnemyMovement, checkGoal } from './physics';

const assets = {
    playerImage: require('./assets/player.png'),
    enemyImage: require('./assets/enemy.png'),
    puckImage: require('./assets/puck.png'),
    rinkImage: require('./assets/rink.png'),
};

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
    const lastTouchPosition = useRef({ x: 0, y: 0 });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                lastTouchPosition.current = {
                    x: gestureState.x0,
                    y: gestureState.y0,
                };
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gameState.selectedPlayer) {
                    const selectedPlayer = gameState.players.find(p => p.id === gameState.selectedPlayer);
                    if (selectedPlayer) {
                        const direction = {
                            x: gestureState.moveX - lastTouchPosition.current.x,
                            y: gestureState.moveY - lastTouchPosition.current.y,
                        };
                        const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
                        if (distance > 0) {
                            direction.x /= distance;
                            direction.y /= distance;
                        }
                        setGameState(prevState => ({
                            ...prevState,
                            players: prevState.players.map(player =>
                                player.id === gameState.selectedPlayer
                                    ? { ...player, position: calculatePlayerMovement(player.position, direction) }
                                    : player
                            ),
                        }));
                    }
                }
                lastTouchPosition.current = {
                    x: gestureState.moveX,
                    y: gestureState.moveY,
                };
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gameState.selectedPlayer) {
                    const selectedPlayer = gameState.players.find(p => p.id === gameState.selectedPlayer);
                    if (selectedPlayer && checkCollision(selectedPlayer, gameState.puck)) {
                        const velocity = {
                            x: gestureState.vx * 2,
                            y: gestureState.vy * 2,
                        };
                        setGameState(prevState => ({
                            ...prevState,
                            puck: {
                                ...prevState.puck,
                                velocity,
                            },
                        }));
                    }
                }
            },
        })
    ).current;

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
        <GestureHandlerRootView style={styles.container} {...panResponder.panHandlers}>
            <Image source={assets.rinkImage} style={styles.rink} resizeMode="cover" />
            
            {/* Score and Timer */}
            <View style={styles.gameInfo}>
                <Text style={styles.score}>Score: {gameState.score}</Text>
                <Text style={styles.timer}>Time: {Math.floor(gameState.gameTime / 60)}:{(gameState.gameTime % 60).toString().padStart(2, '0')}</Text>
            </View>
            
            {/* Game Objects */}
            {gameState.players.map(player => (
                <TouchableOpacity
                    key={player.id}
                    onPress={() => setGameState(prevState => ({ ...prevState, selectedPlayer: player.id }))}
                    style={[
                        styles.player,
                        {
                            left: player.position.x - GAME_CONSTANTS.PLAYER_SIZE / 2,
                            top: player.position.y - GAME_CONSTANTS.PLAYER_SIZE / 2,
                        },
                    ]}
                >
                    <Image 
                        source={assets.playerImage} 
                        style={[
                            styles.playerImage,
                            gameState.selectedPlayer === player.id && styles.selectedPlayer
                        ]} 
                    />
                </TouchableOpacity>
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
                >
                    <Image source={assets.enemyImage} style={styles.enemyImage} />
                </View>
            ))}
            
            <View
                style={[
                    styles.puck,
                    {
                        left: gameState.puck.position.x - GAME_CONSTANTS.PUCK_SIZE / 2,
                        top: gameState.puck.position.y - GAME_CONSTANTS.PUCK_SIZE / 2,
                    },
                ]}
            >
                <Image source={assets.puckImage} style={styles.puckImage} />
            </View>
            
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
    },
    playerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    selectedPlayer: {
        tintColor: '#FFD700',
    },
    enemy: {
        position: 'absolute',
        width: GAME_CONSTANTS.ENEMY_SIZE,
        height: GAME_CONSTANTS.ENEMY_SIZE,
    },
    enemyImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    puck: {
        position: 'absolute',
        width: GAME_CONSTANTS.PUCK_SIZE,
        height: GAME_CONSTANTS.PUCK_SIZE,
    },
    puckImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
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
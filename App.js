import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, PanResponder } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GAME_CONSTANTS } from './constants';
import { checkCollision, calculatePuckMovement, applyFriction, calculatePlayerMovement, calculateEnemyMovement, checkGoal } from './physics';

const { width, height } = Dimensions.get('window');
const RINK_WIDTH = width;
const RINK_HEIGHT = height;
const PLAYER_SIZE = 32;
const PUCK_SIZE = 16;
const GOAL_WIDTH = 100;
const GOAL_HEIGHT = 60;
const GAME_DURATION = 300; // 5 minutes in seconds

// Sprite sheet frame indices
const SPRITE_FRAMES = {
    FACING_RIGHT: 0,
    FACING_LEFT: 1,
    SHOOTING_RIGHT: 2,
    SHOOTING_LEFT: 3
};

const GOALIE_FRAMES = {
    STANDING: 0,
    DIVING_RIGHT: 1,
    DIVING_LEFT: 2
};

const assets = {
    playerSprites: require('./assets/player_sprites.png'),
    enemySprites: require('./assets/enemy_sprites.png'),
    goalieSprites: require('./assets/goalie_sprites.png'),
    puck: require('./assets/puck.png'),
    rink: require('./assets/rink.png'),
    goalNet: require('./assets/goal_net.png'),
};

export default function App() {
    const [gameState, setGameState] = useState({
        score: 0,
        gameTime: GAME_DURATION,
        isGameOver: false,
        selectedPlayer: null,
        players: [
            { id: 1, position: { x: width * 0.3, y: height * 0.3 }, velocity: { x: 2, y: 1 }, frame: SPRITE_FRAMES.FACING_RIGHT },
            { id: 2, position: { x: width * 0.7, y: height * 0.3 }, velocity: { x: -2, y: 1 }, frame: SPRITE_FRAMES.FACING_LEFT },
            { id: 3, position: { x: width * 0.3, y: height * 0.7 }, velocity: { x: 2, y: -1 }, frame: SPRITE_FRAMES.FACING_RIGHT },
            { id: 4, position: { x: width * 0.7, y: height * 0.7 }, velocity: { x: -2, y: -1 }, frame: SPRITE_FRAMES.FACING_LEFT }
        ],
        enemies: [
            { id: 1, position: { x: width * 0.4, y: height * 0.4 }, isSelected: false, frame: SPRITE_FRAMES.FACING_RIGHT },
            { id: 2, position: { x: width * 0.6, y: height * 0.4 }, isSelected: false, frame: SPRITE_FRAMES.FACING_LEFT },
            { id: 3, position: { x: width * 0.4, y: height * 0.6 }, isSelected: false, frame: SPRITE_FRAMES.FACING_RIGHT },
            { id: 4, position: { x: width * 0.6, y: height * 0.6 }, isSelected: false, frame: SPRITE_FRAMES.FACING_LEFT }
        ],
        goalies: [
            { id: 1, position: { x: 60, y: height * 0.5 }, frame: GOALIE_FRAMES.STANDING },
            { id: 2, position: { x: width - 60, y: height * 0.5 }, frame: GOALIE_FRAMES.STANDING }
        ],
        puck: {
            position: { x: width / 2, y: height / 2 },
            velocity: { x: 0, y: 0 }
        }
    });
    const [showWelcome, setShowWelcome] = useState(true);
    const gameLoop = useRef(null);
    const lastUpdate = useRef(Date.now());

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                const { locationX, locationY } = evt.nativeEvent;
                const clickedEnemy = gameState.enemies.findIndex(enemy => {
                    const dx = locationX - enemy.position.x;
                    const dy = locationY - enemy.position.y;
                    return Math.sqrt(dx * dx + dy * dy) < PLAYER_SIZE / 2;
                });
                
                if (clickedEnemy !== -1) {
                    setGameState(prevState => ({
                        ...prevState,
                        selectedPlayer: clickedEnemy,
                        enemies: prevState.enemies.map((enemy, index) =>
                            index === clickedEnemy ? { ...enemy, isSelected: true } : enemy
                        ),
                    }));
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gameState.selectedPlayer !== null) {
                    const selectedEnemy = gameState.enemies[gameState.selectedPlayer];
                    if (selectedEnemy) {
                        const newX = Math.max(PLAYER_SIZE/2, Math.min(RINK_WIDTH - PLAYER_SIZE/2, selectedEnemy.position.x + gestureState.dx));
                        const newY = Math.max(PLAYER_SIZE/2, Math.min(RINK_HEIGHT - PLAYER_SIZE/2, selectedEnemy.position.y + gestureState.dy));
                        
                        // Update sprite frame based on movement direction
                        const frame = gestureState.dx > 0 ? SPRITE_FRAMES.FACING_RIGHT : SPRITE_FRAMES.FACING_LEFT;
                        
                        setGameState(prevState => ({
                            ...prevState,
                            enemies: prevState.enemies.map((enemy, index) =>
                                index === gameState.selectedPlayer
                                    ? { ...enemy, position: { x: newX, y: newY }, frame }
                                    : enemy
                            ),
                        }));
                    }
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gameState.selectedPlayer !== null) {
                    const selectedEnemy = gameState.enemies[gameState.selectedPlayer];
                    if (selectedEnemy) {
                        // Set shooting frame based on release direction
                        const frame = gestureState.dx > 0 ? SPRITE_FRAMES.SHOOTING_RIGHT : SPRITE_FRAMES.SHOOTING_LEFT;
                        
                        // Calculate puck movement if hit
                        const dx = gameState.puck.position.x - selectedEnemy.position.x;
                        const dy = gameState.puck.position.y - selectedEnemy.position.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < PLAYER_SIZE + PUCK_SIZE) {
                            const speed = Math.sqrt(gestureState.vx * gestureState.vx + gestureState.vy * gestureState.vy);
                            setGameState(prevState => ({
                                ...prevState,
                                puck: {
                                    ...prevState.puck,
                                    velocity: {
                                        x: gestureState.vx * speed,
                                        y: gestureState.vy * speed
                                    }
                                }
                            }));
                        }
                        
                        // Reset player selection and update frame
                        setGameState(prevState => ({
                            ...prevState,
                            selectedPlayer: null,
                            enemies: prevState.enemies.map((enemy, index) =>
                                index === gameState.selectedPlayer
                                    ? { ...enemy, isSelected: false, frame }
                                    : enemy
                            )
                        }));
                        
                        // Reset frame after shot animation
                        setTimeout(() => {
                            setGameState(prevState => ({
                                ...prevState,
                                enemies: prevState.enemies.map((enemy, index) =>
                                    index === gameState.selectedPlayer
                                        ? { ...enemy, frame: gestureState.dx > 0 ? SPRITE_FRAMES.FACING_RIGHT : SPRITE_FRAMES.FACING_LEFT }
                                        : enemy
                                )
                            }));
                        }, 200);
                    }
                }
            }
        })
    ).current;

    const startGame = () => {
        setShowWelcome(false);
        setGameState(prevState => ({
            ...prevState,
            score: 0,
            gameTime: GAME_DURATION,
            isGameOver: false,
            selectedPlayer: null,
        }));
        startGameLoop();
    };

    const startGameLoop = () => {
        gameLoop.current = setInterval(() => {
            setGameState(prevState => {
                const newState = { ...prevState };
                const now = Date.now();
                const deltaTime = (now - lastUpdate.current) / 1000;
                lastUpdate.current = now;
                
                // Update player positions and frames
                newState.players = newState.players.map(player => {
                    let newX = player.position.x + player.velocity.x * deltaTime * 100;
                    let newY = player.position.y + player.velocity.y * deltaTime * 100;
                    
                    // Bounce off walls
                    if (newX < PLAYER_SIZE/2 || newX > RINK_WIDTH - PLAYER_SIZE/2) {
                        player.velocity.x *= -1;
                        player.frame = player.velocity.x > 0 ? SPRITE_FRAMES.FACING_RIGHT : SPRITE_FRAMES.FACING_LEFT;
                        newX = player.position.x;
                    }
                    if (newY < PLAYER_SIZE/2 || newY > RINK_HEIGHT - PLAYER_SIZE/2) {
                        player.velocity.y *= -1;
                        newY = player.position.y;
                    }
                    
                    return { ...player, position: { x: newX, y: newY } };
                });
                
                // Update puck position
                const friction = 0.98;
                newState.puck.velocity = {
                    x: newState.puck.velocity.x * friction,
                    y: newState.puck.velocity.y * friction
                };
                
                newState.puck.position = {
                    x: Math.max(PUCK_SIZE/2, Math.min(RINK_WIDTH - PUCK_SIZE/2, 
                        newState.puck.position.x + newState.puck.velocity.x * deltaTime)),
                    y: Math.max(PUCK_SIZE/2, Math.min(RINK_HEIGHT - PUCK_SIZE/2, 
                        newState.puck.position.y + newState.puck.velocity.y * deltaTime))
                };
                
                // Check for goals
                if (newState.puck.position.y > height/2 - GOAL_HEIGHT/2 && 
                    newState.puck.position.y < height/2 + GOAL_HEIGHT/2) {
                    if (newState.puck.position.x < GOAL_WIDTH/2) {
                        // Goal scored on left side
                        newState.score += 1;
                        newState.puck.position = { x: width/2, y: height/2 };
                        newState.puck.velocity = { x: 0, y: 0 };
                    } else if (newState.puck.position.x > width - GOAL_WIDTH/2) {
                        // Goal scored on right side
                        newState.score -= 1;
                        newState.puck.position = { x: width/2, y: height/2 };
                        newState.puck.velocity = { x: 0, y: 0 };
                    }
                }
                
                // Update goalie animations
                newState.goalies = newState.goalies.map(goalie => {
                    const puckDist = Math.abs(newState.puck.position.y - goalie.position.y);
                    if (puckDist < GOAL_HEIGHT/4) {
                        return { ...goalie, frame: GOALIE_FRAMES.DIVING_RIGHT };
                    } else if (puckDist < GOAL_HEIGHT/2) {
                        return { ...goalie, frame: GOALIE_FRAMES.DIVING_LEFT };
                    }
                    return { ...goalie, frame: GOALIE_FRAMES.STANDING };
                });
                
                // Update game time
                if (newState.gameTime > 0) {
                    newState.gameTime -= deltaTime;
                } else {
                    newState.isGameOver = true;
                    if (gameLoop.current) {
                        clearInterval(gameLoop.current);
                    }
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
                    Tap and drag blue players to move them{'\n'}
                    Release to shoot the puck{'\n'}
                    Score goals to win!{'\n'}
                    Game duration: 5 minutes
                </Text>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.startButtonText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container} {...panResponder.panHandlers}>
            <Image source={assets.rink} style={styles.rink} resizeMode="cover" />
            
            {/* Goals */}
            <Image
                source={assets.goalNet}
                style={[styles.goal, { left: -GOAL_WIDTH/2 }]}
            />
            <Image
                source={assets.goalNet}
                style={[styles.goal, { right: -GOAL_WIDTH/2, transform: [{ scaleX: -1 }] }]}
            />
            
            {/* Score and Timer */}
            <View style={styles.gameInfo}>
                <Text style={styles.score}>Score: {gameState.score}</Text>
                <Text style={styles.timer}>
                    Time: {Math.floor(gameState.gameTime / 60)}:
                    {Math.floor(gameState.gameTime % 60).toString().padStart(2, '0')}
                </Text>
            </View>
            
            {/* Goalies */}
            {gameState.goalies.map(goalie => (
                <Image
                    key={goalie.id}
                    source={assets.goalieSprites}
                    style={[
                        styles.goalie,
                        {
                            left: goalie.position.x - PLAYER_SIZE/2,
                            top: goalie.position.y - PLAYER_SIZE/2,
                            width: PLAYER_SIZE,
                            height: PLAYER_SIZE
                        }
                    ]}
                    resizeMode="cover"
                />
            ))}
            
            {/* Red Players */}
            {gameState.players.map(player => (
                <Image
                    key={player.id}
                    source={assets.playerSprites}
                    style={[
                        styles.player,
                        {
                            left: player.position.x - PLAYER_SIZE/2,
                            top: player.position.y - PLAYER_SIZE/2,
                            width: PLAYER_SIZE,
                            height: PLAYER_SIZE
                        }
                    ]}
                />
            ))}
            
            {/* Blue Players */}
            {gameState.enemies.map(enemy => (
                <Image
                    key={enemy.id}
                    source={assets.enemySprites}
                    style={[
                        styles.enemy,
                        {
                            left: enemy.position.x - PLAYER_SIZE/2,
                            top: enemy.position.y - PLAYER_SIZE/2,
                            width: PLAYER_SIZE,
                            height: PLAYER_SIZE,
                            opacity: enemy.isSelected ? 0.8 : 1
                        }
                    ]}
                />
            ))}
            
            {/* Puck */}
            <Image
                source={assets.puck}
                style={[
                    styles.puck,
                    {
                        left: gameState.puck.position.x - PUCK_SIZE/2,
                        top: gameState.puck.position.y - PUCK_SIZE/2,
                        width: PUCK_SIZE,
                        height: PUCK_SIZE
                    }
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
        backgroundColor: '#F0F8FF',
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F8FF',
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
        width: RINK_WIDTH,
        height: RINK_HEIGHT,
    },
    gameInfo: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    score: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    timer: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    player: {
        position: 'absolute',
    },
    enemy: {
        position: 'absolute',
    },
    goalie: {
        position: 'absolute',
    },
    puck: {
        position: 'absolute',
    },
    goal: {
        position: 'absolute',
        width: GOAL_WIDTH,
        height: GOAL_HEIGHT,
        top: (RINK_HEIGHT - GOAL_HEIGHT) / 2,
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
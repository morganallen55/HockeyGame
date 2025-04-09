import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { GAME_CONSTANTS } from '../../constants';
import Player from './Player';
import Enemy from './Enemy';
import Goalie from './Goalie';
import Puck from './Puck';

const { width, height } = Dimensions.get('window');

const GameBoard = ({ gameState, panHandlers, onSelectPlayer }) => {
    return (
        <View style={styles.container} {...panHandlers}>
            <View style={styles.rink}>
                {/* Rink Markings */}
                <View style={styles.centerLine} />
                <View style={styles.centerCircle} />
                <View style={styles.centerDot} />
                
                {/* Face-off Circles */}
                <View style={[styles.faceOffCircle, styles.topLeft]} />
                <View style={[styles.faceOffCircle, styles.topRight]} />
                <View style={[styles.faceOffCircle, styles.bottomLeft]} />
                <View style={[styles.faceOffCircle, styles.bottomRight]} />
                
                {/* Face-off Dots */}
                <View style={[styles.faceOffDot, styles.topLeftDot]} />
                <View style={[styles.faceOffDot, styles.topRightDot]} />
                <View style={[styles.faceOffDot, styles.bottomLeftDot]} />
                <View style={[styles.faceOffDot, styles.bottomRightDot]} />

                {/* Goals */}
                <View style={[styles.goal, styles.leftGoal]} />
                <View style={[styles.goal, styles.rightGoal]} />

                {/* Players */}
                {gameState.players.map((player, index) => (
                    <Player
                        key={player.id}
                        position={player.position}
                        isSelected={player.isSelected}
                        onSelect={() => onSelectPlayer(player.id)}
                        spriteIndex={index % 4}
                    />
                ))}

                {/* Enemies */}
                {gameState.enemies.map((enemy, index) => (
                    <Enemy
                        key={enemy.id}
                        position={enemy.position}
                        spriteIndex={index % 4}
                    />
                ))}

                {/* Goalies */}
                {gameState.goalies.map((goalie, index) => (
                    <Goalie
                        key={goalie.id}
                        position={goalie.position}
                        isHome={goalie.id === 1}
                    />
                ))}

                {/* Puck */}
                <Puck position={gameState.puck.position} />

                {/* Score Display */}
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{gameState.score.team1} - {gameState.score.team2}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    rink: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 10,
        borderColor: '#ff69b4', // Pink border like in the NES version
        position: 'relative',
    },
    centerLine: {
        position: 'absolute',
        left: width / 2 - 2,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#ff69b4',
    },
    centerCircle: {
        position: 'absolute',
        left: width / 2 - 50,
        top: height / 2 - 50,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#ff69b4',
    },
    centerDot: {
        position: 'absolute',
        left: width / 2 - 4,
        top: height / 2 - 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff69b4',
    },
    faceOffCircle: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#ff69b4',
    },
    topLeft: {
        left: width * 0.25 - 40,
        top: height * 0.25 - 40,
    },
    topRight: {
        right: width * 0.25 - 40,
        top: height * 0.25 - 40,
    },
    bottomLeft: {
        left: width * 0.25 - 40,
        bottom: height * 0.25 - 40,
    },
    bottomRight: {
        right: width * 0.25 - 40,
        bottom: height * 0.25 - 40,
    },
    faceOffDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff69b4',
    },
    topLeftDot: {
        left: width * 0.25 - 4,
        top: height * 0.25 - 4,
    },
    topRightDot: {
        right: width * 0.25 - 4,
        top: height * 0.25 - 4,
    },
    bottomLeftDot: {
        left: width * 0.25 - 4,
        bottom: height * 0.25 - 4,
    },
    bottomRightDot: {
        right: width * 0.25 - 4,
        bottom: height * 0.25 - 4,
    },
    goal: {
        position: 'absolute',
        width: GAME_CONSTANTS.NET_WIDTH,
        height: GAME_CONSTANTS.NET_HEIGHT,
        backgroundColor: '#000',
        borderWidth: 4,
        borderColor: '#ff69b4',
    },
    leftGoal: {
        left: -2,
        top: (height - GAME_CONSTANTS.NET_HEIGHT) / 2,
    },
    rightGoal: {
        right: -2,
        top: (height - GAME_CONSTANTS.NET_HEIGHT) / 2,
    },
    scoreContainer: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    scoreText: {
        color: '#000',
        fontSize: 32,
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
});

export default GameBoard; 
import React from 'react';
import { View } from 'react-native';
import { GAME_CONSTANTS, SPRITE_FRAMES } from '../constants';
import Sprite from './Sprite';

const SPRITE_SIZE = 16;
const SCALE_FACTOR = GAME_CONSTANTS.PLAYER_SIZE / SPRITE_SIZE;

const Player = ({ position, direction, isShooting, spriteSheet }) => {
    // Determine which row of sprites to use based on player state
    let frameY = 0; // Default to blue player
    
    // Determine if we should flip the sprite based on direction
    const flip = direction === 'left';
    
    // Determine which frame to use
    let frameX = 'animate'; // Default to animation
    
    // If shooting, use a static frame
    if (isShooting) {
        frameX = flip ? SPRITE_FRAMES.SHOOTING_LEFT : SPRITE_FRAMES.SHOOTING_RIGHT;
    }
    
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.PLAYER_SIZE / 2,
                top: position.y - GAME_CONSTANTS.PLAYER_SIZE / 2,
                width: GAME_CONSTANTS.PLAYER_SIZE,
                height: GAME_CONSTANTS.PLAYER_SIZE,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Sprite 
                spriteSheet={spriteSheet} 
                frameY={frameY} 
                frameX={frameX} 
                scale={SCALE_FACTOR}
                flip={flip}
            />
        </View>
    );
};

export default Player;

import React from 'react';
import { View } from 'react-native';
import { GAME_CONSTANTS, GOALIE_FRAMES } from '../constants';
import Sprite from './Sprite';

const SPRITE_SIZE = 16;
const SCALE_FACTOR = GAME_CONSTANTS.GOALIE_SIZE / SPRITE_SIZE;

const Goalie = ({ position, direction, isDiving, spriteSheet, frameY = 2 }) => {
    // Determine if we should flip the sprite based on direction
    const flip = direction === 'left';
    
    // Determine which frame to use
    let frameX = GOALIE_FRAMES.STANDING;
    
    // If diving, use the appropriate diving frame
    if (isDiving) {
        frameX = flip ? GOALIE_FRAMES.DIVING_LEFT : GOALIE_FRAMES.DIVING_RIGHT;
    }
    
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.GOALIE_SIZE / 2,
                top: position.y - GAME_CONSTANTS.GOALIE_SIZE / 2,
                width: GAME_CONSTANTS.GOALIE_SIZE,
                height: GAME_CONSTANTS.GOALIE_SIZE,
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

export default Goalie;

// Helper function to calculate goalie movement
export const calculateGoalieMovement = (goalie, puck, isHome) => {
    const targetY = puck.position.y;
    const currentY = goalie.position.y;
    const deltaY = targetY - currentY;
    const speed = GAME_CONSTANTS.GOALIE_SPEED;
    
    // Move towards puck vertically, but stay within goal area
    let newY = currentY;
    if (Math.abs(deltaY) > speed) {
        newY = currentY + (deltaY > 0 ? speed : -speed);
    } else {
        newY = targetY;
    }

    // Constrain to goal area
    const minY = GAME_CONSTANTS.NET_HEIGHT;
    const maxY = GAME_CONSTANTS.RINK_HEIGHT - GAME_CONSTANTS.NET_HEIGHT;
    newY = Math.max(minY, Math.min(maxY, newY));

    // Keep X position fixed based on side
    const x = isHome ? 
        GAME_CONSTANTS.INITIAL_POSITIONS.GOALIES.HOME.x : 
        GAME_CONSTANTS.INITIAL_POSITIONS.GOALIES.AWAY.x;

    return {
        x,
        y: newY
    };
}; 
import React from 'react';
import { View } from 'react-native';
import { GAME_CONSTANTS } from '../constants';
import Sprite from './Sprite';

const SPRITE_SIZE = 16;
const SCALE_FACTOR = GAME_CONSTANTS.ENEMY_SIZE / SPRITE_SIZE;

const Enemy = ({ position, direction, spriteSheet, frameY = 1 }) => {
    // Determine if we should flip the sprite based on direction
    const flip = direction === 'left';
    
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.ENEMY_SIZE / 2,
                top: position.y - GAME_CONSTANTS.ENEMY_SIZE / 2,
                width: GAME_CONSTANTS.ENEMY_SIZE,
                height: GAME_CONSTANTS.ENEMY_SIZE,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Sprite 
                spriteSheet={spriteSheet} 
                frameY={frameY} 
                frameX={'animate'} 
                scale={SCALE_FACTOR}
                flip={flip}
            />
        </View>
    );
};

export default Enemy;

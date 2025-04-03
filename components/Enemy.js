import React from 'react';
import { View, Image } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const Enemy = ({ position, enemyImage }) => {
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
            <Image
                source={enemyImage}
                style={{
                    width: GAME_CONSTANTS.ENEMY_SIZE,
                    height: GAME_CONSTANTS.ENEMY_SIZE,
                    resizeMode: 'contain',
                }}
            />
        </View>
    );
};

export default Enemy; 
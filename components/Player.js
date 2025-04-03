import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const Player = ({ position, isSelected, onSelect, playerImage }) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.PLAYER_SIZE / 2,
                top: position.y - GAME_CONSTANTS.PLAYER_SIZE / 2,
                width: GAME_CONSTANTS.PLAYER_SIZE,
                height: GAME_CONSTANTS.PLAYER_SIZE,
                backgroundColor: isSelected ? '#FFD700' : 'transparent',
                borderRadius: GAME_CONSTANTS.PLAYER_SIZE / 2,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={playerImage}
                style={{
                    width: GAME_CONSTANTS.PLAYER_SIZE,
                    height: GAME_CONSTANTS.PLAYER_SIZE,
                    resizeMode: 'contain',
                }}
            />
        </TouchableOpacity>
    );
};

export default Player; 
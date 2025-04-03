import React from 'react';
import { View, Image } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const Puck = ({ position, puckImage }) => {
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.PUCK_SIZE / 2,
                top: position.y - GAME_CONSTANTS.PUCK_SIZE / 2,
                width: GAME_CONSTANTS.PUCK_SIZE,
                height: GAME_CONSTANTS.PUCK_SIZE,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={puckImage}
                style={{
                    width: GAME_CONSTANTS.PUCK_SIZE,
                    height: GAME_CONSTANTS.PUCK_SIZE,
                    resizeMode: 'contain',
                }}
            />
        </View>
    );
};

export default Puck; 
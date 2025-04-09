import React from 'react';
import { View } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const Puck = ({ position }) => {
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.PUCK_SIZE / 2,
                top: position.y - GAME_CONSTANTS.PUCK_SIZE / 2,
                width: GAME_CONSTANTS.PUCK_SIZE,
                height: GAME_CONSTANTS.PUCK_SIZE,
                backgroundColor: GAME_CONSTANTS.PUCK_COLOR,
                borderRadius: GAME_CONSTANTS.PUCK_SIZE / 2,
            }}
        />
    );
};

export default Puck;

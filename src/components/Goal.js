import React from 'react';
import { View } from 'react-native';
import { GAME_CONSTANTS } from '../constants';

const Goal = ({ position, isLeft }) => {
    return (
        <View
            style={{
                position: 'absolute',
                left: position.x - GAME_CONSTANTS.GOAL_DEPTH / 2,
                top: position.y - GAME_CONSTANTS.GOAL_HEIGHT / 2,
                width: GAME_CONSTANTS.GOAL_DEPTH,
                height: GAME_CONSTANTS.GOAL_HEIGHT,
                backgroundColor: 'red',
                borderWidth: 2,
                borderColor: 'white',
                transform: [{ scaleX: isLeft ? 1 : -1 }]
            }}
        />
    );
};

export default Goal;

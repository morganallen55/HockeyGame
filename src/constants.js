import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const GAME_CONSTANTS = {
    // Screen dimensions
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
    
    // Game objects
    PLAYER_SIZE: 50,
    ENEMY_SIZE: 50,
    PUCK_SIZE: 20,
    GOALIE_SIZE: 60,
    GOAL_WIDTH: 100,
    GOAL_HEIGHT: 60,
    GOAL_DEPTH: 20,
    
    // Physics
    FRICTION: 0.98,
    PUCK_SPEED: 15,
    PLAYER_SPEED: 8,
    ENEMY_SPEED: 6,
    SHOOTING_POWER: 15,
    
    // Colors
    ICE_COLOR: '#E8F4F8',
    RINK_BORDER: '#1E3A8A',
    PLAYER_COLOR: '#FF0000',
    ENEMY_COLOR: '#0000FF',
    PUCK_COLOR: '#000000',
    
    // Game settings
    SCORE_TO_WIN: 5,
    GAME_DURATION: 180, // 3 minutes in seconds
    RINK_WIDTH: 800,
    RINK_HEIGHT: 400,
};

export const SPRITE_FRAMES = {
    FACING_RIGHT: 0,
    FACING_LEFT: 1,
    SHOOTING_RIGHT: 2,
    SHOOTING_LEFT: 3
};

export const GOALIE_FRAMES = {
    STANDING: 0,
    DIVING_RIGHT: 1,
    DIVING_LEFT: 2
};

export const PLAYER_POSITIONS = {
    PLAYER1: { x: width * 0.3, y: height * 0.5 },
    PLAYER2: { x: width * 0.4, y: height * 0.5 },
    ENEMY1: { x: width * 0.6, y: height * 0.3 },
    ENEMY2: { x: width * 0.7, y: height * 0.7 }
};

export const NET_POSITIONS = {
    LEFT: { x: 50, y: height * 0.5 - 40 },
    RIGHT: { x: width - 150, y: height * 0.5 - 40 }
};

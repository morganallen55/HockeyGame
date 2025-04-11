import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const GAME_CONSTANTS = {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,

  RINK_WIDTH: width * 0.95,
  RINK_HEIGHT: height * 0.75,

  PLAYER_WIDTH: 48,
  PLAYER_HEIGHT: 48,
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 48,

  ENEMY_WIDTH: 48,
  ENEMY_HEIGHT: 48,
  ENEMY_SPEED: 4,
  ENEMY_SIZE: 48,

  PUCK_SIZE: 24,
  PUCK_SPEED: 8,

  GOALIE_WIDTH: 48,
  GOALIE_HEIGHT: 48,
  GOALIE_SIZE: 48,
  GOALIE_SPEED: 3,

  GOAL_WIDTH: 120,
  GOAL_HEIGHT: 60,
  GOAL_DEPTH: 30,

  FRICTION: 0.98,
  SHOOTING_POWER: 15,

  GAME_DURATION: 180,

  GAME_STATES: {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
  },

  DIRECTIONS: {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
  },

  ICE_COLOR: '#f0f8ff',
  BOUNDARY_PADDING: 20
};

export const PLAYER_POSITIONS = {
  PLAYER1: { x: width * 0.3, y: height * 0.3 },
  PLAYER2: { x: width * 0.7, y: height * 0.3 },
  ENEMY1: { x: width * 0.3, y: height * 0.6 },
  ENEMY2: { x: width * 0.7, y: height * 0.6 }
};

export const NET_POSITIONS = {
  TOP: { x: width / 2 - GAME_CONSTANTS.GOAL_WIDTH / 2, y: 0 },
  BOTTOM: { x: width / 2 - GAME_CONSTANTS.GOAL_WIDTH / 2, y: GAME_CONSTANTS.RINK_HEIGHT - GAME_CONSTANTS.GOAL_HEIGHT }
};

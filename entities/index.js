import { GAME_CONSTANTS, PLAYER_POSITIONS, NET_POSITIONS } from '../constants';

export class GameState {
    constructor() {
        this.score = 0;
        this.gameTime = GAME_CONSTANTS.GAME_DURATION;
        this.isGameOver = false;
        this.selectedPlayer = null;
        
        this.players = [
            { id: 1, position: PLAYER_POSITIONS.PLAYER1, velocity: { x: 0, y: 0 } },
            { id: 2, position: PLAYER_POSITIONS.PLAYER2, velocity: { x: 0, y: 0 } },
        ];
        
        this.enemies = [
            { id: 1, position: PLAYER_POSITIONS.ENEMY1, velocity: { x: 0, y: 0 } },
            { id: 2, position: PLAYER_POSITIONS.ENEMY2, velocity: { x: 0, y: 0 } },
        ];
        
        this.puck = {
            position: {
                x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
                y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
            },
            velocity: { x: 0, y: 0 },
        };
        
        this.nets = {
            left: NET_POSITIONS.LEFT,
            right: NET_POSITIONS.RIGHT,
        };
    }
    
    updateScore() {
        this.score += 1;
    }
    
    resetPuck() {
        this.puck.position = {
            x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
            y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
        };
        this.puck.velocity = { x: 0, y: 0 };
    }
    
    selectPlayer(playerId) {
        this.selectedPlayer = playerId;
    }
    
    updateGameTime() {
        if (this.gameTime > 0) {
            this.gameTime -= 1;
        } else {
            this.isGameOver = true;
        }
    }
    
    resetGame() {
        this.score = 0;
        this.gameTime = GAME_CONSTANTS.GAME_DURATION;
        this.isGameOver = false;
        this.selectedPlayer = null;
        this.resetPuck();
        
        this.players.forEach((player, index) => {
            player.position = index === 0 ? PLAYER_POSITIONS.PLAYER1 : PLAYER_POSITIONS.PLAYER2;
            player.velocity = { x: 0, y: 0 };
        });
        
        this.enemies.forEach((enemy, index) => {
            enemy.position = index === 0 ? PLAYER_POSITIONS.ENEMY1 : PLAYER_POSITIONS.ENEMY2;
            enemy.velocity = { x: 0, y: 0 };
        });
    }
} 
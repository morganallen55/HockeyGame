import { GAME_CONSTANTS } from './constants';

export const checkCollision = (obj1, obj2) => {
    const distance = Math.sqrt(
        Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
    );
    return distance < (obj1.size + obj2.size) / 2;
};

export const calculatePuckMovement = (puck, velocity) => {
    return {
        x: puck.x + velocity.x * GAME_CONSTANTS.PUCK_SPEED,
        y: puck.y + velocity.y * GAME_CONSTANTS.PUCK_SPEED,
    };
};

export const applyFriction = (velocity) => {
    return {
        x: velocity.x * GAME_CONSTANTS.FRICTION,
        y: velocity.y * GAME_CONSTANTS.FRICTION,
    };
};

export const calculatePlayerMovement = (player, direction) => {
    const newX = player.x + direction.x * GAME_CONSTANTS.PLAYER_SPEED;
    const newY = player.y + direction.y * GAME_CONSTANTS.PLAYER_SPEED;
    
    // Keep player within bounds
    return {
        x: Math.max(GAME_CONSTANTS.PLAYER_SIZE, Math.min(GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.PLAYER_SIZE, newX)),
        y: Math.max(GAME_CONSTANTS.PLAYER_SIZE, Math.min(GAME_CONSTANTS.SCREEN_HEIGHT - GAME_CONSTANTS.PLAYER_SIZE, newY)),
    };
};

export const calculateEnemyMovement = (enemy, puck) => {
    const dx = puck.x - enemy.x;
    const dy = puck.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return {
        x: enemy.x + (dx / distance) * GAME_CONSTANTS.ENEMY_SPEED,
        y: enemy.y + (dy / distance) * GAME_CONSTANTS.ENEMY_SPEED,
    };
};

export const checkGoal = (puck, net) => {
    return (
        puck.x > net.x &&
        puck.x < net.x + GAME_CONSTANTS.NET_WIDTH &&
        puck.y > net.y &&
        puck.y < net.y + GAME_CONSTANTS.NET_HEIGHT
    );
}; 
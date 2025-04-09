import Matter from 'matter-js';
import { GAME_CONSTANTS } from './constants';

// Utility functions for game mechanics
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
        puck.x < net.x + GAME_CONSTANTS.GOAL_WIDTH &&
        puck.y > net.y &&
        puck.y < net.y + GAME_CONSTANTS.GOAL_HEIGHT
    );
};

// Matter.js physics engine setup and update logic
const Physics = (entities, { time }) => {
    const engine = entities.physics.engine;
    
    // Update the physics engine
    Matter.Engine.update(engine, time.delta);
    
    // Check for collisions with goals
    const puck = entities.puck.body;
    const goal1 = entities.goal1.body;
    const goal2 = entities.goal2.body;
    
    // Check if puck is in goal1
    if (Matter.Collision.collides(puck, goal1)) {
        // Reset puck position
        Matter.Body.setPosition(puck, { x: 400, y: 300 });
        Matter.Body.setVelocity(puck, { x: 0, y: 0 });
        
        // Dispatch goal event
        entities.gameEngine.dispatch({ type: 'goal', team: 'enemy' });
    }
    
    // Check if puck is in goal2
    if (Matter.Collision.collides(puck, goal2)) {
        // Reset puck position
        Matter.Body.setPosition(puck, { x: 400, y: 300 });
        Matter.Body.setVelocity(puck, { x: 0, y: 0 });
        
        // Dispatch goal event
        entities.gameEngine.dispatch({ type: 'goal', team: 'player' });
    }
    
    // Update player movement state
    const player1 = entities.player1;
    const player2 = entities.player2;
    const enemy1 = entities.enemy1;
    const enemy2 = entities.enemy2;
    
    // Check if players are moving
    if (player1) {
        const velocity = player1.body.velocity;
        player1.isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;
    }
    
    if (player2) {
        const velocity = player2.body.velocity;
        player2.isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;
    }
    
    if (enemy1) {
        const velocity = enemy1.body.velocity;
        enemy1.isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;
    }
    
    if (enemy2) {
        const velocity = enemy2.body.velocity;
        enemy2.isMoving = Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1;
    }
    
    return entities;
};

export default Physics;
  
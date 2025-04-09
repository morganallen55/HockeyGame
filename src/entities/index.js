import Matter from "matter-js";
import { GAME_CONSTANTS, PLAYER_POSITIONS, NET_POSITIONS } from '../constants';
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Puck from "../components/Puck";
import Goalie from "../components/Goalie";
import Goal from '../components/Goal';
import spriteSheet from '../assets/hockey-spritesheet.png';

// Create the physics world
const createWorld = () => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    const world = engine.world;
    
    // Create walls to keep entities within bounds
    const walls = [
        Matter.Bodies.rectangle(GAME_CONSTANTS.SCREEN_WIDTH / 2, 0, GAME_CONSTANTS.SCREEN_WIDTH, 60, { isStatic: true }), // Top
        Matter.Bodies.rectangle(GAME_CONSTANTS.SCREEN_WIDTH / 2, GAME_CONSTANTS.SCREEN_HEIGHT, GAME_CONSTANTS.SCREEN_WIDTH, 60, { isStatic: true }), // Bottom
        Matter.Bodies.rectangle(0, GAME_CONSTANTS.SCREEN_HEIGHT / 2, 60, GAME_CONSTANTS.SCREEN_HEIGHT, { isStatic: true }), // Left
        Matter.Bodies.rectangle(GAME_CONSTANTS.SCREEN_WIDTH, GAME_CONSTANTS.SCREEN_HEIGHT / 2, 60, GAME_CONSTANTS.SCREEN_HEIGHT, { isStatic: true }), // Right
    ];
    
    Matter.World.add(world, walls);
    
    return { engine, world };
};

// Create player entities
const createPlayers = (world) => {
    const player1 = Matter.Bodies.rectangle(
        PLAYER_POSITIONS.PLAYER1.x,
        PLAYER_POSITIONS.PLAYER1.y,
        GAME_CONSTANTS.PLAYER_SIZE,
        GAME_CONSTANTS.PLAYER_SIZE,
        { label: 'player1', friction: 0.1, restitution: 0.5 }
    );
    
    const player2 = Matter.Bodies.rectangle(
        PLAYER_POSITIONS.PLAYER2.x,
        PLAYER_POSITIONS.PLAYER2.y,
        GAME_CONSTANTS.PLAYER_SIZE,
        GAME_CONSTANTS.PLAYER_SIZE,
        { label: 'player2', friction: 0.1, restitution: 0.5 }
    );
    
    Matter.World.add(world, [player1, player2]);
    
    return { player1, player2 };
};

// Create enemy entities
const createEnemies = (world) => {
    const enemy1 = Matter.Bodies.rectangle(
        PLAYER_POSITIONS.ENEMY1.x,
        PLAYER_POSITIONS.ENEMY1.y,
        GAME_CONSTANTS.ENEMY_SIZE,
        GAME_CONSTANTS.ENEMY_SIZE,
        { label: 'enemy1', friction: 0.1, restitution: 0.5 }
    );
    
    const enemy2 = Matter.Bodies.rectangle(
        PLAYER_POSITIONS.ENEMY2.x,
        PLAYER_POSITIONS.ENEMY2.y,
        GAME_CONSTANTS.ENEMY_SIZE,
        GAME_CONSTANTS.ENEMY_SIZE,
        { label: 'enemy2', friction: 0.1, restitution: 0.5 }
    );
    
    Matter.World.add(world, [enemy1, enemy2]);
    
    return { enemy1, enemy2 };
};

// Create goalie entities
const createGoalies = (world) => {
    const goalie1 = Matter.Bodies.rectangle(
        NET_POSITIONS.LEFT.x + 50,
        NET_POSITIONS.LEFT.y,
        GAME_CONSTANTS.GOALIE_SIZE,
        GAME_CONSTANTS.GOALIE_SIZE,
        { label: 'goalie1', isStatic: true }
    );
    
    const goalie2 = Matter.Bodies.rectangle(
        NET_POSITIONS.RIGHT.x - 50,
        NET_POSITIONS.RIGHT.y,
        GAME_CONSTANTS.GOALIE_SIZE,
        GAME_CONSTANTS.GOALIE_SIZE,
        { label: 'goalie2', isStatic: true }
    );
    
    Matter.World.add(world, [goalie1, goalie2]);
    
    return { goalie1, goalie2 };
};

// Create puck entity
const createPuck = (world) => {
    const puck = Matter.Bodies.circle(
        GAME_CONSTANTS.SCREEN_WIDTH / 2,
        GAME_CONSTANTS.SCREEN_HEIGHT / 2,
        GAME_CONSTANTS.PUCK_SIZE / 2,
        { label: 'puck', friction: 0.05, restitution: 0.8, density: 0.001 }
    );
    
    Matter.World.add(world, puck);
    
    return puck;
};

// Create goal entities
const createGoals = (world) => {
    const goal1 = Matter.Bodies.rectangle(
        NET_POSITIONS.LEFT.x,
        NET_POSITIONS.LEFT.y,
        GAME_CONSTANTS.GOAL_DEPTH,
        GAME_CONSTANTS.GOAL_HEIGHT,
        { label: 'goal1', isStatic: true, isSensor: true }
    );
    
    const goal2 = Matter.Bodies.rectangle(
        NET_POSITIONS.RIGHT.x,
        NET_POSITIONS.RIGHT.y,
        GAME_CONSTANTS.GOAL_DEPTH,
        GAME_CONSTANTS.GOAL_HEIGHT,
        { label: 'goal2', isStatic: true, isSensor: true }
    );
    
    Matter.World.add(world, [goal1, goal2]);
    
    return { goal1, goal2 };
};

// Main entities function
export default (world) => {
    const { engine, world: physicsWorld } = createWorld();
    const { player1, player2 } = createPlayers(physicsWorld);
    const { enemy1, enemy2 } = createEnemies(physicsWorld);
    const { goalie1, goalie2 } = createGoalies(physicsWorld);
    const puck = createPuck(physicsWorld);
    const { goal1, goal2 } = createGoals(physicsWorld);
    
    return {
        physics: { engine, world: physicsWorld },
        player1: {
            body: player1,
            position: { x: player1.position.x, y: player1.position.y },
            direction: 'right',
            isShooting: false,
            spriteSheet,
            renderer: <Player />
        },
        player2: {
            body: player2,
            position: { x: player2.position.x, y: player2.position.y },
            direction: 'right',
            isShooting: false,
            spriteSheet,
            renderer: <Player />
        },
        enemy1: {
            body: enemy1,
            position: { x: enemy1.position.x, y: enemy1.position.y },
            direction: 'left',
            spriteSheet,
            frameY: 1, // Red players
            renderer: <Enemy />
        },
        enemy2: {
            body: enemy2,
            position: { x: enemy2.position.x, y: enemy2.position.y },
            direction: 'left',
            spriteSheet,
            frameY: 1, // Red players
            renderer: <Enemy />
        },
        goalie1: {
            body: goalie1,
            position: { x: goalie1.position.x, y: goalie1.position.y },
            direction: 'right',
            isDiving: false,
            spriteSheet,
            frameY: 2, // Goalie row
            renderer: <Goalie />
        },
        goalie2: {
            body: goalie2,
            position: { x: goalie2.position.x, y: goalie2.position.y },
            direction: 'left',
            isDiving: false,
            spriteSheet,
            frameY: 2, // Goalie row
            renderer: <Goalie />
        },
        puck: {
            body: puck,
            position: { x: puck.position.x, y: puck.position.y },
            renderer: <Puck />
        },
        goal1: {
            body: goal1,
            position: { x: goal1.position.x, y: goal1.position.y },
            isLeft: true,
            renderer: <Goal />
        },
        goal2: {
            body: goal2,
            position: { x: goal2.position.x, y: goal2.position.y },
            isLeft: false,
            renderer: <Goal />
        },
        gameEngine: {
            dispatch: () => {}
        }
    };
};

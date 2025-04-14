import Matter from "matter-js";
import {
  GAME_CONSTANTS,
  PLAYER_POSITIONS,
  NET_POSITIONS,
} from "../constants/constants";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Puck from "../components/Puck";
import Goalie from "../components/Goalie";
import Goal from "../components/Goal";

const createGameEntities = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  engine.world.gravity.y = 0;
  const world = engine.world;

  const player1 = Matter.Bodies.rectangle(
    PLAYER_POSITIONS.PLAYER1.x,
    PLAYER_POSITIONS.PLAYER1.y,
    GAME_CONSTANTS.PLAYER_WIDTH,
    GAME_CONSTANTS.PLAYER_HEIGHT,
    { label: "player1" }
  );

  const enemy1 = Matter.Bodies.rectangle(
    PLAYER_POSITIONS.ENEMY1.x,
    PLAYER_POSITIONS.ENEMY1.y,
    GAME_CONSTANTS.ENEMY_WIDTH,
    GAME_CONSTANTS.ENEMY_HEIGHT,
    { label: "enemy1", frictionAir: 0.05 }
  );

  const enemy2 = Matter.Bodies.rectangle(
    PLAYER_POSITIONS.ENEMY2.x,
    PLAYER_POSITIONS.ENEMY2.y,
    GAME_CONSTANTS.ENEMY_WIDTH,
    GAME_CONSTANTS.ENEMY_HEIGHT,
    { label: "enemy2", frictionAir: 0.05 }
  );

  const goalie1 = Matter.Bodies.rectangle(
    NET_POSITIONS.TOP.x + GAME_CONSTANTS.GOAL_WIDTH / 2,
    NET_POSITIONS.TOP.y + GAME_CONSTANTS.GOAL_HEIGHT + 10,
    GAME_CONSTANTS.GOALIE_SIZE,
    GAME_CONSTANTS.GOALIE_SIZE,
    { label: "goalie1", isStatic: true }
  );

  const goalie2 = Matter.Bodies.rectangle(
    NET_POSITIONS.BOTTOM.x + GAME_CONSTANTS.GOAL_WIDTH / 2,
    NET_POSITIONS.BOTTOM.y - 10,
    GAME_CONSTANTS.GOALIE_SIZE,
    GAME_CONSTANTS.GOALIE_SIZE,
    { label: "goalie2", isStatic: true }
  );

  const puck = Matter.Bodies.circle(
    GAME_CONSTANTS.SCREEN_WIDTH / 2,
    GAME_CONSTANTS.SCREEN_HEIGHT / 2,
    GAME_CONSTANTS.PUCK_SIZE / 2,
    {
      label: "puck",
      restitution: 0.9,
      frictionAir: 0.01,
    }
  );

  Matter.World.add(world, [player1, enemy1, enemy2, goalie1, goalie2, puck]);

  return {
    physics: { engine, world },
    player1: { body: player1, renderer: Player },
    enemy1: { body: enemy1, renderer: Enemy },
    enemy2: { body: enemy2, renderer: Enemy },
    goalie1: { body: goalie1, renderer: Goalie },
    goalie2: { body: goalie2, renderer: Goalie },
    puck: { body: puck, renderer: Puck },
    goal1: {
      position: NET_POSITIONS.TOP,
      isLeft: true,
      renderer: Goal,
    },
    goal2: {
      position: NET_POSITIONS.BOTTOM,
      isLeft: false,
      renderer: Goal,
    },
  };
};

export default createGameEntities;

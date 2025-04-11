import Matter from "matter-js";
import {
  GAME_CONSTANTS,
  PLAYER_POSITIONS,
  NET_POSITIONS
} from "../constants";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Puck from "../components/Puck";
import Goalie from "../components/Goalie";
import Goal from "../components/Goal";

const createGameEntities = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;

  const getSafePosition = (pos, fallback) =>
    !pos || pos.x == null || pos.y == null ? fallback : pos;

  const pos1 = getSafePosition(PLAYER_POSITIONS.PLAYER1, { x: 200, y: 300 });
  const pos2 = getSafePosition(PLAYER_POSITIONS.PLAYER2, { x: 300, y: 300 });

  const player1 = Matter.Bodies.rectangle(
    pos1.x,
    pos1.y,
    GAME_CONSTANTS.PLAYER_WIDTH,
    GAME_CONSTANTS.PLAYER_HEIGHT,
    { label: "player1" }
  );
  const player2 = Matter.Bodies.rectangle(
    pos2.x,
    pos2.y,
    GAME_CONSTANTS.PLAYER_WIDTH,
    GAME_CONSTANTS.PLAYER_HEIGHT,
    { label: "player2" }
  );

  const e1 = getSafePosition(PLAYER_POSITIONS.ENEMY1, { x: 200, y: 500 });
  const e2 = getSafePosition(PLAYER_POSITIONS.ENEMY2, { x: 300, y: 500 });

  const enemy1 = Matter.Bodies.rectangle(
    e1.x,
    e1.y,
    GAME_CONSTANTS.ENEMY_WIDTH,
    GAME_CONSTANTS.ENEMY_HEIGHT,
    { label: "enemy1" }
  );
  const enemy2 = Matter.Bodies.rectangle(
    e2.x,
    e2.y,
    GAME_CONSTANTS.ENEMY_WIDTH,
    GAME_CONSTANTS.ENEMY_HEIGHT,
    { label: "enemy2" }
  );

  const g1 = getSafePosition(NET_POSITIONS.TOP, { x: 400, y: 30 });
  const g2 = getSafePosition(NET_POSITIONS.BOTTOM, { x: 400, y: 730 });

  const goalie1 = Matter.Bodies.rectangle(
    g1.x + GAME_CONSTANTS.GOAL_WIDTH / 2,
    g1.y + GAME_CONSTANTS.GOAL_HEIGHT + 10,
    GAME_CONSTANTS.GOALIE_SIZE,
    GAME_CONSTANTS.GOALIE_SIZE,
    { label: "goalie1", isStatic: true }
  );
  const goalie2 = Matter.Bodies.rectangle(
    g2.x + GAME_CONSTANTS.GOAL_WIDTH / 2,
    g2.y - 10,
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
      frictionAir: 0.01
    }
  );

  Matter.World.add(world, [player1, player2, enemy1, enemy2, goalie1, goalie2, puck]);

  return {
    physics: { engine, world },
    player1: { body: player1, renderer: Player },
    player2: { body: player2, renderer: Player },
    enemy1: { body: enemy1, renderer: Enemy },
    enemy2: { body: enemy2, renderer: Enemy },
    goalie1: { body: goalie1, renderer: Goalie },
    goalie2: { body: goalie2, renderer: Goalie },
    puck: { body: puck, renderer: Puck },
    goal1: { position: NET_POSITIONS.TOP, isLeft: true, renderer: Goal },
    goal2: { position: NET_POSITIONS.BOTTOM, isLeft: false, renderer: Goal }
  };
};

export default createGameEntities;

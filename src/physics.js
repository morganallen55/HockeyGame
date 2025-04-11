// src/physics.js
import Matter from 'matter-js';
import { GAME_CONSTANTS } from './constants';

const Physics = (entities, { time, touches, dispatch }) => {
  const { engine } = entities.physics;
  Matter.Engine.update(engine, time.delta);

  const {
    puck,
    player1,
    player2,
    enemy1,
    enemy2,
    goalie1,
    goalie2,
    selectedPlayer,
  } = entities;

  if (!puck?.body || !player1?.body || !player2?.body || !enemy1?.body || !enemy2?.body || !goalie1?.body || !goalie2?.body) {
    return entities;
  }

  const puckBody = puck.body;
  const p1 = player1.body;
  const p2 = player2.body;
  const e1 = enemy1.body;
  const e2 = enemy2.body;
  const g1 = goalie1.body;
  const g2 = goalie2.body;

  // --- Tap to select player ---
  touches.filter(t => t.type === "press").forEach(t => {
    const tapX = t.event?.pageX ?? t.pageX;
    const tapY = t.event?.pageY ?? t.pageY;
    if (tapX === undefined || tapY === undefined) return;

    const isNear = (body) => {
      const dx = body.position.x - tapX;
      const dy = body.position.y - tapY;
      return Math.sqrt(dx * dx + dy * dy) < 50;
    };

    if (isNear(p1)) {
      dispatch({ type: 'select-player', id: 'player1' });
    } else if (isNear(p2)) {
      dispatch({ type: 'select-player', id: 'player2' });
    }
  });

  // --- Drag player ---
  touches.filter(t => t.type === "move").forEach(t => {
    if (!selectedPlayer) return;
    const body = selectedPlayer === 'player1' ? p1 : p2;
    Matter.Body.setPosition(body, {
      x: body.position.x + t.delta.pageX,
      y: body.position.y + t.delta.pageY,
    });
  });

  // --- Shoot puck near selected player ---
  touches.filter(t => t.type === "end").forEach(t => {
    if (!selectedPlayer) return;
    const playerBody = selectedPlayer === 'player1' ? p1 : p2;
    const dx = puckBody.position.x - playerBody.position.x;
    const dy = puckBody.position.y - playerBody.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 60) {
      Matter.Body.applyForce(puckBody, puckBody.position, {
        x: dx * 0.005,
        y: dy * 0.005,
      });
    }
  });

  // --- Enemies move constantly ---
  const dir1 = Math.sin(time.current / 500) > 0 ? 1 : -1;
  const dir2 = Math.cos(time.current / 500) > 0 ? 1 : -1;
  Matter.Body.translate(e1, { x: dir1 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });
  Matter.Body.translate(e2, { x: dir2 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });

  // --- Reset puck on enemy collision ---
  const collided1 = Matter.Collision.collides(p1, e1);
  const collided2 = Matter.Collision.collides(p2, e2);
  if ((collided1 && collided1.collided) || (collided2 && collided2.collided)) {
    Matter.Body.setPosition(puckBody, {
      x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
      y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
    });
    Matter.Body.setVelocity(puckBody, { x: 0, y: 0 });
    dispatch({ type: 'puck-lost' });
  }

  // Ensure enemies keep moving after a reset
  Matter.Body.translate(e1, { x: dir1 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });
  Matter.Body.translate(e2, { x: dir2 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });

  // Adjust puck collision detection with players
  const playerCollided = Matter.Collision.collides(puckBody, selectedPlayer === 'player1' ? p1 : p2);
  if (playerCollided) {
    const dx = puckBody.position.x - playerCollided.bodyA.position.x;
    const dy = puckBody.position.y - playerCollided.bodyA.position.y;
    Matter.Body.applyForce(puckBody, puckBody.position, {
      x: dx * 0.01, // Adjust force multiplier for realistic movement
      y: dy * 0.01,
    });
  }

  // --- Goalie movement ---
  Matter.Body.setPosition(g1, {
    x: GAME_CONSTANTS.SCREEN_WIDTH / 2 + 40 * Math.sin(time.current / 400),
    y: GAME_CONSTANTS.GOAL_HEIGHT + 15,
  });

  Matter.Body.setPosition(g2, {
    x: GAME_CONSTANTS.SCREEN_WIDTH / 2 + 40 * Math.sin(time.current / 400), // Side-to-side movement
    y: GAME_CONSTANTS.SCREEN_HEIGHT - GAME_CONSTANTS.GOAL_HEIGHT - 15,
  });

  // --- Goal detection (top and bottom nets) ---
  const goalTop = {
    x: (GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.GOAL_WIDTH) / 2,
    y: 0,
    width: GAME_CONSTANTS.GOAL_WIDTH,
    height: GAME_CONSTANTS.GOAL_HEIGHT
  };
  const goalBottom = {
    x: (GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.GOAL_WIDTH) / 2,
    y: GAME_CONSTANTS.SCREEN_HEIGHT - GAME_CONSTANTS.GOAL_HEIGHT,
    width: GAME_CONSTANTS.GOAL_WIDTH,
    height: GAME_CONSTANTS.GOAL_HEIGHT
  };

  const isInsideGoal = (goal) => {
    return (
      puckBody.position.x >= goal.x &&
      puckBody.position.x <= goal.x + goal.width &&
      puckBody.position.y >= goal.y &&
      puckBody.position.y <= goal.y + goal.height
    );
  };

  if (isInsideGoal(goalTop)) {
    dispatch({ type: 'goal', team: 'enemy' });
  }

  if (isInsideGoal(goalBottom)) {
    dispatch({ type: 'goal', team: 'player' });
  }

  // --- Rink boundaries ---
  const rinkBounds = {
    left: 0,
    right: GAME_CONSTANTS.SCREEN_WIDTH,
    top: 0,
    bottom: GAME_CONSTANTS.SCREEN_HEIGHT,
  };

  const keepWithinBounds = (body) => {
    if (body.position.x < rinkBounds.left) {
      Matter.Body.setPosition(body, { x: rinkBounds.left, y: body.position.y });
      Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
    } else if (body.position.x > rinkBounds.right) {
      Matter.Body.setPosition(body, { x: rinkBounds.right, y: body.position.y });
      Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
    }

    if (body.position.y < rinkBounds.top) {
      Matter.Body.setPosition(body, { x: body.position.x, y: rinkBounds.top });
      Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
    } else if (body.position.y > rinkBounds.bottom) {
      Matter.Body.setPosition(body, { x: body.position.x, y: rinkBounds.bottom });
      Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
    }
  };

  // Apply boundary constraints to all entities
  [puckBody, p1, p2, e1, e2, g1, g2].forEach(keepWithinBounds);

  // --- Ensure enemies are initialized within rink bounds ---
  const initializeEnemyPosition = (enemyBody, defaultX, defaultY) => {
    if (
      enemyBody.position.x < rinkBounds.left ||
      enemyBody.position.x > rinkBounds.right ||
      enemyBody.position.y < rinkBounds.top ||
      enemyBody.position.y > rinkBounds.bottom
    ) {
      Matter.Body.setPosition(enemyBody, { x: defaultX, y: defaultY });
    }
  };

  initializeEnemyPosition(e1, GAME_CONSTANTS.SCREEN_WIDTH / 4, GAME_CONSTANTS.SCREEN_HEIGHT / 2);
  initializeEnemyPosition(e2, (3 * GAME_CONSTANTS.SCREEN_WIDTH) / 4, GAME_CONSTANTS.SCREEN_HEIGHT / 2);
  keepWithinBounds(g2);

  return entities;
};

export default Physics;

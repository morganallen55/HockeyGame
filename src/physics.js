import Matter from "matter-js";
import { GAME_CONSTANTS } from "./constants/constants";

let lastGoalTime = 0;
let dragTouchId = null;

const enforceBoundaryConstraints = (entities) => {
  const bounds = {
    left: GAME_CONSTANTS.BOUNDARY_PADDING,
    right: GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.BOUNDARY_PADDING,
    top: GAME_CONSTANTS.BOUNDARY_PADDING,
    bottom: GAME_CONSTANTS.SCREEN_HEIGHT - GAME_CONSTANTS.BOUNDARY_PADDING,
  };

  const clamp = (body) => {
    if (body.position.x < bounds.left) {
      Matter.Body.setPosition(body, { x: bounds.left, y: body.position.y });
    } else if (body.position.x > bounds.right) {
      Matter.Body.setPosition(body, { x: bounds.right, y: body.position.y });
    }

    if (body.position.y < bounds.top) {
      Matter.Body.setPosition(body, { x: body.position.x, y: bounds.top });
    } else if (body.position.y > bounds.bottom) {
      Matter.Body.setPosition(body, { x: body.position.x, y: bounds.bottom });
    }
  };

  [
    entities.puck.body,
    entities.player1.body,
    entities.player2.body,
    entities.enemy1.body,
    entities.enemy2.body,
    entities.goalie1.body,
    entities.goalie2.body,
  ].forEach(clamp);
};

const Physics = (entities, { time, touches, dispatch }) => {
  const { engine } = entities.physics;
  Matter.Engine.update(engine, time.delta);
  enforceBoundaryConstraints(entities);

  const {
    puck, player1, player2,
    enemy1, enemy2,
    goalie1, goalie2,
    selectedPlayer
  } = entities;

  const puckBody = puck.body;
  const p1 = player1.body;
  const p2 = player2.body;
  const e1 = enemy1.body;
  const e2 = enemy2.body;
  const g1 = goalie1.body;
  const g2 = goalie2.body;

  // === Tap to select player ===
  touches.filter(t => t.type === "press").forEach(t => {
    const tapX = t.event?.pageX ?? t.pageX;
    const tapY = t.event?.pageY ?? t.pageY;
    if (!tapX || !tapY) return;

    const isNear = (body) => {
      const dx = body.position.x - tapX;
      const dy = body.position.y - tapY;
      return Math.sqrt(dx * dx + dy * dy) < 50;
    };

    if (isNear(p1)) dispatch({ type: "select-player", id: "player1" });
    else if (isNear(p2)) dispatch({ type: "select-player", id: "player2" });
  });

  // === Drag to move selected player (position-based) ===
  touches.filter(t => t.type === "move").forEach(t => {
    if (dragTouchId === null) {
      dragTouchId = t.id; // Set the drag touch ID when dragging starts
    }

    if (t.id !== dragTouchId) return; // Ignore other touches

    const moveX = t.event?.pageX ?? t.pageX;
    const moveY = t.event?.pageY ?? t.pageY;
    if (!moveX || !moveY) return;

    const selected = selectedPlayer === "player1" ? p1 :
                     selectedPlayer === "player2" ? p2 : null;

    if (!selected) return;

    // Directly set the player's position to the touch position
    Matter.Body.setPosition(selected, {
      x: moveX,
      y: moveY,
    });

    // Ensure the player's velocity is zero while dragging
    Matter.Body.setVelocity(selected, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(selected, 0); // Stop any rotation
  });

  // === Release to stop player ===
  touches.filter(t => t.type === "end").forEach(t => {
    if (t.id === dragTouchId) {
      dragTouchId = null; // Clear the drag touch ID when dragging ends
    }

    const selected = selectedPlayer === "player1" ? p1 :
                     selectedPlayer === "player2" ? p2 : null;

    if (selected) {
      // Ensure the player stops moving after release
      Matter.Body.setVelocity(selected, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(selected, 0); // Stop any rotation
    }
  });

  // === Enemy movement ===
  const dir1 = Math.sin(time.current / 500) > 0 ? 1 : -1;
  const dir2 = Math.cos(time.current / 500) > 0 ? 1 : -1;
  Matter.Body.translate(e1, { x: dir1 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });
  Matter.Body.translate(e2, { x: dir2 * GAME_CONSTANTS.ENEMY_SPEED, y: 0 });

  // === Goal detection ===
const currentTime = Date.now();
const cooldown = 1000; // 1 second cooldown between goals

const goalTop = {
  x: (GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.GOAL_WIDTH) / 2,
  y: 0,
  width: GAME_CONSTANTS.GOAL_WIDTH,
  height: GAME_CONSTANTS.GOAL_HEIGHT,
};

const goalBottom = {
  ...goalTop,
  y: GAME_CONSTANTS.SCREEN_HEIGHT - GAME_CONSTANTS.GOAL_HEIGHT,
};

const isInsideGoal = (goal) =>
  puckBody.position.x >= goal.x &&
  puckBody.position.x <= goal.x + goal.width &&
  puckBody.position.y >= goal.y + goal.height / 2 && // Back half of the goal
  puckBody.position.y <= goal.y + goal.height;

if (isInsideGoal(goalTop) && currentTime - lastGoalTime > cooldown) {
  lastGoalTime = currentTime;
  dispatch({ type: "goal", team: "enemy" });
  Matter.Body.setPosition(puckBody, {
    x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
    y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
  });
  Matter.Body.setVelocity(puckBody, { x: 0, y: 0 });
}

if (isInsideGoal(goalBottom) && currentTime - lastGoalTime > cooldown) {
  lastGoalTime = currentTime;
  dispatch({ type: "goal", team: "player" });
  Matter.Body.setPosition(puckBody, {
    x: GAME_CONSTANTS.SCREEN_WIDTH / 2,
    y: GAME_CONSTANTS.SCREEN_HEIGHT / 2,
  });
  Matter.Body.setVelocity(puckBody, { x: 0, y: 0 });
}


  return entities;
};

export default Physics;

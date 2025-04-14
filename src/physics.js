import Matter from "matter-js";
import { GAME_CONSTANTS } from "./constants/constants";

let lastGoalTime = 0;

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
    puck, player1, player2, enemy1, enemy2, selectedPlayer
  } = entities;

  const puckBody = puck.body;
  const p1 = player1.body;
  const p2 = player2.body;
  const e1 = enemy1.body;
  const e2 = enemy2.body;

  // Tap to select player
  touches.filter(t => t.type === "press").forEach(t => {
    const tapX = t.event?.pageX ?? t.pageX;
    const tapY = t.event?.pageY ?? t.pageY;
    if (!tapX || !tapY) return;

    const isNear = (body) => {
      const dx = body.position.x - tapX;
      const dy = body.position.y - tapY;
      return Math.sqrt(dx * dx + dy * dy) < 80;
    };

    if (isNear(p1)) dispatch({ type: "select-player", id: "player1" });
    else if (isNear(p2)) dispatch({ type: "select-player", id: "player2" });
  });

  // Swipe to shoot puck
  touches.filter(t => t.type === "end").forEach(t => {
    const selected = selectedPlayer === "player1" ? p1 : selectedPlayer === "player2" ? p2 : null;
    if (!selected) return;

    const dx = puckBody.position.x - selected.position.x;
    const dy = puckBody.position.y - selected.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      Matter.Body.applyForce(puckBody, puckBody.position, {
        x: dx * 0.01,
        y: Math.max(dy * 0.01, 0),
      });
    }
  });

  // Enemy movement
  const dir1 = Math.sin(time.current / 500) > 0 ? 1 : -1;
  const dir2 = Math.cos(time.current / 500) > 0 ? 1 : -1;
  Matter.Body.translate(e1, { x: dir1 * 1.5, y: 0 });
  Matter.Body.translate(e2, { x: dir2 * 1.5, y: 0 });

  // Goal Detection
  const currentTime = Date.now();
  const cooldown = 1200;

  const goalTop = {
    x: (GAME_CONSTANTS.SCREEN_WIDTH - GAME_CONSTANTS.GOAL_WIDTH) / 2,
    y: 0,
    width: GAME_CONSTANTS.GOAL_WIDTH,
    height: GAME_CONSTANTS.GOAL_HEIGHT + 40,
  };

  const goalBottom = {
    ...goalTop,
    y: GAME_CONSTANTS.SCREEN_HEIGHT - (GAME_CONSTANTS.GOAL_HEIGHT + 40),
  };

  const isInsideGoal = (goal) =>
    puckBody.position.x >= goal.x &&
    puckBody.position.x <= goal.x + goal.width &&
    puckBody.position.y >= goal.y &&
    puckBody.position.y <= goal.y + goal.height;

  if (isInsideGoal(goalTop) && currentTime - lastGoalTime > cooldown) {
    lastGoalTime = currentTime;
    dispatch({ type: "goal", team: "enemy" });
  }

  if (isInsideGoal(goalBottom) && currentTime - lastGoalTime > cooldown) {
    lastGoalTime = currentTime;
    dispatch({ type: "goal", team: "player" });
  }

  return entities;
};

export default Physics;

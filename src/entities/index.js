import Matter from "matter-js";
import Player from "../components/Player";
import Enemy from "../components/Enemy";
import Puck from "../components/Puck";

export default (world) => {
  return {
    player1: Player(world, 100, 300),
    player2: Player(world, 200, 300),
    enemy1: Enemy(world, 300, 100),
    enemy2: Enemy(world, 400, 100),
    puck: Puck(world, 250, 250),
  };
};

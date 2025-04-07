import React, { useRef } from "react";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";  // Import this

import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import entities from "./entities";
import Physics from "./physics";

export default function App() {
  const gameEngine = useRef(null);
  const world = Matter.World.create({ gravity: { x: 0, y: 0 } });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>  // Wrap with GestureHandlerRootView
      <StatusBar hidden={true} />
      <GameEngine
        ref={gameEngine}
        systems={[Physics]}
        entities={entities(world)}
        running={true}
        style={{ flex: 1, backgroundColor: "lightblue" }}
      />
    </GestureHandlerRootView>
  );
}

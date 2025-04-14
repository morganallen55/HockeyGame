import React, { useRef } from "react";
import { View, Image, StyleSheet, PanResponder } from "react-native";
import playerImage from "../assets/player.png";
import { GAME_CONSTANTS } from "../constants/constants";
import Matter from "matter-js";

const Player = ({ body, isSelected, onTap }) => {
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isSelected,
      onPanResponderGrant: (evt) => {
        if (onTap) onTap(); // still supports tap-to-select
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isSelected) {
          const newX = evt.nativeEvent.pageX;
          const newY = evt.nativeEvent.pageY;

          // Soft interpolation to reduce jumpiness
          const currentX = body.position.x;
          const currentY = body.position.y;
          const smoothX = currentX + (newX - currentX) * 0.2;
          const smoothY = currentY + (newY - currentY) * 0.2;

          Matter.Body.setPosition(body, {
            x: smoothX,
            y: smoothY,
          });
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View
      style={[
        styles.container,
        { left: x, top: y },
        isSelected && styles.glow,
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={playerImage} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: GAME_CONSTANTS.PLAYER_SIZE,
    height: GAME_CONSTANTS.PLAYER_SIZE,
  },
  glow: {
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default Player;

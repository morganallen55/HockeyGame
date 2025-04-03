import Matter from "matter-js";
import { View, Image } from "react-native";
import enemyImage from "../assets/enemy.png";

const Enemy = (props) => {
  const { body } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    >
      <Image source={enemyImage} style={{ width, height }} />
    </View>
  );
};

export default (world, x, y) => {
  let body = Matter.Bodies.rectangle(x, y, 50, 50, { label: "Enemy" });
  Matter.World.add(world, body);

  return { body, renderer: <Enemy /> };
};

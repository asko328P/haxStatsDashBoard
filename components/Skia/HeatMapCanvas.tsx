import { Canvas, Rect } from "@shopify/react-native-skia";

const HeatMapCanvas = () => {
  return (
    <Canvas style={{ width: 100, height: 300 }}>
      <Rect width={23} height={43} color={"#FFFF00"} />
      {/*<Image*/}
      {/*  width={200}*/}
      {/*  height={300}*/}
      {/*  image={require("@/assets/maps/2v2.png")}*/}
      {/*/>*/}
    </Canvas>
  );
};

export default HeatMapCanvas;

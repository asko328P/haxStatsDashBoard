import { ActivityIndicator, View } from "react-native";

const CustomActivityIndicator = () => {
  const randomColor = Math.random() > 0.5 ? "#a13434" : "#3288a5";
  return <ActivityIndicator size={50} color={randomColor} />;
};

export default CustomActivityIndicator;

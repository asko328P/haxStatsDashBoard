// export const stadiumArray: {
//   stadiumData: { name: string; width: number; height: number };
//   image: any;
// }[] = [
//   {
//     stadiumData: require("@/assets/maps/WFL FUTSAL 2V2.json"),
//     image: require("@/assets/maps/2v2.png"),
//   },
// ];

export const implementedMaps: {
  [key: string]: { image: any; name: string; width: number; height: number };
} = {
  "WFL | MEDIUM": {
    image: require("@/assets/maps/2v2.png"),
    ...require("@/assets/maps/WFL FUTSAL 2V2.json"),
  },
  "WFL | BIG": {
    image: require("@/assets/maps/3v3.png"),
    ...require("@/assets/maps/WFL FUTSAL 3V3.json"),
  },
};

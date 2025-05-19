import React from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions } from "react-native";

const mapImage = require("../../assets/images/nhl-stenden-1.png");

const Map = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NHL Stenden - Emmen</Text>
      </View>
      <ImageBackground
        source={mapImage}
        resizeMode="contain"
        style={styles.map}>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  header: {
    flex: 1,
    height: 60,
    backgroundColor: "rgba(0, 64, 128, 0.6)",
    justifyContent: "center",
    padding: 15,
  },
  headerText: {
    color: "rgb(0, 0, 0)",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Map;

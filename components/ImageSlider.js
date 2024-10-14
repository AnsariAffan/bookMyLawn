import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import { Surface } from "react-native-paper";

const { width } = Dimensions.get("window");

const images = [
  require("../assets/download (1).jpeg"),
  require("../assets/download.jpeg"),
  require("../assets/images.jpeg"),
];

const ImageSlider = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(scrollToNextImage, 3000); // Change interval if needed
    return () => clearInterval(interval); // Clean up on unmount
  }, [currentIndex]);

  const renderImage = ({ item }) => (
    <Image source={item} style={styles.image} />
  );

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {images.map((_, index) => (
          <Surface
            key={index}
            style={[
              styles.dot,
              { opacity: index === currentIndex ? 1 : 0.5 }, // Change opacity based on the active index
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false} // Disable manual scrolling
        ref={flatListRef}
      />
      {renderDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical: 20,
  },
  image: {
    width: width * 0.95, // Set to 95% of the screen width
    height: 250,
    // marginLeft: 10,
    // marginRight: 10,
    // borderRadius: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
    margin: 5,
    elevation: 4, // Optional: Add shadow effect
  },
});

export default ImageSlider;

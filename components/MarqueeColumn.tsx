import React from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageRequireSource,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, 
  strict: false,
});

const ITEM_HEIGHT = 200;

type ImageSource = ImageRequireSource;

interface MarqueeColumnProps {
  direction?: "up" | "down";
  offset?: number;
  images: ImageSource[];
}

const MarqueeColumn: React.FC<MarqueeColumnProps> = ({
  direction = "down",
  offset = 0,
  images,
}) => {
  const startPosition = direction === "down" ? -ITEM_HEIGHT * images.length : 0;
  const endPosition = direction === "down" ? 0 : -ITEM_HEIGHT * images.length;

  const translationY = useSharedValue(startPosition);

  React.useEffect(() => {
    setTimeout(() => {
      translationY.value = withRepeat(
        withTiming(endPosition, {
          duration: 30000,
        }),
        -1,
        true
      );
    }, offset);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translationY.value }],
  }));

  const duplicatedImages = [...images, ...images];

  return (
    <Animated.View style={[styles.marqueeColumn, animatedStyle]}>
      {duplicatedImages.map((image, index) => (
        <View key={`${direction}-${index}`} style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="cover" />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  marqueeColumn: {
    width: "100%",
    position: "absolute",
  },
  imageContainer: {
    width: "100%",
    height: ITEM_HEIGHT,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});

export default MarqueeColumn;

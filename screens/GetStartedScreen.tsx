import MarqueeColumn from "../components/MarqueeColumn";
import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ImageRequireSource,
  Text,
  StatusBar,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
const TOP_CONTAINER_HEIGHT = height * 0.715;
const BOTTOM_CONTAINER_HEIGHT = height * 0.285;

const navigate = useNavigation().navigate;

const MARQUEE_WIDTH = width * 0.5;

type ImageSource = ImageRequireSource;

type RoutePaths = "/signin" | "/signup";
interface Slide {
  title: string;
  subtitle1: string;
  subtitle2: string;
  buttonText: string;
  redirectTo: RoutePaths;
}

const allImages: ImageSource[] = [
  require("../../assets/images/get-started/clothes-rack.png"),
  require("../../assets/images/get-started/popcorn-bowl.png"),
  require("../../assets/images/get-started/shoes.png"),
  require("../../assets/images/get-started/red-coat.png"),
  require("../../assets/images/get-started/chair.png"),
  require("../../assets/images/get-started/avocado.png"),
  require("../../assets/images/get-started/sunglasses.png"),
  require("../../assets/images/get-started/rings.png"),
  require("../../assets/images/get-started/dress.png"),
  require("../../assets/images/get-started/necklace.png"),
  require("../../assets/images/get-started/watch.png"),
  require("../../assets/images/get-started/makeup.png"),
  require("../../assets/images/get-started/orange-couch.png"),
  require("../../assets/images/get-started/food-plate.png"),
  require("../../assets/images/get-started/white-chair.png"),
  require("../../assets/images/get-started/green-room.png"),
  require("../../assets/images/get-started/bracelet.png"),
  require("../../assets/images/get-started/footware.png"),
  require("../../assets/images/get-started/white-table.png"),
];

const slides: Slide[] = [
  {
    title: "Welcome to Reistta!",
    subtitle1: "Easily connect your store to customers",
    subtitle2: "and boost sales.",
    buttonText: "Get Started",
    redirectTo: "/signin",
  },
  {
    title: "Promote Your Offers!",
    subtitle1: "Showcase exclusive deals and discounts",
    subtitle2: "to attract more customers.",
    buttonText: "Login In",
    redirectTo: "/signin",
  },
  {
    title: "Manage with Ease",
    subtitle1: "Update offers and deals on the go,",
    subtitle2: "anytime, anywhere.",
    buttonText: "Sign Up",
    redirectTo: "/signup",
  },
];

function shuffleArray(array: ImageSource[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const PageIndicator: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.dot, active ? styles.activeDot : styles.inactiveDot]} />
);

const GetStarted: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const shuffledArrays = useMemo(
    () => [
      [shuffleArray([...allImages]), shuffleArray([...allImages])],
      [shuffleArray([...allImages]), shuffleArray([...allImages])],
      [shuffleArray([...allImages]), shuffleArray([...allImages])],
    ],
    []
  );

  const carouselData = slides.map((_, pageIndex) => (
    <View style={styles.marqueesContainer} key={pageIndex}>
      <View style={styles.marqueeWrapper}>
        <MarqueeColumn
          direction="down"
          offset={pageIndex * 500}
          images={shuffledArrays[pageIndex][0]}
          key={`down-${pageIndex}`}
        />
      </View>
      <View style={styles.marqueeWrapper}>
        <MarqueeColumn
          direction="up"
          offset={pageIndex * 500 + 250}
          images={shuffledArrays[pageIndex][1]}
          key={`up-${pageIndex}`}
        />
      </View>
    </View>
  ));

  // Ensure activeIndex stays within bounds
  const safeActiveIndex = Math.max(0, Math.min(activeIndex, slides.length - 1));
  const currentSlide = slides[safeActiveIndex];
  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Carousel
          ref={carouselRef}
          width={width}
          height={TOP_CONTAINER_HEIGHT}
          data={carouselData}
          onProgressChange={(_, absoluteProgress) => {
            const newIndex = Math.round(absoluteProgress) % slides.length;
            setActiveIndex(newIndex);
          }}
          loop
          snapEnabled
          pagingEnabled
          windowSize={3}
          renderItem={({ item }) => item}
        />

        <LinearGradient
          colors={["transparent", "rgba(255,255,255,1.0)"]}
          style={styles.gradient}
          pointerEvents="none"
        />
        <View style={styles.bottomPart}>
          <View style={styles.paginationContainer}>
            {[0, 1, 2].map((index) => (
              <PageIndicator key={index} active={index === safeActiveIndex} />
            ))}
          </View>
          <View style={styles.textContentContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle1}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle2}</Text>
            <Button
              style={styles.button}
              onPress={() => navigate(currentSlide.redirectTo)}
            >
              {currentSlide.buttonText}
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marqueesContainer: {
    height: TOP_CONTAINER_HEIGHT,
    flexDirection: "row",
    width: width,
  },
  marqueeWrapper: {
    width: MARQUEE_WIDTH,
    height: TOP_CONTAINER_HEIGHT,
    overflow: "hidden",
  },
  paginationContainer: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: "26.5%",
    height: 100,
    width: "110%",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 38,
  },
  inactiveDot: {
    backgroundColor: "#D9D9D9",
  },
  textContentContainer: {
    alignItems: "center",
  },
  bottomPart: {
    height: BOTTOM_CONTAINER_HEIGHT
  },
  title: {
    fontWeight: "600",
    paddingBottom: 4,
  },
  subtitle: {
    fontWeight: "400",
  },
  button: {
    marginTop: 24,
    height: 48,
    width: 246,
  },
});

export default GetStarted;

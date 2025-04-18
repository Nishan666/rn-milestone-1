import MarqueeColumn from '../components/MarqueeColumn';
import React, { useState, useMemo, useRef } from 'react';
import { View, Dimensions, StyleSheet, ImageRequireSource, Text, StatusBar } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGetstartedViewModel } from '../viewModels/useGetstartedViewModel';
const { width, height } = Dimensions.get('screen');
const TOP_CONTAINER_HEIGHT = height * 0.715;
const BOTTOM_CONTAINER_HEIGHT = height * 0.285;

const MARQUEE_WIDTH = width * 0.5;

const PageIndicator: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.dot, active ? styles.activeDot : styles.inactiveDot]} />
);

const GetStarted: React.FC = () => {
  const { slides, shuffledArrays, activeIndex, carouselRef, setActiveIndex, navigation } = useGetstartedViewModel();

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
          colors={['transparent', 'rgba(255,255,255,1.0)']}
          style={styles.gradient}
          pointerEvents="none"
        />
        <View style={styles.bottomPart}>
          <View style={styles.paginationContainer}>
            {[0, 1, 2].map(index => (
              <PageIndicator key={index} active={index === safeActiveIndex} />
            ))}
          </View>
          <View style={styles.textContentContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle1}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle2}</Text>
            <Button
              style={styles.button}
              onPress={() => navigation.navigate(currentSlide.redirectTo)}>
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
    flexDirection: 'row',
    width: width,
  },
  marqueeWrapper: {
    width: MARQUEE_WIDTH,
    height: TOP_CONTAINER_HEIGHT,
    overflow: 'hidden',
  },
  paginationContainer: {
    marginTop: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: '26.5%',
    height: 100,
    width: '110%',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 38,
    backgroundColor: '#D9D9D9',

  },
  inactiveDot: {
    backgroundColor: '#D9D9D9',
  },
  textContentContainer: {
    marginTop: 18,
    width: '100%',
    alignItems: 'center',
  },
  bottomPart: {
    height: BOTTOM_CONTAINER_HEIGHT,
  },
  title: {
    fontWeight: '600',
    paddingBottom: 4,
  },
  subtitle: {
    fontWeight: '400',
  },
  button: {
    marginTop: 24,
    height: 48,
    width: 246,
  },
});

export default GetStarted;

import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import { ImageSource, NavigationProps, Slide } from "../models/types";

const allImages: ImageSource[] = [
    require('../assets/images/get-started/clothes-rack.png'),
    require('../assets/images/get-started/popcorn-bowl.png'),
    require('../assets/images/get-started/shoes.png'),
    require('../assets/images/get-started/red-coat.png'),
    require('../assets/images/get-started/chair.png'),
    require('../assets/images/get-started/avocado.png'),
    require('../assets/images/get-started/sunglasses.png'),
    require('../assets/images/get-started/rings.png'),
    require('../assets/images/get-started/dress.png'),
    require('../assets/images/get-started/necklace.png'),
    require('../assets/images/get-started/watch.png'),
    require('../assets/images/get-started/makeup.png'),
    require('../assets/images/get-started/orange-couch.png'),
    require('../assets/images/get-started/food-plate.png'),
    require('../assets/images/get-started/white-chair.png'),
    require('../assets/images/get-started/green-room.png'),
    require('../assets/images/get-started/bracelet.png'),
    require('../assets/images/get-started/footware.png'),
    require('../assets/images/get-started/white-table.png'),
];

const slides: Slide[] = [
    {
        title: 'Welcome to ChatApp',
        subtitle1: 'Connect instantly with friends,',
        subtitle2: 'family, and colleagues.',
        buttonText: 'Get Started',
        redirectTo: 'Login',
    },
    {
        title: 'Secure Messaging',
        subtitle1: 'Your conversations are encrypted,',
        subtitle2: 'ensuring privacy and security.',
        buttonText: 'Login',
        redirectTo: 'Signup',
    },
    {
        title: 'Stay Connected',
        subtitle1: 'Send messages, photos, and videos',
        subtitle2: 'with lightning speed.',
        buttonText: 'Sign Up',
        redirectTo: 'Signup',
    },
];


function shuffleArray(array: ImageSource[]) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

export const useGetstartedViewModel = () => {
    const navigation = useNavigation<NavigationProps>();
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);

    const shuffledArrays = useMemo(
        () => [
            [shuffleArray([...allImages]), shuffleArray([...allImages])],
            [shuffleArray([...allImages]), shuffleArray([...allImages])],
            [shuffleArray([...allImages]), shuffleArray([...allImages])],
        ],
        [],
    );


    return {
        shuffledArrays,
        navigation,
        carouselRef,
        activeIndex,
        setActiveIndex,
        slides,
        allImages
    };
};

import { useEffect, useState } from 'react';
import { loadAssets, loadFonts } from '../utils/fontLoader';
import { AppDispatch } from '../store';
import { useDispatch } from 'react-redux';
import { loadRoom } from '../store/slices/roomSlice';
import { loadProfile } from '../store/slices/profileSlice';

export const useMainModel = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Load custom fonts and assets
  useEffect(() => {
    async function loadResources() {
      try {
        await loadFonts();
        setFontsLoaded(true);

        await loadAssets();
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Error loading resources:', error);
      }
    }
    loadResources();
  }, []);

  useEffect(() => {
    dispatch(loadProfile());
    dispatch(loadRoom());
  }, [dispatch]);

  return {
    fontsLoaded,
    splashFinished,
    assetsLoaded,
    setSplashFinished,
  };
};

import { useEffect, useState } from 'react';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';
import { SplashViewModelProps } from '../models/types';

export const useSplashViewModel = ({ setSplashFinished }: SplashViewModelProps) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { appName } = getEnvironment();
  const { splash } = getEnvironmentAssets();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 0.1;
        if (newProgress >= 1) {
          clearInterval(interval);
          // Add a small delay before finishing
          setTimeout(() => {
            setSplashFinished(true);
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return {
    loadingProgress,
    appName,
    splash,
  };
};

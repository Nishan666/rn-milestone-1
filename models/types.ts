export interface ProfileData {
  nickname: string;
  email: string;
}

export interface RoomData {
  roomId: string;
  roomName: string;
}

export interface EnvironmentConfig {
  appName?: string;
  apiUrl?: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isPreProduction: boolean;
}

export interface EnvironmentAssets {
  icon: any;
  splash: any;
}

export interface Message {
  id?: string;
  text: string;
  localCreatedAt: string;
  createdAt: Date;
  userId: string;
  userName: string;
  roomId: string;
}

export interface RoomState {
  data: RoomData | null;
  loading: boolean;
  error: string | null;
}

export interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

export interface MessageItemProps {
  text: string;
  sender: 'user' | 'system';
  timestamp: number;
}

export interface SplashScreenProps {
  setSplashFinished: (finished: boolean) => void;
}

import { StackNavigationProp } from "@react-navigation/stack";
import { ImageRequireSource } from "react-native";

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

export interface SplashViewModelProps {
  setSplashFinished: (finished: boolean) => void;
}

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
  headerColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}


export interface Slide {
  title: string;
  subtitle1: string;
  subtitle2: string;
  buttonText: string;
  redirectTo: keyof RootStackParamList;
}

export type ImageSource = ImageRequireSource;

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;
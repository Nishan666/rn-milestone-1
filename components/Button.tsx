import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode | string;
}

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "",
  style,
  textStyle,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      disabled={loading || disabled}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          color={variant === "outline" ? '#FF6F00' : "#fff"}
          style={styles.spinner}
        />
      )}
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {loading && loadingText ? loadingText : children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  spinner: {
    marginRight: 8,
  },
  // Variants
  primary: {
    backgroundColor: '#FF6F00',
  },
  secondary: {
    backgroundColor: '#E2E8F0',
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: '#FF6F00',
  },
  // Sizes
  sm: {
    height: 36,
    paddingHorizontal: 16,
  },
  md: {
    height: 48,
    paddingHorizontal: 24,
  },
  lg: {
    height: 56,
    paddingHorizontal: 32,
  },
  // Text styles
  text: {
    fontWeight: "400",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#1F2937",
  },
  outlineText: {
    color: '#FF6F00',
  },
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#9CA3AF",
  },
});

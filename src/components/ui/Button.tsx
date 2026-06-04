import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { buttonStyles } from '../../styles/appStyle';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled || loading) return '#A8B8AF';
    switch (variant) {
      case 'primary': return '#103B2D';
      case 'secondary': return '#E8F0EB';
      case 'danger': return '#C4493A';
      default: return '#103B2D';
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') return '#355447';
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[buttonStyles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text style={[buttonStyles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};




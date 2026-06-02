import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { cardStyles } from "../../styles/appStyle";

interface CardProps {
  id?: string;
  title: string;
  body: string;
  onPress: () => void;
}

export const Card = ({ id, title, body, onPress }: CardProps) => {
  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={cardStyles.header}>
        <View style={cardStyles.badge}>
          <Text style={cardStyles.badgeText}>{id ?? "#"}</Text>
        </View>

        <Text style={cardStyles.userId}>EcoScan IA</Text>
      </View>

      <Text style={cardStyles.title} numberOfLines={2}>
        🌱 {title}
      </Text>

      <Text style={cardStyles.body} numberOfLines={3}>
        {body}
      </Text>
    </TouchableOpacity>
  );
};
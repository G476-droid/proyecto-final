import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { cardStyles } from "../../styles/appStyle";

interface CardProps {
  id?: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  temperature?: string | null;
  weather?: string | null;
  onPress: () => void;
}

export const Card = ({
  id,
  title,
  body,
  imageUrl,
  temperature,
  weather,
  onPress,
}: CardProps) => {
  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri:
            imageUrl ||
            "https://via.placeholder.com/150x150.png?text=EcoScanIA",
        }}
        style={cardStyles.image}
        resizeMode="cover"
      />

      <View style={cardStyles.content}>
        <View style={cardStyles.topRow}>
          <View style={cardStyles.badge}>
            <Text style={cardStyles.badgeText}>
              {id ? id.slice(0, 4) : "#"}
            </Text>
          </View>
          <Text style={cardStyles.userId}>EcoScan IA</Text>
        </View>

        <Text style={cardStyles.title} numberOfLines={2}>
          🌱 {title}
        </Text>

        <Text style={cardStyles.body} numberOfLines={3}>
          {body}
        </Text>

        <View style={cardStyles.footer}>
          <Text style={cardStyles.footerText}>
            {temperature ? `🌡 ${temperature}` : "🌡 --"}
          </Text>
          <Text style={cardStyles.footerText}>
            {weather ? `☁ ${weather}` : "☁ --"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
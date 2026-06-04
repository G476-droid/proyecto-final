import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { cardStyles } from "../../styles/appStyle";

interface CardProps {
  id?: string;
  title: string;
  body: string;
  imageUrl?: string | null;
  temperature?: string | null;
  weather?: string | null;
  country?: string | null;
  province?: string | null;
  city?: string | null;
  onPress: () => void;
  onMap?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const Card = ({
  title,
  body,
  imageUrl,
  temperature,
  weather,
  country,
  province,
  city,
  onPress,
  onMap,
  onEdit,
  onDelete,
}: CardProps) => {
  const location = province
    ? `${province}${city ? `, ${city}` : ""}`
    : country
    ? country
    : "Ubicacion no registrada";

  return (
    <Pressable style={cardStyles.card} onPress={onPress}>
      <View style={cardStyles.imageBox}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={cardStyles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={cardStyles.placeholderBox}>
            <Text style={cardStyles.placeholderIcon}>🌿</Text>
          </View>
        )}
      </View>

      <View style={cardStyles.content}>
        <View>
          <View style={cardStyles.topMetaRow}>
            <Text style={cardStyles.badge}>Registro</Text>
            <Text style={cardStyles.climate}>
              {weather ?? "Sin clima"}
            </Text>
          </View>

          <Text style={cardStyles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={cardStyles.scientific} numberOfLines={1}>
            {temperature ? `${temperature} °C` : "Temperatura no registrada"}
          </Text>

          <Text style={cardStyles.body} numberOfLines={2}>
            {body}
          </Text>

          <Text style={cardStyles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={cardStyles.bottomRow}>
          <View style={cardStyles.actionsBottom}>
            <Pressable
              style={cardStyles.mapMiniBtn}
              onPress={(e: any) => {
                e.stopPropagation?.();
                onMap?.();
              }}
            >
              <Text style={cardStyles.mapMiniText}>Ver mapa</Text>
            </Pressable>
          </View>

          <Text style={cardStyles.meta} numberOfLines={1}>
            {weather ?? "Sin clima"} · {temperature ?? "--"}
          </Text>
        </View>
      </View>

      <View style={cardStyles.actionsRight}>
        <Pressable
          style={cardStyles.iconBtn}
          hitSlop={12}
          onPress={(e: any) => {
            e.stopPropagation?.();
            onEdit?.();
          }}
        >
          <Text style={cardStyles.editIcon}>✏️</Text>
        </Pressable>

        <Pressable
          style={cardStyles.iconBtn}
          hitSlop={12}
          onPress={(e: any) => {
            e.stopPropagation?.();
            onDelete?.();
          }}
        >
          <Text style={cardStyles.deleteIcon}>🗑️</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

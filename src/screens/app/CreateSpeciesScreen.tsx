import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { AppStackParamList } from "../../navigation/typeNavigation";
import {
  analyzeImageWithAI,
  saveSpeciesToDatabase,
} from "../../services/speciesService";

type Props = StackScreenProps<AppStackParamList, "CreateSpecies">;

const CreateSpeciesScreen = ({ navigation }: Props) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState(
    "Primero captura o selecciona una imagen.",
  );

  const getCurrentLocationData = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      return {
        latitude: null,
        longitude: null,
        country: null,
        province: null,
        city: null,
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    if (longitude > 180) longitude = longitude - 360;
    if (longitude < -180) longitude = longitude + 360;

    let country: string | null = null;
    let province: string | null = null;
    let city: string | null = null;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      );

      const data = await response.json();
      const address = data.address || {};

      country = address.country ?? null;

      province =
        address.state ??
        address.province ??
        address.region ??
        address.county ??
        null;

      city =
        address.city ??
        address.town ??
        address.village ??
        address.municipality ??
        address.suburb ??
        null;
    } catch (error) {
      console.log("No se pudo obtener país/provincia:", error);
    }

    return {
      latitude,
      longitude,
      country,
      province,
      city,
    };
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a tus imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStatusText("Imagen lista. Ahora presiona Guardar especie.");
    }
  };

  const processImage = async (uri: string) => {
    try {
      setLoading(true);

      setStatusText("Obteniendo ubicación...");
      const locationData = await getCurrentLocationData();

      setStatusText("Analizando planta con IA...");
      const result = await analyzeImageWithAI(uri);
      const ai = result.aiResult;

      setStatusText("Guardando especie en Supabase...");
      await saveSpeciesToDatabase({
        commonName: ai.commonName,
        scientificName: ai.scientificName,
        description: `${ai.description}\n\nCuidados: ${ai.care}\n\nConfianza IA: ${ai.confidence}`,
        imageUrl: result.imageUrl,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        country: locationData.country,
        province: locationData.province,
        city: locationData.city,
        weather: "Templado",
        temperature: "22°C",
      });

      Alert.alert(
  "Especie guardada",
  `Nombre: ${ai.commonName}\nProvincia: ${
    locationData.province ?? "No identificada"
  }`
);

navigation.goBack();

    } catch (error: any) {
      console.log("ERROR REGISTRANDO ESPECIE:", error);

      Alert.alert(
        "Error",
        error.message ??
          "No se pudo analizar o guardar la especie. Revisa la IA o Supabase.",
      );
    } finally {
      setLoading(false);
      setStatusText("Puedes capturar otra imagen.");
    }
  };

  const saveSpecies = async () => {
    if (!imageUri) {
      Alert.alert("Falta imagen", "Primero presiona Capturar imagen.");
      return;
    }

    await processImage(imageUri);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Text style={styles.title}>Escanear planta</Text>
      </View>

      <View style={styles.scanCard}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.plantArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              <View style={styles.circleGlow}>
                <Text style={styles.plantIcon}>🌿</Text>
              </View>
            </View>
          </View>
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingOverlayText}>{statusText}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.captureButton}
        onPress={openGallery}
        disabled={loading}
      >
        <Text style={styles.captureButtonText}>📷 Capturar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.saveButton,
          (!imageUri || loading) && styles.saveButtonDisabled,
        ]}
        onPress={saveSpecies}
        disabled={!imageUri || loading}
      >
        <Text style={styles.saveButtonText}>Guardar especie</Text>
      </TouchableOpacity>

      <View style={styles.statusBox}>
        {loading ? (
          <>
            <ActivityIndicator size="small" color="#0F5D2F" />
            <Text style={styles.statusText}>{statusText}</Text>
          </>
        ) : (
          <>
            <Text style={styles.statusIcon}>📸</Text>
            <Text style={styles.statusText}>{statusText}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default CreateSpeciesScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EEF7EA",
    padding: 24,
    alignItems: "center",
  },

  hero: {
    width: "100%",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F3D24",
    marginTop: 10,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    maxWidth: 520,
    lineHeight: 20,
  },

  scanCard: {
    width: Platform.OS === "web" ? 360 : "92%",
    height: 280,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#123D25",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    position: "relative",
  },

  plantArea: {
    flex: 1,
    backgroundColor: "#143D25",
    justifyContent: "center",
    alignItems: "center",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  scanFrame: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  circleGlow: {
    width: 125,
    height: 125,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },

  plantIcon: {
    fontSize: 70,
  },

  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: "#FFFFFF",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 6,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 6,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 6,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 6,
  },

  captureButton: {
    width: Platform.OS === "web" ? 360 : "92%",
    backgroundColor: "#0F5D2F",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 18,
  },

  captureButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  saveButton: {
    width: Platform.OS === "web" ? 360 : "92%",
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  saveButtonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 61, 36, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingOverlayText: {
    marginTop: 14,
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },

  statusBox: {
    marginTop: 16,
    width: Platform.OS === "web" ? 360 : "92%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  statusIcon: {
    fontSize: 26,
    marginBottom: 4,
  },

  statusText: {
    color: "#0F3D24",
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
  },

  note: {
    marginTop: 14,
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 460,
  },
});

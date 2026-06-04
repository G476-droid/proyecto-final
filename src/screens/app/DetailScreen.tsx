import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../navigation/typeNavigation";
import { supabase } from "../../services/supabase";

type DetailScreenNavigationProp = StackScreenProps<AppStackParamList, "Detail">;

export const DetailScreen = ({
  navigation,
  route,
}: DetailScreenNavigationProp) => {
  const { species } = route.params;

  const [commonName, setCommonName] = useState(species.common_name ?? "");
  const [scientificName, setScientificName] = useState(
    species.scientific_name ?? "",
  );
  const [description, setDescription] = useState(species.description ?? "");
  const [weather, setWeather] = useState(species.weather ?? "");
  const [temperature, setTemperature] = useState(species.temperature ?? "");
  const [country, setCountry] = useState(species.country ?? "");
  const [province, setProvince] = useState(species.province ?? "");
  const [city, setCity] = useState(species.city ?? "");

  const [saving, setSaving] = useState(false);

  const latitude = species.latitude;
  const longitude = species.longitude;

  const hasLocation = latitude !== null && longitude !== null;

  const mapUrl = hasLocation
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
    : "";

  const saveChanges = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("species")
        .update({
          common_name: commonName.trim(),
          scientific_name: scientificName.trim(),
          description: description.trim(),
          weather: weather.trim(),
          temperature: temperature.trim(),
          country: country.trim(),
          province: province.trim(),
          city: city.trim(),
        })
        .eq("id", species.id);

      if (error) throw error;

      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ?? "No se pudo actualizar la especie.",
      );
    } finally {
      setSaving(false);
    }
  };

  const renderGoogleMap = () => {
    if (!hasLocation) {
      return (
        <View style={styles.noMapBox}>
          <Text style={styles.noMapText}>
            Esta especie no tiene ubicación registrada.
          </Text>
        </View>
      );
    }

    if (Platform.OS === "web") {
      return React.createElement("iframe" as any, {
        title: "Google Maps",
        src: mapUrl,
        style: {
          width: "100%",
          height: 280,
          border: "0",
          borderRadius: 16,
        },
        loading: "lazy",
      });
    }

    return (
      <View style={styles.mobileMapBox}>
        <Text style={styles.mobileMapText}>📍 Latitud: {latitude}</Text>
        <Text style={styles.mobileMapText}>📍 Longitud: {longitude}</Text>
        <Text style={styles.mobileMapNote}>
          En móvil puedes abrir el mapa desde el botón Mapa del listado.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle de especie</Text>

      <View style={styles.imageContainer}>
        {species.image_url ? (
          <Image source={{ uri: species.image_url }} style={styles.image} />
        ) : (
          <View style={styles.noImageBox}>
            <Text style={styles.noImageText}>Sin imagen</Text>
          </View>
        )}
      </View>

      <Text style={styles.imageNote}>Imagen solo visual, no editable.</Text>

      <View style={styles.formBox}>
        <Text style={styles.label}>Nombre común</Text>
        <TextInput
          style={styles.input}
          value={commonName}
          onChangeText={setCommonName}
          placeholder="Nombre común"
        />

        <Text style={styles.label}>Nombre científico</Text>
        <TextInput
          style={styles.input}
          value={scientificName}
          onChangeText={setScientificName}
          placeholder="Nombre científico"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          multiline
        />

        <Text style={styles.label}>Clima</Text>
        <TextInput
          style={styles.input}
          value={weather}
          onChangeText={setWeather}
          placeholder="Clima"
        />

        <Text style={styles.label}>Temperatura</Text>
        <TextInput
          style={styles.input}
          value={temperature}
          onChangeText={setTemperature}
          placeholder="Temperatura"
        />

        <Text style={styles.label}>País</Text>
        <TextInput
          style={styles.input}
          value={country}
          onChangeText={setCountry}
          placeholder="País"
        />

        <Text style={styles.label}>Provincia</Text>
        <TextInput
          style={styles.input}
          value={province}
          onChangeText={setProvince}
          placeholder="Provincia"
        />

        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Ciudad"
        />
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Ubicación en Google Maps</Text>

        <Text style={styles.locationText}>
          📍 {province || "Provincia no registrada"}
          {city ? `, ${city}` : ""}
        </Text>

        {renderGoogleMap()}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveChanges}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EEF7EA",
    padding: 22,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F3D24",
    marginBottom: 18,
  },

  imageContainer: {
    width: Platform.OS === "web" ? 560 : "100%",
    height: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImageBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
  },

  noImageText: {
    color: "#0F3D24",
    fontWeight: "900",
  },

  imageNote: {
    marginTop: 8,
    marginBottom: 16,
    color: "#6B7280",
    fontSize: 13,
  },

  formBox: {
    width: Platform.OS === "web" ? 660 : "100%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  label: {
    fontWeight: "900",
    color: "#0F3D24",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    color: "#111827",
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: "top",
  },

  mapContainer: {
    width: Platform.OS === "web" ? 660 : "100%",
    backgroundColor: "#FFFFFF",
    marginTop: 18,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  mapTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F3D24",
    marginBottom: 8,
  },

  locationText: {
    color: "#14532D",
    fontWeight: "800",
    marginBottom: 12,
  },

  noMapBox: {
    backgroundColor: "#F3F4F6",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  noMapText: {
    color: "#6B7280",
    fontWeight: "700",
  },

  mobileMapBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 18,
  },

  mobileMapText: {
    color: "#0F3D24",
    fontWeight: "800",
    marginBottom: 6,
  },

  mobileMapNote: {
    color: "#4B5563",
    marginTop: 8,
    fontSize: 13,
  },

  saveButton: {
    width: Platform.OS === "web" ? 660 : "100%",
    backgroundColor: "#0F5D2F",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
});

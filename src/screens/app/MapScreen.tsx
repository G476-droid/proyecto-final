import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMySpecies, Species } from "../../services/speciesService";

let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== "web") {
  const Maps = require("react-native-maps");
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const MapScreen = () => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSpecies = async () => {
    try {
      const data = await getMySpecies();

      const withLocation = data.filter(
        (item) => item.latitude !== null && item.longitude !== null
      );

      setSpecies(withLocation);
    } catch (error) {
      console.log("Error cargando especies para mapa:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadSpecies();
    }, [])
  );

  const openGoogleMaps = (item: Species) => {
    if (item.latitude === null || item.longitude === null) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (species.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No hay ubicaciones registradas</Text>
        <Text style={styles.emptyText}>
          Primero registra una especie y presiona “Obtener ubicación” antes de
          guardarla.
        </Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <ScrollView contentContainerStyle={styles.webContainer}>
        <Text style={styles.title}>Mapa de especies</Text>
        <Text style={styles.subtitle}>
          En web se muestran las ubicaciones guardadas. Presiona una tarjeta
          para abrir el punto real en Google Maps.
        </Text>

        {species.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.locationCard}
            onPress={() => openGoogleMaps(item)}
          >
            <Text style={styles.name}>📍 {item.common_name ?? "Sin nombre"}</Text>

            <Text style={styles.description} numberOfLines={2}>
              {item.description ?? "Sin descripción"}
            </Text>

            <Text style={styles.coords}>
              Latitud: {item.latitude}
            </Text>

            <Text style={styles.coords}>
              Longitud: {item.longitude}
            </Text>

            <Text style={styles.openText}>Abrir en Google Maps →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  const firstLocation = species[0];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: firstLocation.latitude ?? -0.180653,
          longitude: firstLocation.longitude ?? -78.467834,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {species.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude!,
              longitude: item.longitude!,
            }}
            title={item.common_name ?? "Sin nombre"}
            description={item.description ?? "Especie registrada"}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    backgroundColor: "#F1F8E9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    color: "#2E7D32",
    fontWeight: "700",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
    textAlign: "center",
  },
  emptyText: {
    marginTop: 8,
    color: "#4B5563",
    textAlign: "center",
  },
  webContainer: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F1F8E9",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 6,
  },
  subtitle: {
    color: "#4B5563",
    marginBottom: 18,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  description: {
    color: "#4B5563",
    marginBottom: 8,
  },
  coords: {
    color: "#374151",
    fontWeight: "600",
    marginBottom: 3,
  },
  openText: {
    marginTop: 8,
    color: "#2563EB",
    fontWeight: "800",
  },
});
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
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
      setSpecies(data);
    } catch (error) {
      console.log("Error cargando mapa:", error);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#2E7D32" size="large" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    return (
      <ScrollView contentContainerStyle={styles.webContainer}>
        <Text style={styles.title}>Mapa de especies</Text>
        <Text style={styles.text}>
          En web se muestra la ubicación como listado. En Android se muestra el mapa real.
        </Text>

        {species.length === 0 ? (
          <Text>No hay especies registradas.</Text>
        ) : (
          species.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>📍 {item.common_name ?? "Sin nombre"}</Text>
              <Text>{item.description ?? "Sin descripción"}</Text>
              <Text>
                Latitud: {item.latitude ?? "No registrada"} | Longitud:{" "}
                {item.longitude ?? "No registrada"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    );
  }

  const speciesWithLocation = species.filter(
    (item) => item.latitude !== null && item.longitude !== null
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: speciesWithLocation[0]?.latitude ?? -0.180653,
          longitude: speciesWithLocation[0]?.longitude ?? -78.467834,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {speciesWithLocation.map((item) => (
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
  },
  webContainer: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F1F8E9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  text: {
    color: "#4B5563",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
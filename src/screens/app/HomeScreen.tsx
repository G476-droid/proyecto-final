import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";

import { AppStackParamList } from "../../navigation/typeNavigation";
import { homeStyles } from "../../styles/appStyle";
import { Card } from "../../components/ui/Card";
import { getMySpecies, Species } from "../../services/speciesService";
import { supabase } from "../../services/supabase";

type HomeScreenNavigationProp = StackScreenProps<AppStackParamList, "Home">;

export const HomeScreen = ({ navigation }: HomeScreenNavigationProp) => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSpecies = async () => {
    try {
      const data = await getMySpecies();
      setSpecies(data);
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "No se pudieron cargar especies.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadSpecies();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSpecies();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View>
          <Text style={homeStyles.greeting}>¡Hola!</Text>
          <Text style={homeStyles.email} numberOfLines={1}>
            Bienvenido a EcoScan IA
          </Text>
        </View>

        <TouchableOpacity style={homeStyles.logoutBtn} onPress={handleLogout}>
          <Text style={homeStyles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={homeStyles.sectionTitle}>Especies registradas</Text>

      {loading ? (
        <View style={{ padding: 30 }}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Cargando especies...
          </Text>
        </View>
      ) : (
        <FlatList
          data={species}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                No hay especies registradas
              </Text>
              <Text style={{ marginTop: 6, color: "#6B7280", textAlign: "center" }}>
                Presiona “Capturar especie” para guardar tu primera planta en Supabase.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Detail", {
                  id: item.id,
                  title: item.common_name ?? "Sin nombre",
                  description: item.description ?? "",
                  name: item.common_name ?? "Sin nombre",
                })
              }
            >
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={{
                    width: "100%",
                    height: 180,
                    borderRadius: 14,
                    marginBottom: 8,
                  }}
                />
              )}

              <Card
                id={item.id.substring(0, 4)}
                title={item.common_name ?? "Sin nombre"}
                body={
                  item.description ??
                  item.scientific_name ??
                  "Sin descripción registrada."
                }
                onPress={() =>
                  navigation.navigate("Detail", {
                    id: item.id,
                    title: item.common_name ?? "Sin nombre",
                    description: item.description ?? "",
                    name: item.common_name ?? "Sin nombre",
                  })
                }
              />

              <Text style={{ marginLeft: 8, marginBottom: 4, color: "#4B5563" }}>
                🌡 {item.temperature ?? "Sin temperatura"} | 🌤{" "}
                {item.weather ?? "Sin clima"}
              </Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={homeStyles.list}
        />
      )}

      <TouchableOpacity
        style={homeStyles.logoutBtn}
        onPress={() => navigation.navigate("CreateSpecies")}
      >
        <Text style={homeStyles.logoutText}>📷 Capturar especie</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={homeStyles.logoutBtn}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={homeStyles.logoutText}>🗺 Ver mapa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={homeStyles.logoutBtn}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={homeStyles.logoutText}>👤 Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};
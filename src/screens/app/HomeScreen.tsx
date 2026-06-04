import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Linking,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";

import { AppStackParamList } from "../../navigation/typeNavigation";
import { Card } from "../../components/ui/Card";
import {
  getMySpecies,
  Species,
  deleteSpecies,
} from "../../services/speciesService";
import { supabase } from "../../services/supabase";

type HomeScreenNavigationProp = StackScreenProps<AppStackParamList, "Home">;

export const HomeScreen = ({ navigation }: HomeScreenNavigationProp) => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
const [speciesToDelete, setSpeciesToDelete] = useState<Species | null>(null);
const [deleting, setDeleting] = useState(false);
  const PAGE_SIZE = 5;

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
    }, []),
  );

  const filteredSpecies = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) return species;

    return species.filter((item) => {
      const commonName = item.common_name?.toLowerCase() ?? "";
      const scientificName = item.scientific_name?.toLowerCase() ?? "";
      const country = item.country?.toLowerCase() ?? "";
      const province = item.province?.toLowerCase() ?? "";
      const city = item.city?.toLowerCase() ?? "";

      return (
        commonName.includes(text) ||
        scientificName.includes(text) ||
        country.includes(text) ||
        province.includes(text) ||
        city.includes(text)
      );
    });
  }, [species, search]);

  const totalPages = Math.max(1, Math.ceil(filteredSpecies.length / PAGE_SIZE));

  const paginatedSpecies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredSpecies.slice(start, end);
  }, [filteredSpecies, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSpecies();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const goToDetail = (item: Species) => {
    navigation.navigate("Detail", {
      species: item,
    });
  };

  const openMap = (item: Species) => {
    if (item.latitude === null || item.longitude === null) {
      Alert.alert(
        "Sin ubicación",
        "Esta especie no tiene latitud y longitud guardadas.",
      );
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
    Linking.openURL(url);
  };

  const handleDelete = (item: Species) => {
  setSpeciesToDelete(item);
  setDeleteModalVisible(true);
};

const cancelDelete = () => {
  setSpeciesToDelete(null);
  setDeleteModalVisible(false);
};

const confirmDelete = async () => {
  if (!speciesToDelete) return;

  try {
    setDeleting(true);

    await deleteSpecies(speciesToDelete.id);
    await loadSpecies();

    setDeleteModalVisible(false);
    setSpeciesToDelete(null);

    Alert.alert("Eliminado", "La especie fue eliminada correctamente.");
  } catch (error: any) {
    Alert.alert(
      "Error",
      error.message ?? "No se pudo eliminar la especie."
    );
  } finally {
    setDeleting(false);
  }
};

  const handleEdit = (item: Species) => {
    goToDetail(item);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola!</Text>
          <Text style={styles.email}>Bienvenido a EcoScan IA</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileText}>👤 Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Especies registradas</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por especie, país, provincia o ciudad..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        {search.trim() !== "" && (
          <Text style={styles.resultText}>
            Resultados encontrados: {filteredSpecies.length}
          </Text>
        )}
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Cargando especies...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={true}
            >
              {filteredSpecies.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyTitle}>
                    {search.trim()
                      ? "No se encontraron resultados"
                      : "No hay especies registradas"}
                  </Text>

                  <Text style={styles.emptyText}>
                    {search.trim()
                      ? "Intenta buscar por otro nombre, país, provincia o ciudad."
                      : "Presiona el botón + para registrar una nueva especie."}
                  </Text>
                </View>
              ) : (
                paginatedSpecies.map((item) => (
                  <Card
                    id={item.id}
                    title={item.common_name ?? "Sin nombre"}
                    body={
                      item.description ??
                      item.scientific_name ??
                      "Sin descripción registrada."
                    }
                    imageUrl={item.image_url}
                    temperature={item.temperature}
                    weather={item.weather}
                    country={item.country}
                    province={item.province}
                    city={item.city}
                    onPress={() => goToDetail(item)}
                    onMap={() => openMap(item)}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ))
              )}
            </ScrollView>

            {filteredSpecies.length > 0 && (
              <View style={styles.paginationBar}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.pageButtonDisabled,
                  ]}
                  disabled={currentPage === 1}
                  onPress={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  <Text style={styles.pageButtonText}>← Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === totalPages && styles.pageButtonDisabled,
                  ]}
                  disabled={currentPage === totalPages}
                  onPress={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  <Text style={styles.pageButtonText}>Siguiente →</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      <Modal
  visible={deleteModalVisible}
  transparent
  animationType="fade"
  onRequestClose={cancelDelete}
>
  <View style={styles.modalOverlay}>
    <View style={styles.deleteModal}>
      <Text style={styles.modalIcon}>🗑️</Text>

      <Text style={styles.modalTitle}>Eliminar especie</Text>

      <Text style={styles.modalText}>
        ¿Seguro que deseas eliminar{" "}
        <Text style={styles.modalStrong}>
          {speciesToDelete?.common_name ?? "esta especie"}
        </Text>
        ?
      </Text>

      <Text style={styles.modalWarning}>
        Esta acción no se puede deshacer.
      </Text>

      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancelDelete}
          disabled={deleting}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={confirmDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("CreateSpecies")}
        activeOpacity={0.85}
      >
        <Text style={styles.floatingButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: Platform.OS === "web" ? ("100vh" as any) : "100%",
    backgroundColor: "#F5F7F5",
    position: "relative",
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
},

deleteModal: {
  width: Platform.OS === "web" ? 420 : "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 20,
},

modalIcon: {
  fontSize: 44,
  marginBottom: 10,
},

modalTitle: {
  fontSize: 22,
  fontWeight: "900",
  color: "#111827",
  marginBottom: 8,
},

modalText: {
  fontSize: 15,
  color: "#374151",
  textAlign: "center",
  lineHeight: 22,
},

modalStrong: {
  fontWeight: "900",
  color: "#0F5D2F",
},

modalWarning: {
  marginTop: 8,
  fontSize: 13,
  color: "#DC2626",
  fontWeight: "700",
},

modalActions: {
  flexDirection: "row",
  gap: 12,
  marginTop: 22,
  width: "100%",
},

cancelButton: {
  flex: 1,
  backgroundColor: "#F3F4F6",
  paddingVertical: 13,
  borderRadius: 14,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E5E7EB",
},

cancelButtonText: {
  color: "#374151",
  fontWeight: "900",
},

deleteButton: {
  flex: 1,
  backgroundColor: "#DC2626",
  paddingVertical: 13,
  borderRadius: 14,
  alignItems: "center",
},

deleteButtonText: {
  color: "#FFFFFF",
  fontWeight: "900",
},

  scrollArea: {
    flex: 1,
  },

  paginationBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageButton: {
    backgroundColor: "#0F5D2F",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  pageButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },

  pageButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  pageInfo: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 14,
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  email: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  headerActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  profileBtn: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  profileText: {
    color: "#047857",
    fontWeight: "700",
    fontSize: 13,
  },

  logoutBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },

  logoutText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },

  searchSection: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },

  resultText: {
    marginTop: 8,
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "600",
  },

  listContainer: {
    flex: 1,
    minHeight: 0,
  },

  flatList: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  loadingBox: {
    padding: 40,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#4B5563",
  },

  emptyBox: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 20,
  },

  emptyTitle: {
    fontWeight: "800",
    fontSize: 18,
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    color: "#6B7280",
    textAlign: "center",
  },

  floatingButton: {
    position: Platform.OS === "web" ? ("fixed" as any) : "absolute",
    right: 28,
    bottom: 28,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#0F5D2F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 20,
    zIndex: 999999,
  },

  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 54,
    fontWeight: "300",
  },
});

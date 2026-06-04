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
        "Sin ubicacion",
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
      Alert.alert("Error", error.message ?? "No se pudo eliminar la especie.");
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
        <View style={styles.headerMain}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>E</Text>
          </View>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Panel principal</Text>
            <Text style={styles.greeting}>EcoScan IA</Text>
            <Text style={styles.email}>
              Gestiona tus especies registradas desde una vista simple, clara y ordenada.
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchHeaderRow}>
          <View style={styles.searchTitleWrap}>
            <Text style={styles.sectionTitle}>Especies registradas</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredSpecies.length} resultado{filteredSpecies.length === 1 ? "" : "s"} disponibles
            </Text>
          </View>

          <View style={styles.summaryPill}>
            <Text style={styles.summaryPillText}>
              Pagina {currentPage}/{totalPages}
            </Text>
          </View>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por especie, pais, provincia o ciudad..."
          placeholderTextColor="#8AA092"
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
            <ActivityIndicator size="large" color="#1B6B52" />
            <Text style={styles.loadingText}>Cargando especies...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator
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
                      ? "Intenta buscar por otro nombre, pais, provincia o ciudad."
                      : "Presiona el boton + para registrar una nueva especie."}
                  </Text>
                </View>
              ) : (
                paginatedSpecies.map((item) => (
                  <Card
                    key={item.id}
                    id={item.id}
                    title={item.common_name ?? "Sin nombre"}
                    body={
                      item.description ??
                      item.scientific_name ??
                      "Sin descripcion registrada."
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
                  <Text style={styles.pageButtonText}>Anterior</Text>
                </TouchableOpacity>

                <Text style={styles.pageInfo}>
                  Pagina {currentPage} de {totalPages}
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
                  <Text style={styles.pageButtonText}>Siguiente</Text>
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
            <Text style={styles.modalIcon}>Eliminar</Text>
            <Text style={styles.modalTitle}>Eliminar especie</Text>

            <Text style={styles.modalText}>
              Seguro que deseas eliminar{" "}
              <Text style={styles.modalStrong}>
                {speciesToDelete?.common_name ?? "esta especie"}
              </Text>
              ?
            </Text>

            <Text style={styles.modalWarning}>
              Esta accion no se puede deshacer.
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
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: Platform.OS === "web" ? ("100vh" as any) : "100%",
    backgroundColor: "#F2F7F4",
    position: "relative",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#DCE8E1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
  },
  headerMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  brandMark: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#103B2D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#103B2D",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  brandMarkText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5E7B6E",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#19352B",
  },
  email: {
    fontSize: 14,
    color: "#6A7D73",
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 540,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  profileBtn: {
    backgroundColor: "#EDF8F1",
    borderWidth: 1,
    borderColor: "#CFE2D7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  profileText: {
    color: "#1E684D",
    fontWeight: "700",
    fontSize: 13,
  },
  logoutBtn: {
    backgroundColor: "#FFF3F1",
    borderWidth: 1,
    borderColor: "#F3CCC7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  logoutText: {
    color: "#C4493A",
    fontWeight: "700",
    fontSize: 13,
  },
  searchSection: {
    backgroundColor: "#F2F7F4",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 14,
  },
  searchHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  searchTitleWrap: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#19352B",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6A7D73",
    marginTop: 4,
  },
  summaryPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DCE8E1",
  },
  summaryPillText: {
    color: "#355447",
    fontSize: 12,
    fontWeight: "700",
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E5DD",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#19352B",
  },
  resultText: {
    marginTop: 10,
    color: "#5E7B6E",
    fontSize: 13,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    minHeight: 0,
  },
  scrollArea: {
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
    marginTop: 12,
    color: "#5E7B6E",
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DCE8E1",
  },
  emptyTitle: {
    fontWeight: "800",
    fontSize: 18,
    color: "#19352B",
  },
  emptyText: {
    marginTop: 8,
    color: "#6A7D73",
    textAlign: "center",
    lineHeight: 20,
  },
  paginationBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DCE8E1",
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageButton: {
    backgroundColor: "#1B6B52",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  pageButtonDisabled: {
    backgroundColor: "#B8D4C7",
  },
  pageButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  pageInfo: {
    color: "#19352B",
    fontWeight: "700",
    fontSize: 14,
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
    fontSize: 18,
    fontWeight: "800",
    color: "#C4493A",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#19352B",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: "#355447",
    textAlign: "center",
    lineHeight: 22,
  },
  modalStrong: {
    fontWeight: "900",
    color: "#103B2D",
  },
  modalWarning: {
    marginTop: 8,
    fontSize: 13,
    color: "#C4493A",
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
    backgroundColor: "#F4F7F5",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE8E1",
  },
  cancelButtonText: {
    color: "#355447",
    fontWeight: "900",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#C4493A",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  floatingButton: {
    position: Platform.OS === "web" ? ("fixed" as any) : "absolute",
    right: 28,
    bottom: 28,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#103B2D",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 20,
    zIndex: 999999,
  },
  floatingButtonText: {
    color: "#FFFFFF",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "400",
  },
});

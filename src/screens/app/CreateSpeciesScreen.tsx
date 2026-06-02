import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import {
  analyzeImageWithAI,
  saveSpeciesToDatabase,
} from "../../services/speciesService";

const CreateSpeciesScreen = () => {
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [description, setDescription] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

const analyzeSelectedImage = async (uri: string) => {
  try {
    setAnalyzing(true);

    console.log("Imagen seleccionada:", uri);
    console.log("Enviando imagen a IA...");

    const result = await analyzeImageWithAI(uri);

    console.log("RESULTADO IA:", result);

    setImageUrl(result.imageUrl);
    setCommonName(result.aiResult.commonName);
    setScientificName(result.aiResult.scientificName);
    setDescription(
      `${result.aiResult.description}\n\nCuidados: ${result.aiResult.care}\n\nConfianza IA: ${result.aiResult.confidence}`
    );

    Alert.alert(
      "IA completada",
      "La imagen fue analizada y los campos fueron llenados automáticamente."
    );
  } catch (error: any) {
    console.log("ERROR IA COMPLETO:", error);

    Alert.alert(
      "Error IA",
      error.message ?? JSON.stringify(error)
    );
  } finally {
    setAnalyzing(false);
  }
};

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir acceso a tus imágenes.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      setCommonName("");
      setScientificName("");
      setDescription("");
      setImageUrl(null);

      await analyzeSelectedImage(uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir el uso de la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      setCommonName("");
      setScientificName("");
      setDescription("");
      setImageUrl(null);

      await analyzeSelectedImage(uri);
    }
  };

  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Debes permitir el uso de ubicación.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    Alert.alert("Ubicación obtenida", "Latitud y longitud guardadas.");
  };

  const saveSpecies = async () => {
    if (!commonName.trim()) {
      Alert.alert("Falta IA", "Primero toma o selecciona una imagen para analizar.");
      return;
    }

    if (!imageUrl) {
      Alert.alert("Falta imagen", "Primero analiza una imagen con IA.");
      return;
    }

    try {
      setSaving(true);

      await saveSpeciesToDatabase({
        commonName: commonName.trim(),
        scientificName: scientificName.trim(),
        description: description.trim(),
        imageUrl,
        latitude,
        longitude,
        weather: "Templado",
        temperature: "22°C",
      });

      Alert.alert("Guardado", "La especie fue guardada correctamente.");

      setCommonName("");
      setScientificName("");
      setDescription("");
      setImageUri(null);
      setImageUrl(null);
      setLatitude(null);
      setLongitude(null);
    } catch (error: any) {
      Alert.alert("Error", error.message ?? "No se pudo guardar la especie.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar especie</Text>

      <Text style={styles.subtitle}>
        Toma o selecciona una foto. La IA llenará automáticamente los datos.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre común generado por IA"
        value={commonName}
        onChangeText={setCommonName}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre científico generado por IA"
        value={scientificName}
        onChangeText={setScientificName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descripción generada por IA"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={pickImage}
        disabled={analyzing || saving}
      >
        <Text style={styles.buttonText}>🖼 Seleccionar imagen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={takePhoto}
        disabled={analyzing || saving}
      >
        <Text style={styles.buttonText}>📷 Tomar foto</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {analyzing && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#2E7D32" size="large" />
          <Text style={styles.loadingText}>
            Analizando imagen con IA...
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.locationButton}
        onPress={getLocation}
        disabled={analyzing || saving}
      >
        <Text style={styles.buttonText}>📍 Obtener ubicación</Text>
      </TouchableOpacity>

      {latitude !== null && longitude !== null && (
        <View style={styles.locationBox}>
          <Text>Latitud: {latitude}</Text>
          <Text>Longitud: {longitude}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveSpecies}
        disabled={analyzing || saving}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Guardar especie</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateSpeciesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F1F8E9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: "#1565C0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    marginBottom: 12,
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  loadingText: {
    marginTop: 8,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  locationBox: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
});
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>

      <View style={styles.card}>
        <Text style={styles.name}>Usuario EcoScan IA</Text>
        <Text style={styles.email}>usuario@correo.com</Text>
        <Text style={styles.info}>Especies registradas: 3</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F8E9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: '#777777',
    marginTop: 5,
  },
  info: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
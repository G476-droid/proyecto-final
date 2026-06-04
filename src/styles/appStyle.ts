import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7FAFC",
    padding: 24,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A202C" },
  subtitle: { fontSize: 16, color: "#718096", marginTop: 4 },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  button: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15, color: "#718096" },
  link: { fontSize: 15, color: "#4F46E5", fontWeight: "700" },
});

export const registerStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7FAFC",
    padding: 24,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 56, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A202C" },
  subtitle: { fontSize: 16, color: "#718096", marginTop: 4 },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  button: { marginTop: 8 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15, color: "#718096" },
  link: { fontSize: 15, color: "#4F46E5", fontWeight: "700" },
});

export const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop:73,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  greeting: { fontSize: 20, fontWeight: "800", color: "#1A202C" },
  email: { fontSize: 13, color: "#718096", maxWidth: 220 },
  logoutBtn: {
    backgroundColor: "#FFF5F5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  logoutText: { color: "#E53E3E", fontWeight: "700", fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: { fontSize: 56, marginBottom: 12 },
  errorText: { fontSize: 16, color: "#718096", textAlign: "center" },
});

export const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 24 },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 13, fontWeight: "700", color: "#4F46E5" },
  userId: { fontSize: 13, color: "#718096" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A202C",
    lineHeight: 30,
    textTransform: "capitalize",
  },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 20 },
  bodyLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  body: { fontSize: 16, color: "#4A5568", lineHeight: 26 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorEmoji: { fontSize: 56, marginBottom: 12 },
  errorText: { fontSize: 16, color: "#718096", textAlign: "center" },
});

export const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  text: { marginTop: 12, fontSize: 16, color: "#718096" },
});

export const buttonStyles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    minHeight: 150,
  },

  imageBox: {
    width: 170,
    backgroundColor: "#EAF7EF",
  },

  image: {
    width: "100%",
    height: "100%",
    minHeight: 150,
  },

  placeholderBox: {
    flex: 1,
    minHeight: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF7EF",
  },

  placeholderIcon: {
    fontSize: 44,
  },

  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1F3D2B",
    marginBottom: 5,
  },

  scientific: {
    fontSize: 16,
    color: "#2F6F4F",
    fontStyle: "italic",
    marginBottom: 7,
  },

  body: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 7,
  },

  location: {
    fontSize: 13,
    color: "#166534",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 6,
    fontWeight: "700",
  },

  meta: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },

  actionsBottom: {
    flexDirection: "row",
    marginTop: 10,
  },

  mapMiniBtn: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },

  mapMiniText: {
    color: "#1D4ED8",
    fontWeight: "800",
    fontSize: 13,
  },

  actionsRight: {
  width: 70,
  justifyContent: "center",
  alignItems: "center",
  gap: 14,
  zIndex: 20,
  elevation: 20,
},

 iconBtn: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#F3F4F6",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 30,
  elevation: 30,
},

  editIcon: {
  fontSize: 22,
},

deleteIcon: {
  fontSize: 22,
},
});

export const inputStyles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#2D3748", marginBottom: 6 },
  inputWrapper: { position: "relative" },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#2D3748",
    backgroundColor: "#F7FAFC",
  },
  inputError: { borderColor: "#E53E3E" },
  eyeIcon: { position: "absolute", right: 14, top: 12 },
  eyeText: { fontSize: 20 },
  errorText: { fontSize: 12, color: "#E53E3E", marginTop: 4 },
});

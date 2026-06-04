import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EEF4F1",
    padding: 24,
    justifyContent: "center",
  },
  shell: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },
  brandCard: {
    backgroundColor: "#103B2D",
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 30,
    marginBottom: 20,
    shadowColor: "#103B2D",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  header: { alignItems: "center" },
  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    width: 68,
    height: 68,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#B7D6C6",
    marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: "800", color: "#F8FFFB" },
  subtitle: {
    fontSize: 15,
    color: "#D7E7DE",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E3ECE7",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#19352B",
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6A7D73",
    marginBottom: 20,
    lineHeight: 20,
  },
  button: { marginTop: 8, borderRadius: 16 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { fontSize: 15, color: "#6A7D73" },
  link: { fontSize: 15, color: "#1B6B52", fontWeight: "700" },
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
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DCE8E1",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    minHeight: 168,
  },

  imageBox: {
    width: 152,
    backgroundColor: "#E5F1EA",
  },

  image: {
    width: "100%",
    height: "100%",
    minHeight: 168,
  },

  placeholderBox: {
    flex: 1,
    minHeight: 168,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5F1EA",
  },

  placeholderIcon: {
    fontSize: 44,
  },

  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: "space-between",
  },

  topMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  badge: {
    backgroundColor: "#EEF7F1",
    color: "#1E684D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "800",
    overflow: "hidden",
  },

  climate: {
    fontSize: 12,
    color: "#6A7D73",
    fontWeight: "700",
  },

  title: {
    fontSize: 21,
    fontWeight: "800",
    color: "#19352B",
    marginBottom: 6,
  },

  scientific: {
    fontSize: 13,
    color: "#507364",
    marginBottom: 8,
    fontWeight: "600",
  },

  body: {
    fontSize: 14,
    color: "#5B6B64",
    lineHeight: 20,
    marginBottom: 12,
  },

  location: {
    fontSize: 13,
    color: "#14553F",
    backgroundColor: "#EDF8F1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
    fontWeight: "700",
    alignSelf: "flex-start",
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  actionsBottom: {
    flexDirection: "row",
    alignItems: "center",
  },

  mapMiniBtn: {
    backgroundColor: "#E9F3EE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFE2D7",
  },

  mapMiniText: {
    color: "#1E684D",
    fontWeight: "800",
    fontSize: 13,
  },

  meta: {
    fontSize: 12,
    color: "#6A7D73",
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
  },

  actionsRight: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F6FBF8",
    borderLeftWidth: 1,
    borderLeftColor: "#E3ECE7",
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCE8E1",
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
  label: { fontSize: 14, fontWeight: "700", color: "#284438", marginBottom: 8 },
  inputWrapper: { position: "relative" },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: "#D7E5DD",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#284438",
    backgroundColor: "#F7FBF8",
  },
  inputError: { borderColor: "#D9534F" },
  eyeIcon: { position: "absolute", right: 16, top: 15 },
  eyeText: { fontSize: 20 },
  errorText: { fontSize: 12, color: "#D9534F", marginTop: 5 },
});

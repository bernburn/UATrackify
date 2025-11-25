import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 18,
    borderRadius: 6,
    fontSize: 16,
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    marginLeft: 0,
    marginBottom: 24,
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,

  checkIcon: {
    fontSize: 20,       // ✔ big check mark
    fontWeight: "bold",
    color: "#000",
    lineHeight: 22,     // ✔ ensures perfect vertical centering
    textAlign: "center" // ✔ horizontal centering
  },

  },
  roleField: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 18,
    borderRadius: 6,
    fontSize: 16,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#222",
  },
  backButton: {
    marginTop: 12,
    textDecorationLine: "underline",
    color: "#007bff",
    fontFamily: "system-ui",
    width: "fit-content",
    textAlign: "center",
    padding: 8,
    marginLeft: "auto",
    marginRight: "auto",
  },

  bg: {
  flex: 1,
  width: 40,
  height: 40,
  },

  loginButton: {
  backgroundColor: "#002365",  
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 20,
  },

  loginButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  },

});

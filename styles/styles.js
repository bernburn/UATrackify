import { StyleSheet } from "react-native";

export default StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    paddingBottom: 32,
    paddingTop: 32,
    width: 350,
    borderRadius: 8,
    marginTop: 32,
    marginLeft: "auto",
    marginRight: "auto",
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
});

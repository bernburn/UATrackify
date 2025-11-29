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
  // Add these styles to your existing styles object in styles/styles.js
dropdownButton: {
    height: 50,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
},
dropdownButtonText: {
    fontSize: 16,
    color: '#333',
},
modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
dropdownContainer: {
    width: '80%',
    maxHeight: '60%', // Limits the height of the modal list
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
},
dropdownListWrapper: {
    flexGrow: 0, // Allows the FlatList to respect maxHeight
    maxHeight: 300, // Explicit max height for the list to ensure scrollability
    marginBottom: 10,
},
dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
},
dropdownItemText: {
    fontSize: 16,
},
});

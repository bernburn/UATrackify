import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#eef2ff",
  },

  loginCard: {
    width: "100%",       // full width on mobile
    maxWidth: 500,
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#001e66",
    shadowColor: "#001e66",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 28,
    textAlign: "center",
    color: "#001e66",
  },

  inputlog: {
    borderWidth: 2,
    borderColor: "#001e66",
    padding: 14,
    marginBottom: 18,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },

    input: {
    borderWidth: 2,
    boorderColor: "#001e66",
    padding: 14,
    marginBottom: 18,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",          // ⭐ FULL WIDTH on all screen sizes
    minWidth: 250,          // ⭐ Prevents shrinking on small screens
    maxWidth: 300,          // ⭐ Looks good on tablets / large screens
  },

  errorMessage: {
    color: "#cf1a24",
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#001e66",
    backgroundColor: "#fff",
    borderRadius: 4,
    marginRight: 10,
  },

  checkboxChecked: {
    backgroundColor: "#ffd800", // yellow highlight
    borderColor: "#001e66",
  },

  checkboxLabel: {
    fontSize: 16,
    color: "#001e66",
    fontWeight: "500",
  },

  backButton: {
    marginTop: 16,
    textDecorationLine: "underline",
    color: "#001e66",
    fontSize: 15,
    textAlign: "center",
    padding: 6,
  },

// ⭐ RESPONSIVE DROPDOWN BUTTON (Fully matches input size)
dropdownButton: {
  width: "100%",          // ⭐ FULL WIDTH on all screen sizes
  minWidth: 250,          // ⭐ Prevents shrinking on small screens
  maxWidth: 300,          // ⭐ Looks good on tablets / large screens

  padding: 14,            // ⭐ Matches TextInput padding
  borderWidth: 2,
  borderColor: "#001e66",
  borderRadius: 10,
  backgroundColor: "#fff",
  justifyContent: "center",
  marginBottom: 18,
},

dropdownButtonText: {
  fontSize: 16,
  color: "#001e66",
  fontWeight: "500",
},


  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  dropdownContainer: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: "#001e66",
  },

  dropdownListWrapper: {
    flexGrow: 0,
    maxHeight: 300,
    marginBottom: 10,
  },

  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownItemText: {
    fontSize: 16,
    color: "#001e66",
  },

  checkbox: {
  width: 22,
  height: 22,
  borderWidth: 2,
  borderColor: "#001e66",
  backgroundColor: "#fff",
  borderRadius: 5,
  marginRight: 10,
  justifyContent: "center",
  alignItems: "center",
},

checkboxChecked: {
  backgroundColor: "#ffd800",
  borderColor: "#001e66",
},

// This is the custom checkmark shape inside checkbox
checkmark: {
  width: 10,
  height: 5,
  borderLeftWidth: 2,
  borderBottomWidth: 2,
  borderColor: "#001e66",
  transform: [{ rotate: "-45deg" }],
},

checkboxRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 22,
},

registerLink: {
  color: "#001e66",           // your blue
  textDecorationLine: "underline",
  fontSize: 15,
  marginTop: 16,
  textAlign: "center",
  padding: 6,
},

loginButtonWrapper: {
  borderRadius: 10,          // your requested rounded corners
  overflow: "hidden",        // force the inner button to follow radius
  marginTop: 10,
  backgroundColor: "#001e66", // blue shade background
  maxWidth: "100%",

},

// ============================================
// ⭐ REGISTER PAGE STYLING STARTS HERE ⭐
// ============================================

  registerCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#001e66",
    shadowColor: "#001e66",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    alignItems: "center",
  },

registerTitle: {
  fontSize: 32,
  fontWeight: "900",
  textAlign: "center",
  color: "#001e66",
  marginBottom: 25,
},

registerInput: {
  borderWidth: 2,
  borderColor: "#001e66",
  padding: 15,
  marginBottom: 18,
  borderRadius: 10,
  fontSize: 16,
  backgroundColor: "#fff",
},

registerError: {
  color: "#cf1a24",
  backgroundColor: "#ffd8d8",
  padding: 10,
  borderRadius: 8,
  fontWeight: "bold",
  textAlign: "center",
  borderWidth: 1,
  borderColor: "#cf1a24",
  marginBottom: 16,
},

// 🔵 Thick Register Button
registerButtonWrapper: {
  width: "100%",
  marginTop: 10,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#001e66",
},

registerButton: {
  paddingVertical: 16,
  justifyContent: "center",
  alignItems: "center",
},

registerButtonText: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "700",
},

// 🔽 Enhanced dropdown styling
// 🔽 Match Select Organization to Input Fields
roleField: {
  marginBottom: 20,
  paddingVertical: 10,
  paddingHorizontal: 14,
  borderWidth: 2,
  borderColor: "#001e66",
  borderRadius: 10,
  backgroundColor: "#ffffff6a",
  width: "100%",          // ⭐ FULL WIDTH on all screen sizes
  minWidth: 250,          // ⭐ Prevents shrinking on small screens
  maxWidth: 300,          // ⭐ Looks good on tablets / large screens
},

backButton: {
  marginTop: 20,
  textAlign: "center",
},

backButtonText: {
  color: "#001e66",
  fontSize: 16,
  textDecorationLine: "underline",
  fontWeight: "500",
},

reviewButtonWrapper: {
  width: "100%",        // ⭐ Full width
  maxWidth: 250,        // ⭐ Consistent on large screens
  backgroundColor: "#001e66",
  borderRadius: 12,     // ⭐ Rounded corners
  overflow: "hidden",   // ⭐ Forces Button to follow radius
  marginTop: 10,
  marginBottom: 20,
},

// ============================================
// ⭐ REVIEWUSERINFOPAGE.JS STYLING STARTS HERE ⭐
// ============================================

  reviewCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#001e66",
    shadowColor: "#001e66",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    alignItems: "center",
  },

  reviewTitle: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#001e66",
    marginBottom: 25,
  },

  reviewInput: {
    borderWidth: 2,
    borderColor: "#001e66",
    padding: 15,
    marginBottom: 18,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    width: "100%",          
    minWidth: 250,          
    maxWidth: 300,          
  },

  reviewError: {
    color: "#cf1a24",
    backgroundColor: "#ffd8d8",
    padding: 10,
    borderRadius: 8,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#cf1a24",
    marginBottom: 16,
  },

  reviewButton: {
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },




});

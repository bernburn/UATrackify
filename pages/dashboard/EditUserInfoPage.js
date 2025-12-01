import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { colors } from "../../styles/colors";

export default function EditUserInfo({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Modals
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModal = (msg) => {
    setModalMessage(msg);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 1800);
  };

  // Load user info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem("user_id");
        const token = await AsyncStorage.getItem("authToken");

        if (id && token) {
          setUserId(id);

          const response = await axios.get(
            `http://127.0.0.1:8000/api/Users/${id}/`,
            { headers: { Authorization: `Token ${token}` } }
          );

          const userData = response.data;

          // Autofill the form
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            password: "",
          });

          // Save original for change comparison
          setOriginalData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
          });

        } else {
          showModal("User authentication missing.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        showModal("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!userId) {
      showModal("Cannot save, user ID missing.");
      return;
    }

    // Check for changes
    const changesDetected =
      formData.first_name.trim() !== originalData.first_name ||
      formData.last_name.trim() !== originalData.last_name ||
      formData.email.trim() !== originalData.email ||
      formData.password.trim() !== "";

    if (!changesDetected) {
      showModal("No changes detected.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");

      const dataToSubmit = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      };

      if (formData.password.trim() !== "") {
        dataToSubmit.password = formData.password.trim();
      }

      await axios.put(
        `http://127.0.0.1:8000/api/Users/${userId}/`,
        dataToSubmit,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Show success modal
      showModal("Changes saved successfully!");

      // Update original data after save
      setOriginalData({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      });

      // Wait before navigating back (so modal is visible)
      setTimeout(() => {
        navigation.goBack();
      }, 1200);

    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      showModal("Update failed.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading User Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Information</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.primary,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.secondary,
  },
  backButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    minWidth: "70%",
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
  
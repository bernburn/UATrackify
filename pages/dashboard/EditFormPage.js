<<<<<<< HEAD
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
// 👈 ADDED: Import AsyncStorage to get the current user's ID/Token
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { colors } from "../../styles/colors"; // Assuming you have a styles/colors.js

// Define the base URL for the API. 
// NOTE: For a real React Native app, this should be an environment variable 
// (e.g., process.env.EXPO_PUBLIC_API_URL) and should resolve to the correct 
// IP address or domain name where the backend is hosted.
const BASE_API_URL = "http://127.0.0.1:8000"; // Keep the base URL for local testing

// --- Component ---

export default function EditUserForm({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Not recommended for a simple form, but included for completeness
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 1. Get current user's ID and Auth Token from storage
    const fetchUserData = async () => {
      try {
        const id = await AsyncStorage.getItem("user_id");
        const token = await AsyncStorage.getItem("authToken");

        if (id && token) {
          setUserId(id);
          // 2. Fetch the specific user's current data using the new API path
          const userApiUrl = `${BASE_API_URL}/api/Users/${id}/`; // Uses the new path structure
          
          const response = await axios.get(
            userApiUrl, 
            {
              headers: {
                Authorization: `Token ${token}`, // Assuming token authentication
              },
            }
          );

          const userData = response.data;
          setFormData({
            first_name: userData.first_name || "",
            last_name: userData.last_name || "",
            email: userData.email || "",
            password: "", // Never fetch or display the password
          });
        } else {
          // Replaced Alert.alert with console.error for non-mobile environment
          console.error("Error: User not logged in or missing ID. Redirecting to Login.");
          navigation.navigate("Login");
        }
      } catch (e) {
        console.error("Error fetching user data:", e.response ? e.response.data : e.message);
        // Replaced Alert.alert with console.error
        console.error("Error: Could not load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!userId) {
      // Replaced Alert.alert with console.error
      console.error("Error: Cannot save, user ID is missing.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        // Replaced Alert.alert with console.error
        console.error("Error: Authentication token is missing.");
        return;
      }

      // Prepare data for submission - only send fields you want to change
      const dataToSubmit = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        // Only include password if it's been entered by the user
        ...(formData.password && { password: formData.password }), 
      };

      // 3. Make a PUT request to update the user using the new API path
      const updateApiUrl = `${BASE_API_URL}/api/Users/${userId}/`; // Uses the new path structure

      const response = await axios.put( 
        updateApiUrl,
        dataToSubmit,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Replaced Alert.alert with console.log for success message
      console.log("Success: User information updated successfully!");
      console.log("Update response:", response.data);

      // Optionally, navigate back or refresh the view
      navigation.goBack(); 

    } catch (error) {
      console.error("Update failed:", error.response ? error.response.data : error.message);
      // Replaced Alert.alert with console.error
      console.error("Error: There was an error updating your information.");
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
      
      {/* Basic password field - user must re-enter if they want to change it */}
      <TextInput
        style={styles.input}
        placeholder="New Password (leave blank to keep current)"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleSave} />
=======
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import { colors } from "../../styles/colors";

import { Picker } from "@react-native-picker/picker";

export default function DashboardPage({ navigation, route }) {
  const routeData = route.params;

  const role = localStorage.getItem("role");

  const office = localStorage.getItem("office");

  const authToken = localStorage.getItem("authToken");

  const [fileName, setFileName] = useState("");

  const [editData, setEditData] = useState({
    event_name: "",
    contact_person: "",
    event_date: "",
    attach_document: null,
    organization: routeData.organization,
  });

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleWebFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setEditData({ ...editData, attach_document: file });
      setFileName(file.name);
    } else {
      setEditData({ ...editData, attach_document: null });
      setFileName("");
    }
  };

  const putData = async () => {
    try {
      const formData = new FormData();
      formData.append("event_name", editData.event_name);
      formData.append("contact_person", editData.contact_person);
      formData.append("event_date", editData.event_date);
      formData.append("organization", editData.organization);

      // Attach file only if exists
      if (editData.attach_document) {
        formData.append("attach_document", editData.attach_document);
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/Events/${routeData.id}/`,
        formData
        // {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //     Authorization: `${authToken}`,
        //   },
        // }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name:"
        onChangeText={(text) => handleChange("event_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Person:"
        onChangeText={(text) => handleChange("contact_person", text)}
      />

      {/* Date Picker */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Event Date (YYYY-MM-DD):</Text>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={editData.event_date}
            onChange={(e) => handleChange("event_date", e.target.value)}
            style={styles.webDateInput}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="e.g., 2024-12-31 (Mobile: use native picker)"
            value={editData.event_date}
            onChangeText={(text) => handleChange("event_date", text)}
          />
        )}
      </View>

      {/* File Upload Section */}
      <View style={styles.filePickerSection}>
        {Platform.OS === "web" ? (
          <View>
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
              Attach Document:
            </Text>
            <input type="file" onChange={handleWebFileChange} />
          </View>
        ) : (
          <Button
            title="Select Document (Mobile)"
            onPress={() => alert("Use DocumentPicker for Mobile")}
          />
        )}

        <Text style={styles.fileNameText}>
          {fileName ? `File selected: ${fileName}` : "No file selected."}
        </Text>
      </View>

      {role === "admin" && office === "OSA" ? (
        <View>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Option 1" value="value1" />
            <Picker.Item label="Option 2" value="value2" />
            <Picker.Item label="Option 3" value="value3" />
          </Picker>
        </View>
      ) : (
        ""
      )}

      <View style={{ marginVertical: 20 }}>
        <Button title="Save" onPress={putData} />
      </View>
>>>>>>> 3367a044a53f1840200b51c8264fc1da1275b816
    </View>
  );
}

<<<<<<< HEAD
// --- Styles ---

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    // Note: 'colors' is undefined in this standalone context unless provided externally
    // color: colors.primary, 
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
});
=======
const styles = StyleSheet.create({
  container: {
    height: "100vh",
    backgroundColor: colors.surface,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  datePickerLabel: {
    marginBottom: 5,
    fontWeight: "600",
  },
  webDateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
  },
  filePickerSection: {
    marginVertical: 20,
  },
  fileNameText: {
    marginTop: 8,
    color: "#444",
  },
});
>>>>>>> 3367a044a53f1840200b51c8264fc1da1275b816

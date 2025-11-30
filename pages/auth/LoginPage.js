import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/styles"; // Ensure this includes a style for the error message
import axios from "axios";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 1. State for error message
  const [data, setData] = useState([]);

  // Check for persistent token and flag on app load/refresh
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem("authToken");
        const isRemembered = await AsyncStorage.getItem("isRemembered");

        if (authToken && isRemembered === "true") {
          console.log("Found persistent token, navigating to Dashboard.");
          navigation.replace("Dashboard");
        }
      } catch (e) {
        console.error("Failed to check token in storage:", e);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous error message on new login attempt

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/token/login/",
        {
          email: email,
          password: password,
        }
      );

      console.log("Login successful:", response.data);

      // Save ALL essential session data UNCONDITIONALLY
      await AsyncStorage.setItem("authToken", response.data.auth_token);
      await AsyncStorage.setItem("user_id", response.data.user_id.toString());
      await AsyncStorage.setItem("email", response.data.email);
      await AsyncStorage.setItem("role", response.data.role.toString());
      await AsyncStorage.setItem("name", response.data.name);
      await AsyncStorage.setItem("organization", response.data.organization);

      if (rememberMe) {
        await AsyncStorage.setItem("isRemembered", "true");
        console.log("Persistent data saved.");
      } else {
        await AsyncStorage.setItem("isRemembered", "false");
        console.log(
          "Session token and essential data saved for current run. Persistence disabled."
        );
      }

      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error during login:", error);

      // 3. Set a specific error message based on the response
      if (error.response && error.response.status === 400) {
        // Typically 400 Bad Request is used for invalid credentials
        setErrorMessage("Invalid email or password. Please try again.");
      } else {
        // For other errors (e.g., network issues)
        setErrorMessage(
          "An error occurred during login. Please check your connection."
        );
      }

      // Optionally, you can remove the generic Alert since you now have an inline message:
      // Alert.alert("Login Failed", "Please check your email and password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe((prev) => !prev)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </TouchableOpacity>

      <Button title="Login" onPress={handleLogin} />

      {/* 2. Display the error message if it exists */}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: "#007bff" }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

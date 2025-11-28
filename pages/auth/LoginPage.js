import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import styles from "../../styles/styles";
import axios from "axios";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [data, setData] = useState([]);

  const handleLogin = async () => {
    try {
            const response = await axios.post("http://127.0.0.1:8000/auth/token/login/", {
              email: email,
              password: password
            })
            setData(response.data)
  
              localStorage.setItem('authToken', response.data.auth_token);
              localStorage.setItem("role", response.data.role);
              localStorage.setItem("user_id", response.data.user_id);
              localStorage.setItem("email", response.data.email);
            
            
            
            navigation.navigate("Dashboard");
            
          } catch (error) {
            console.error('Error fetching data:', error);
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

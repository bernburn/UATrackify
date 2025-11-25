import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ImageBackground } from "react-native";
import styles from "../../styles/styles";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    alert(`Email: ${email}\nPassword: ${password}\nRemember Me: ${rememberMe}`);
  };

  return (

    <View style={styles.container}>
      <ImageBackground 
      source={require("../../assets/bg.logo.png")}   
      style={styles.bg}
     ></ImageBackground>
     
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
        <View style={styles.checkbox}>
        {rememberMe && <Text style={styles.checkIcon}>✓</Text>} </View>

        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
      <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>


      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: "black" }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
    
  );
}

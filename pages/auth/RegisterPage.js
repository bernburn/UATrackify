import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import styles from "../../styles/styles"; // Adjust the path as needed

export default function RegisterPage({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const role = "Student"; // default value

  const handleRegister = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Organization"
        value={organization}
        onChangeText={setOrganization}
      />
      <View style={styles.roleField}>
        <Text style={{ fontSize: 16, color: "#333" }}>{role}</Text>
      </View>
      <Button title="Register" onPress={handleRegister} />

      <div style={styles.backButton} onClick={() => navigation.goBack()}>
        Back to Login
      </div>
    </View>
  );
}

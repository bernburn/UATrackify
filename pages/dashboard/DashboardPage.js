import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import NavBar from "../componentsFolder/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import StudentDashboardPage from "./components/StudentDashboard";
import AdminDashboardPage from "./components/AdminDashboard";
import { colors } from "../../styles/colors"; // Moved the colors import up

export default function DashboardPage({ navigation }) {
  // sample user role logic
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  return (
    <View style={styles.container}>
      {/* 🚨 FIX: Wrap NavBar in a View with high zIndex and position: 'relative' */}
      <View style={styles.navContainer}>
        {/* You need to pass navigation to NavBar for the menu items to work */}
        <NavBar navigation={navigation} />
      </View>

      {/* The welcome message View should not have a high zIndex */}
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <ScrollView style={styles.scrollView}>
            <View style={{ margin: 24 }}>
              <Text style={[styles.text, { color: colors.primary }]}>
                Welcome, {name}
              </Text>
            </View>

            {role === "admin" ? (
              <AdminDashboardPage navigation={navigation} />
            ) : (
              <StudentDashboardPage navigation={navigation} />
            )}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Changing '100vh' to '100%' for better cross-platform support
    height: "100%",
    flex: 1, // Add flex: 1 for RN best practices
    backgroundColor: colors.surface,
  },
  // 🚨 NEW STYLE RULE FOR Z-INDEX FIX 🚨
  navContainer: {
    // This is the key: establishes a stacking context with high priority
    position: "relative", // CRITICAL for RN Web to activate zIndex properly
    zIndex: 1000,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

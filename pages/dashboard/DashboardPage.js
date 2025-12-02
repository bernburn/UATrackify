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

            <View style={styles.container2}>
              <View style={{ display: "flex", maxWidth: 200 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: colors.lightText,
                  }}
                >
                  Form Submission:
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontStyle: "italic",
                    color: colors.lightText,
                    marginVertical: 15,
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
                <Pressable onPress={() => navigation.navigate("AddForm")}>
                  <View style={styles.button}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: colors.primary,
                      }}
                    >
                      Submit a Form
                    </Text>
                  </View>
                </Pressable>
              </View>
              <View
                style={{
                  width: 100,
                  borderRadius: 10,
                  backgroundColor: "rgba(78, 88, 216, 1)",
                }}
              ></View>
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
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    padding: 4,
    borderRadius: 5,
  },
  container2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginVertical: 14,
    backgroundColor: "#4a86dfff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

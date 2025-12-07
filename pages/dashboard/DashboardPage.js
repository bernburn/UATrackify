import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Platform, // Added Platform for RN-web style fixes
} from "react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from "../componentsFolder/NavBar";
import StudentDashboardPage from "./components/StudentDashboard";
import AdminDashboardPage from "./components/AdminDashboard";

// --- THEME COLORS ---
const THEME_COLORS = {
  softGray: "#E0E5F2", // Background
  glassBlue: "#007AFF", // Primary Blue for CTA
  darkBlue: "#005BCC", // Darker blue for contrast
  glassSurface: "rgba(255, 255, 255, 0.2)", // Transparent white for glass cards
  glassBorder: "rgba(255, 255, 255, 0.4)", // White border for glass edge
  headerBackground: "rgba(0, 122, 255, 0.8)", // Semi-transparent Blue for header
  white: "#FFFFFF",
};
// --------------------

export default function DashboardPage({ navigation }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setName(await AsyncStorage.getItem("name"));
      setRole(await AsyncStorage.getItem("role"));
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navContainer}>
        <NavBar navigation={navigation} />
      </View>

      <SafeAreaProvider>
        <SafeAreaView
          style={styles.safe}
          contentContainerStyle={{
            minHeight: Platform.OS === "web" ? "100vh" : "100%",
          }}
          edges={["top"]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={{ height: "100%" }}
          >
            {/* Glassy Blue Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Welcome,</Text>
              <Text style={styles.headerName}>{name}</Text>
              <View style={styles.headerCircle1} />
              <View style={styles.headerCircle2} />
              <View style={styles.headerOverlay} />{" "}
              {/* Added a subtle overlay for the 'frost' effect */}
            </View>

            {/* Glassy Quick Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Submit Forms</Text>
              <Text style={styles.cardDesc}>
                Easily send your school-related forms anytime.
              </Text>

              <Pressable
                onPress={() => navigation.navigate("AddForm")}
                style={({ pressed }) => [
                  styles.button,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View>
                  <Text style={styles.buttonText}>Submit a Form</Text>
                </View>
              </Pressable>
            </View>

            {/* Role-Based Dashboard */}
            {role === "admin" ? (
              <AdminDashboardPage navigation={navigation} />
            ) : (
              <StudentDashboardPage navigation={navigation} />
            )}
            <View style={styles.footers}>
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} UA Trackify. All rights reserved.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
        {/* Footer at the bottom of content */}
      </SafeAreaProvider>
    </View>
  );
}

/* ==========================
      STYLES (Glassmorphism)
========================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.softGray, // Soft background
  },

  navContainer: {
    position: "relative",
    zIndex: 1000,
  },

  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  /* HEADER (Blue Glass Effect) */
  header: {
    height: 180,
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: THEME_COLORS.headerBackground, // Semi-transparent Blue
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    // Fallback for Web/RN-web: added this for visual cue
    ...(Platform.OS === "web" && { backdropFilter: "blur(15px)" }),
    shadowColor: THEME_COLORS.darkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },

  // Subtle frost effect inside the header
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 0,
  },

  headerTitle: {
    fontSize: 18,
    color: THEME_COLORS.white,
    fontWeight: "800",
    zIndex: 1, // Ensure text is above overlay
  },

  headerName: {
    fontSize: 34,
    fontWeight: "800",
    color: THEME_COLORS.white,
    marginTop: 8,
    zIndex: 1,
  },

  /* Background Circle Decorations */
  headerCircle1: {
    position: "absolute",
    top: -40,
    right: -50,
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)", // Very light transparency
  },

  headerCircle2: {
    position: "absolute",
    bottom: -60,
    left: -60,
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  /* GLASS CARD */
  card: {
    backgroundColor: THEME_COLORS.glassSurface, // Transparent white for glass effect
    padding: 24,
    marginHorizontal: 24,
    marginTop: -60, // Pulled up to overlap the header
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME_COLORS.glassBorder, // Subtle white border
    // Drop shadow for the floating effect
    shadowColor: THEME_COLORS.darkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    zIndex: 5, // Keep card above content below
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white", // Dark text on light glass
    marginBottom: 4,
  },

  cardDesc: {
    fontSize: 15,
    color: THEME_COLORS.darkBlue,
    marginTop: 8,
    marginBottom: 20,
    opacity: 0.7,
  },

  /* BUTTON (Solid Blue CTA) */
  button: {
    backgroundColor: THEME_COLORS.glassBlue, // Solid Primary Blue
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: THEME_COLORS.glassBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonText: {
    color: THEME_COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  scroll: {
    flexGrow: 1,
    // On web, minHeight: '100vh' ensures full viewport height
  },
  footers: {
    width: "100%",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_COLORS.glassSurface,
    borderTopWidth: 1,
    borderColor: THEME_COLORS.glassBorder,
    marginTop: "auto",
  },
  footerText: {
    color: THEME_COLORS.darkBlue,
    fontSize: 14,
    opacity: 0.7,
    fontWeight: "500",
  },
});

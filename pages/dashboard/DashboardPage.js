import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import NavBar from "../componentsFolder/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";

import StudentDashboardPage from "./components/StudentDashboard";
import AdminDashboardPage from "./components/AdminDashboard";

export default function DashboardPage({ navigation }) {
  // sample user role logic
  const role = localStorage.getItem("role");
  const organization = localStorage.getItem("organization");
  const name = localStorage.getItem("name");
  const [filteredResponse, setFilteredResponse] = useState({ data: [] });

  console.log("Role in Dashboard:", role);
  let text = "";
  if (role !== "student") {
    text = "Admin Dashboard";
  } else {
    text = "Student Dashboard";
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/list_Events/"
        );
        if (role === "student") {
          const filteredData = response.data.filter(
            (item) => item.organization === organization
          );
          setFilteredResponse({ data: filteredData });
          console.log(filteredData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <NavBar text={text} />
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
    </View>
  );
}

import { colors } from "../../styles/colors";

const styles = StyleSheet.create({
  container: {
    height: "100vh",
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: 24,
    fontWeight: 600,
  },
});

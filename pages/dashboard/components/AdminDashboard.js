import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";
import axios from "axios";
import { colors } from "../../../styles/colors";

export const Card = ({ title, onPress }) => {
  return (
    <View style={styles.card}>
      <Text style={{ fontSize: 18, marginBottom: 12 }}>{title}</Text>
    </View>
  );
};

export default function DashboardPage({ navigation }) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/list_Events/"
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <View style={styles.container}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>
            Ongoing Form Approvals
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <View style={styles.container}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>
            Pending Approvals
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <View style={styles.container}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>Completed</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 600,

    color: colors.primary,
  },
  subtext: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.primary,
  },
  container: {
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
  container2: {
    marginHorizontal: 14,
    borderRadius: 10,
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
});

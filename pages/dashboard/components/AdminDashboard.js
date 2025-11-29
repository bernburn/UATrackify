import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";
import styles from "../../../styles/styles";
import { useEffect, useState } from "react";
import axios from "axios";

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
        <View style={styles.card}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>
            Ongoing Form Approvals
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <View style={styles.card}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>
            Pending Approvals
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Register")}>
        <View style={styles.card}>
          <Text style={{ fontSize: 18, marginBottom: 12 }}>Completed</Text>
        </View>
      </Pressable>
    </View>
  );
}

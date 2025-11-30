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

// COMPONENTS

import Card from "./Card";

export default function StudentDashboardPage({ navigation }) {
  // sample user role logic
  const organization = localStorage.getItem("organization");

  const [filteredResponse, setFilteredResponse] = useState({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/list_Events/"
        );
        const filteredData = response.data.filter(
          (item) => item.organization === organization
        );
        setFilteredResponse({ data: filteredData });
        console.log(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <View style={{ display: "flex", maxWidth: 200 }}>
          <Text
            style={{ fontSize: 20, fontWeight: 600, color: colors.lightText }}
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Pressable onPress={() => navigation.navigate("AddForm")}>
            <View style={styles.button}>
              <Text
                style={{ fontSize: 16, fontWeight: 500, color: colors.primary }}
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
      <View style={styles.container2}>
        <View style={{ margin: 24 }}>
          <Text style={styles.text}>Submitted Forms:</Text>

          <Text style={styles.subtext}>
            Here are the forms you’ve submitted so far. Tap a form to check its
            progress.
          </Text>
        </View>

        {filteredResponse.data.map((item) => {
          console.log(item.id);
          let statusOverall =
            item.status_finance === "C" &&
            item.status_osa === "C" &&
            item.status_vpa === "C" &&
            item.status_vpaa === "C"
              ? "Completed"
              : "Pending";
          return (
            <Card
              key={item.id}
              id={item.id}
              title={item.event_name}
              organization={item.organization}
              eventDate={item.event_date}
              statusOverall={statusOverall}
              contactPerson={item.contact_person}
              attachedDocument={item.attach_document}
            />
          );
        })}
      </View>
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

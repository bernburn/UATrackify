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
        <View style={{ margin: 24 }}>
          <Text style={styles.text}>Submitted Forms:</Text>

          <Text style={styles.subtext}>
            Here are the forms you’ve submitted so far. Tap a form to check its
            progress.
          </Text>
        </View>

        {filteredResponse.data.map((item) => {
          console.log(item.id);
          console.log(item.date_added);
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
              dateAdded={item.date_added}
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
    marginHorizontal: 14,
    borderRadius: 10,
  },
});

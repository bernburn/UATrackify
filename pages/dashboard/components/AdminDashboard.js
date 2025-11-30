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

import Card from "./Card";
import { Picker, selectedValue } from "react-native-web";

export default function AdminDashboardPage({ navigation }) {
  const [data, setData] = useState({ data: [] });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/list_Events/"
        );
        setData({ data: response.data });
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <View>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Option 1" value="value1" />
        <Picker.Item label="Option 2" value="value2" />
        <Picker.Item label="Option 3" value="value3" />
      </Picker>
      {data.data.map((item) => {
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

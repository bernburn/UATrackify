import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { colors } from "../../../styles/colors";

// COMPONENTS

import Card from "./Card";

export default function StudentDashboardPage({ navigation }) {
  const [filteredResponse, setFilteredResponse] = useState({ data: [] });
  const [searchText, setSearchText] = useState("");
  const [sortKey, setSortKey] = useState("date_added");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/list_Events/"
        );
        const org = await AsyncStorage.getItem("organization");

        const filteredData = response.data.filter(
          (item) => item.organization === org
        );
        setFilteredResponse({ data: filteredData });
        console.log(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // derive visibleData with search + sort
  const visibleData = useMemo(() => {
    const list = Array.isArray(filteredResponse.data)
      ? filteredResponse.data.slice()
      : [];
    const ft = (searchText || "").toLowerCase().trim();
    const filtered = list.filter((item) => {
      if (!ft) return true;
      const name = (item.event_name || "").toString().toLowerCase();
      const id = (item.id || "").toString().toLowerCase();
      return name.includes(ft) || id.includes(ft);
    });

    const sorted = filtered.sort((a, b) => {
      let av, bv;
      switch (sortKey) {
        case "name":
          av = (a.event_name || "").toString().toLowerCase();
          bv = (b.event_name || "").toString().toLowerCase();
          break;
        case "id":
          av = Number(a.id || 0);
          bv = Number(b.id || 0);
          break;
        case "event_date":
          av = a.event_date ? new Date(a.event_date).getTime() : 0;
          bv = b.event_date ? new Date(b.event_date).getTime() : 0;
          break;
        case "date_added":
        default:
          av = a.date_added ? new Date(a.date_added).getTime() : 0;
          bv = b.date_added ? new Date(b.date_added).getTime() : 0;
          break;
      }
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredResponse, searchText, sortKey, sortOrder]);

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

        {/* Search + Controls */}
        <View style={{ marginBottom: 12 }}>
          <TextInput
            placeholder="Search by name or id"
            value={searchText}
            onChangeText={(t) => setSearchText(t)}
            style={styles.searchInput}
            placeholderTextColor={"rgba(128, 128, 128, 0.8)"}
          />
          <View style={styles.controlsRow}>
            <Picker
              selectedValue={sortKey}
              style={styles.picker}
              onValueChange={(itemValue) => setSortKey(itemValue)}
            >
              <Picker.Item label="Date Added" value="date_added" />
              <Picker.Item label="Event Date" value="event_date" />
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="ID" value="id" />
            </Picker>

            <TouchableOpacity
              style={styles.orderButton}
              onPress={() =>
                setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
              }
            >
              <Text style={styles.orderButtonText}>
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {visibleData.map((item) => {
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
    marginHorizontal: 24,
    borderRadius: 10,
  },
  searchInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  picker: {
    flex: 1,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "rgba(0, 30, 102, 0.3)",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    height: 50,
    color: "#001e66",
    paddingHorizontal: 12,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  orderButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    flex: 1,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  orderButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

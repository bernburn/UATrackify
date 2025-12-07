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

import { useEffect, useState } from "react";
import axios from "axios";
import { colors } from "../../../styles/colors";

import Card from "./Card";
import { Picker } from "react-native-web";
import { useMemo } from "react";

// --- GLASS THEME COLORS ---
const GLASS_THEME = {
  glassSurface: "rgba(255, 255, 255, 0.85)", // More opaque for readability
  glassText: "#001e66", // Dark text on light glass
  glassBorder: "rgba(0, 30, 102, 0.3)", // Dark blue border
  darkBlue: "#005BCC",
  lightBlue: "#007AFF",
  white: "#FFFFFF",
};

export default function AdminDashboardPage({ navigation }) {
  const [data, setData] = useState({ data: [] });
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [filterText, setFilterText] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("All");
  // date added filter type
  const [dateAddedFilter, setDateAddedFilter] = useState("All");
  const [customDateAdded, setCustomDateAdded] = useState("");
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

  // derive filtered + sorted data
  const ORG_OPTIONS = [
    "All",
    "SSITE",
    "UASAO",
    "MCSA",
    "JPIA",
    "LTSP",
    "BHS-PHS",
    "NSC",
    "JPPhA",
    "CRCYC",
    "CDW",
    "BATAS",
    "CREATE",
    "PICE",
    "AAA",
    "PIIE",
    "BACC",
    "PSYCHSOC",
    "LEAD",
    "CHARMS",
    "ICpEP.se",
    "INA",
    "UACSC",
  ];

  const visibleData = useMemo(() => {
    const list = Array.isArray(data.data) ? data.data.slice() : [];

    // filter by selected organization, date added dropdown, and free-text
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const parseDate = (s) => {
      if (!s) return null;
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    };

    const ft = (filterText || "").toLowerCase().trim();
    const filtered = list.filter((item) => {
      // org filter
      if (selectedOrg && selectedOrg !== "All") {
        if ((item.organization || "") !== selectedOrg) return false;
      }

      // date_added filter
      if (dateAddedFilter !== "All") {
        const itAdded = item.date_added ? new Date(item.date_added) : null;
        if (!itAdded) return false;
        if (dateAddedFilter === "Today") {
          if (itAdded < startOfToday || itAdded > endOfToday) return false;
        } else if (dateAddedFilter === "ThisWeek") {
          if (itAdded < startOfWeek || itAdded > endOfWeek) return false;
        } else if (dateAddedFilter === "ThisMonth") {
          if (itAdded < startOfMonth || itAdded > endOfMonth) return false;
        } else if (dateAddedFilter === "Custom") {
          const custom = parseDate(customDateAdded);
          if (!custom) return false;
          const startCustom = new Date(
            custom.getFullYear(),
            custom.getMonth(),
            custom.getDate(),
            0,
            0,
            0,
            0
          );
          const endCustom = new Date(
            custom.getFullYear(),
            custom.getMonth(),
            custom.getDate(),
            23,
            59,
            59,
            999
          );
          if (itAdded < startCustom || itAdded > endCustom) return false;
        }
      }

      if (!ft) return true;

      const name = (item.event_name || "").toString().toLowerCase();
      const org = (item.organization || "").toString().toLowerCase();
      const id = (item.id || "").toString().toLowerCase();
      return name.includes(ft) || org.includes(ft) || id.includes(ft);
    });

    // sort
    const sorted = filtered.sort((a, b) => {
      let av, bv;
      switch (sortKey) {
        case "organization":
          av = (a.organization || "").toString().toLowerCase();
          bv = (b.organization || "").toString().toLowerCase();
          break;
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
  }, [
    data,
    sortKey,
    sortOrder,
    filterText,
    selectedOrg,
    dateAddedFilter,
    customDateAdded,
  ]);

  return (
    <View style={{ padding: 12 }}>
      {/* Search Bar */}
      <View style={{ marginBottom: 12 }}>
        <TextInput
          placeholder="Search by name, organization, or id"
          value={filterText}
          onChangeText={setFilterText}
          style={styles.searchInput}
          placeholderTextColor={"rgba(128, 128, 128, 0.8)"}
        />
      </View>
      {/* Single Row: Date Added filter, Organization, and Sort dropdown */}
      <View style={styles.singleFilterRow}>
        <View style={styles.dateFilterWrapper}>
          <Picker
            selectedValue={dateAddedFilter}
            style={styles.dateAddedPicker}
            onValueChange={setDateAddedFilter}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Today" value="Today" />
            <Picker.Item label="This Week" value="ThisWeek" />
            <Picker.Item label="This Month" value="ThisMonth" />
            <Picker.Item label="Custom" value="Custom" />
          </Picker>
          {dateAddedFilter === "Custom" && (
            <TextInput
              placeholder="YYYY-MM-DD"
              value={customDateAdded}
              onChangeText={setCustomDateAdded}
              style={styles.dateInputSmall}
            />
          )}
        </View>

        <Picker
          selectedValue={selectedOrg}
          style={styles.orgPicker}
          onValueChange={(itemValue) => setSelectedOrg(itemValue)}
        >
          {/** Render organization options including 'All' */}
          {[
            "All",
            "SSITE",
            "UASAO",
            "MCSA",
            "JPIA",
            "LTSP",
            "BHS-PHS",
            "NSC",
            "JPPhA",
            "CRCYC",
            "CDW",
            "BATAS",
            "CREATE",
            "PICE",
            "AAA",
            "PIIE",
            "BACC",
            "PSYCHSOC",
            "LEAD",
            "CHARMS",
            "ICpEP.se",
            "INA",
            "UACSC",
          ].map((o) => (
            <Picker.Item key={o} label={o} value={o} />
          ))}
        </Picker>

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
          onPress={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
        >
          <Text style={styles.orderButtonText}>
            {sortOrder === "asc" ? "Asc" : "Desc"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Button Row */}

      {visibleData.map((item) => {
        // console.log(item.id);
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
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    padding: 4,
    borderRadius: 5,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
    padding: 16,
    backgroundColor: "#f8faff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e8ff",
  },
  singleFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    padding: 16,
    backgroundColor: GLASS_THEME.glassSurface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  orderButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 16,
    backgroundColor: GLASS_THEME.glassSurface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dateFilterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: "#001e66",
    borderRadius: 10,
    marginRight: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  picker: {
    flex: 1,
    minWidth: 120,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    height: 50,
    color: GLASS_THEME.glassText,
    paddingHorizontal: 12,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  orgPicker: {
    flex: 1,
    minWidth: 120,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    height: 50,
    color: GLASS_THEME.glassText,
    paddingHorizontal: 12,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  dateAddedFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    padding: 16,
    backgroundColor: GLASS_THEME.glassSurface,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dateAddedPicker: {
    flex: 1,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    height: 50,
    color: GLASS_THEME.glassText,
    paddingHorizontal: 12,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  dateInputSmall: {
    padding: 12,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    minWidth: 120,
    fontSize: 14,
    backgroundColor: GLASS_THEME.glassSurface,
    color: GLASS_THEME.glassText,
    flex: 1,
    height: 50,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  orderButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: GLASS_THEME.lightBlue,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 100,
    height: 50,
    flex: 1,
    shadowColor: GLASS_THEME.lightBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  orderButtonText: {
    color: GLASS_THEME.white,
    fontWeight: "700",
    fontSize: 14,
  },
});

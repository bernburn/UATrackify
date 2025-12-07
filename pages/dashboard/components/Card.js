import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Linking } from "react-native";

import { useState } from "react";
import axios from "axios";

import { colors } from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";

// --- GLASS THEME COLORS (Matching Dashboard & Admin Page) ---
const GLASS_THEME = {
  glassSurface: "rgba(255, 255, 255, 0.85)", // More opaque for readability
  glassText: "#001e66", // Dark text on light glass (matching AdminDashboard)
  secondaryText: "rgba(0, 30, 102, 0.7)", // Semi-transparent dark text
  tertiaryText: "rgba(0, 30, 102, 0.5)", // Light dark text
  glassBorder: "rgba(0, 30, 102, 0.3)", // Dark blue border
  darkBlue: "#005BCC",
  lightBlue: "#007AFF",
  white: "#FFFFFF",
};

export default function Card({
  id,
  title,
  organization,
  eventDate,
  statusOverall,
  contactPerson,
  attachedDocument,
  dateAdded,
  onPress,
}) {
  let documentName = attachedDocument ? attachedDocument.split("/").pop() : "";
  console.log(documentName);

  // If you want to show the name without extension, uncomment below:
  let documentNameOnly = documentName.split(".").shift();

  const statusColor = [
    statusOverall == "Pending"
      ? { color: "#9c7815ff" }
      : { color: "#158d11ff" },
  ];

  const handleDownload = async (documentName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/download/${documentName}/`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", documentName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);
  return (
    <Pressable onPress={() => setIsPressed(!isPressed)}>
      <View
        style={[
          styles.card,
          { transitionProperty: "height", transitionDuration: 300 },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardOrg}>{organization}</Text>
        </View>
        {isPressed ? (
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>
              Contact Person: {contactPerson}
            </Text>
            <Text style={styles.cardBodyText}>Event Date: {eventDate}</Text>
            <View style={styles.attachRow}>
              <Text style={styles.attachLabel}>Attached Document:</Text>
              {attachedDocument ? (
                Platform.OS === "web" ? (
                  <span
                    onClick={() => handleDownload(documentName)}
                    style={{
                      color: GLASS_THEME.lightBlue,
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "600",
                      marginLeft: 6,
                    }}
                  >
                    {documentNameOnly}
                  </span>
                ) : (
                  <Pressable onPress={() => Linking.openURL(attachedDocument)}>
                    <Text style={styles.attachLink}>{documentNameOnly}</Text>
                  </Pressable>
                )
              ) : null}
            </View>
            <Text style={styles.cardBodyText}>
              Overall Status: <Text style={statusColor}>{statusOverall}</Text>
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditForm", {
                  id: id,
                  eventName: title,
                  contactPerson: contactPerson,
                  eventDate: eventDate,
                  organization: organization,
                })
              }
            >
              <Text style={styles.editButtonText}>Edit Form</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>
              Overall Status: <Text style={statusColor}>{statusOverall}</Text>
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Entry ID: {id}</Text>
          <Text style={styles.cardFooterText}>Click for more details</Text>
          <Text style={styles.cardFooterText}>Date Added: {dateAdded}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: GLASS_THEME.glassSurface,
    padding: 20,
    width: Platform.OS === "web" ? "90%" : 350,
    maxWidth: Platform.OS === "web" ? 450 : 350,
    minWidth: Platform.OS === "web" ? 200 : 350,
    borderRadius: 20,
    marginBottom: 32,
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: Platform.OS === "web" ? 20 : 18,
    fontWeight: "bold",
    color: GLASS_THEME.glassText,
  },
  cardOrg: {
    fontSize: Platform.OS === "web" ? 16 : 14,
    color: GLASS_THEME.secondaryText,
    fontStyle: "italic",
    fontWeight: "600",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardBodyText: {
    fontSize: Platform.OS === "web" ? 17 : 16,
    color: GLASS_THEME.glassText,
    marginBottom: 8,
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: GLASS_THEME.glassBorder,
    paddingTop: 12,
  },
  cardFooterText: {
    fontSize: Platform.OS === "web" ? 13 : 12,
    fontStyle: "italic",
    color: GLASS_THEME.tertiaryText,
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ffd800",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GLASS_THEME.lightBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  editButtonText: {
    color: "#001e66",
    fontSize: 16,
    fontWeight: "700",
  },
  attachRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  attachLabel: {
    fontSize: Platform.OS === "web" ? 17 : 16,
    color: GLASS_THEME.glassText,
    marginRight: 6,
    fontWeight: "400",
  },
  attachLink: {
    color: GLASS_THEME.lightBlue,
    textDecorationLine: "underline",
    fontWeight: "400",
    fontSize: Platform.OS === "web" ? 17 : 16,
  },
});

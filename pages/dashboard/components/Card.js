import { View, Text, StyleSheet, Pressable, Button } from "react-native";

import { useState } from "react";

import { colors } from "../../../styles/colors";
import { useNavigation } from "@react-navigation/native";

export default function Card({
  id,
  title,
  organization,
  eventDate,
  statusOverall,
  contactPerson,
  attachedDocument,
  onPress,
}) {
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
            <Text>Attached Document: {attachedDocument}</Text>
            <Text style={styles.cardBodyText}>
              Overall Status: {statusOverall}
            </Text>
            <Button
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
              Test Button
            </Button>
          </View>
        ) : (
          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>
              Overall Status: {statusOverall}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Entry ID: {id}</Text>
          <Text style={styles.cardFooterText}>Click for more details</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    width: 350,
    borderRadius: 8,
    marginBottom: 32,
    marginLeft: "auto",
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  cardOrg: {
    fontSize: 14,
    color: colors.secondary,
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
    fontSize: 16,
    color: colors.primary,
  },
  cardFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardFooterText: {
    fontSize: 12,
    fontStyle: "italic",
    color: colors.secondary,
  },
});

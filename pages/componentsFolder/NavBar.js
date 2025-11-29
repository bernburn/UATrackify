import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../../styles/colors";

const stylesNav = StyleSheet.create({
  navBar: {
    height: 80,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  navBarSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default function NavBar() {
  return (
    <View style={stylesNav.navBar}>
      <View>
        <Text style={stylesNav.navBarTitle}>UATrackify</Text>
        <Text style={stylesNav.navBarSubtitle}>Form Tracker</Text>
      </View>
      <View>
        <Text>MENU</Text>
      </View>
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

// --- GLASS THEME COLORS ---
const GLASS_THEME = {
  glassSurface: "rgba(255, 255, 255, 0.85)", // More opaque for readability
  glassText: "#001e66", // Dark text on light glass
  glassBorder: "rgba(0, 30, 102, 0.3)", // Dark blue border
  darkBlue: "#005BCC",
  lightBlue: "#007AFF",
  white: "#FFFFFF",
  softGray: "#E0E5F2",
};

export default function AddForm({ navigation }) {
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [office, setOffice] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      const fetchRole = await AsyncStorage.getItem("role");
      const fetchOffice = await AsyncStorage.getItem("office");
      const fetchOrg = await AsyncStorage.getItem("organization");
      setRole(fetchRole);
      setOffice(fetchOffice);
      setOrg(fetchOrg);
    };
    fetchUserData();
  }, []);
  const ORGANIZATION_CHOICES = [
    "UACSC",
    "INA",
    "ICpEP.se",
    "CHARMS",
    "LEAD",
    "PSYCHSOC",
    "BACC",
    "PIIE",
    "AAA",
    "PICE",
    "CREATE",
    "BATAS",
    "CDW",
    "CRCYC",
    "JPPhA",
    "NSC",
    "BHS-PHS",
    "LTSP",
    "JPIA",
    "MCSA",
    "UASAO",
    "SSITE",
  ];

  const [formData, setFormData] = useState({
    organization: "",
    event_name: "",
    contact_person: "",
    event_date: "",
    attach_document: null,
    status_osa: "NS",
    osa_note: "",
    status_vpaa: "NS",
    vpaa_note: "",
    status_finance: "NS",
    finance_note: "",
    status_vpa: "NS",
    vpa_note: "",
    remarks: "",
  });

  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleWebFileChange = (event) => {
    setErrorMessage("");

    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];

      setFormData({ ...formData, attach_document: file });
      setFileName(file.name);
    } else {
      setFormData({ ...formData, attach_document: null });
      setFileName("");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    if (role === "student") {
      formData.organization = org;
    }

    if (!formData.attach_document) {
      setErrorMessage("Please Fill");
      return;
    }

    const data = new FormData();

    for (const key in formData) {
      if (key !== "attach_document") {
        data.append(key, formData[key] || "");
      }
    }

    data.append(
      "attach_document",
      formData.attach_document,
      formData.attach_document.name
    );

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/Events/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      window.alert("Form and file submitted successfully!");
      navigation.goBack();
    } catch (err) {
      console.error(
        "Error submitting form:",
        err.response ? err.response.data : err.message
      );
      setErrorMessage(
        `Submission Error. Status: ${
          err.response ? err.response.status : "Network Error"
        }. Check console for details.`
      );
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View>
          <Text style={styles.headingOne}>Submit A Form</Text>
        </View>

        {/* Organization selection for admin */}
        {role === "admin" ? (
          <>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Select Organization:
            </Text>
            <select
              style={styles.webSelect}
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
            >
              <option value="">Select Organization</option>
              {ORGANIZATION_CHOICES.map((orgName) => (
                <option key={orgName} value={orgName}>
                  {orgName}
                </option>
              ))}
            </select>
          </>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Organization:"
            value={org}
            editable={false}
          />
        )}

        {/* Standard Text Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Event Name:"
          value={formData.event_name}
          onChangeText={(text) => handleChange("event_name", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Person:"
          value={formData.contact_person}
          onChangeText={(text) => handleChange("contact_person", text)}
        />

        {/* Event Date Picker/Input */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>Event Date (YYYY-MM-DD):</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => handleChange("event_date", e.target.value)}
              style={styles.webDateInput}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="e.g., 2024-12-31 (Mobile: use native picker)"
              value={formData.event_date}
              onChangeText={(text) => handleChange("event_date", text)}
            />
          )}
        </View>

        {/* File Picker Section */}
        <View style={styles.filePickerSection}>
          {Platform.OS === "web" ? (
            <View style={styles.webFileInputContainer}>
              <Text style={styles.statusLabel}>Attach Document:</Text>
              <input
                type="file"
                onChange={handleWebFileChange}
                style={{ display: "block", padding: "10px 0" }}
              />
            </View>
          ) : (
            // Placeholder for native file selection (needs react-native-document-picker)
            <View>
              <Button
                title="Select Document (Mobile)"
                onPress={() => alert("Use DocumentPicker for Mobile")}
              />
            </View>
          )}

          {fileName ? (
            <Text style={styles.fileNameText}>
              File selected: **{fileName}**
            </Text>
          ) : (
            <Text style={styles.fileNameText}>No file selected.</Text>
          )}
        </View>

        {/* Conditional fields for admin and office */}
        {role === "admin" && office === "OSA" && (
          <>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Status OSA:
            </Text>
            <select
              style={styles.webSelect}
              value={formData.status_osa}
              onChange={(e) => handleChange("status_osa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
            <TextInput
              style={styles.input}
              placeholder="OSA Note"
              value={formData.osa_note}
              onChangeText={(text) => handleChange("osa_note", text)}
            />
          </>
        )}
        {role === "admin" && office === "VPAA" && (
          <>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Status VPAA:
            </Text>
            <select
              style={styles.webSelect}
              value={formData.status_vpaa}
              onChange={(e) => handleChange("status_vpaa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
            <TextInput
              style={styles.input}
              placeholder="VPAA Note"
              value={formData.vpaa_note}
              onChangeText={(text) => handleChange("vpaa_note", text)}
            />
          </>
        )}
        {role === "admin" && office === "FINANCE" && (
          <>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Status FINANCE:
            </Text>
            <select
              style={styles.webSelect}
              value={formData.status_finance}
              onChange={(e) => handleChange("status_finance", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
            <TextInput
              style={styles.input}
              placeholder="Finance Note"
              value={formData.finance_note}
              onChangeText={(text) => handleChange("finance_note", text)}
            />
          </>
        )}
        {role === "admin" && office === "VPA" && (
          <>
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Status VPA:
            </Text>
            <select
              style={styles.webSelect}
              value={formData.status_vpa}
              onChange={(e) => handleChange("status_vpa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
            <TextInput
              style={styles.input}
              placeholder="VPA Note"
              value={formData.vpa_note}
              onChangeText={(text) => handleChange("vpa_note", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Remarks (Optional)"
              value={formData.remarks}
              onChangeText={(text) => handleChange("remarks", text)}
            />
          </>
        )}
        {/* For non-admins or other offices, show Remarks only */}
        {!(role === "admin" && office === "VPA") && (
          <TextInput
            style={styles.input}
            placeholder="Remarks (Optional)"
            value={formData.remarks}
            onChangeText={(text) => handleChange("remarks", text)}
          />
        )}

        {/* Error Message Display */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Submit Button Section */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
          >
            <Text style={[styles.buttonText, { color: GLASS_THEME.white }]}>
              Submit Form
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.yellowButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: GLASS_THEME.softGray,
  },
  container: {
    minHeight: "100vh",
    backgroundColor: GLASS_THEME.softGray,
    padding: Platform.OS === "web" ? 40 : 20,
    paddingBottom: 60,
  },
  input: {
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    marginVertical: 10,
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  datePickerContainer: {
    marginVertical: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  datePickerLabel: {
    marginBottom: 10,
    fontWeight: "700",
    color: GLASS_THEME.glassText,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  webDateInput: {
    padding: 12,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 10,
    backgroundColor: GLASS_THEME.white,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
  },
  filePickerSection: {
    marginVertical: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    ...(Platform.OS === "web" && { backdropFilter: "blur(5px)" }),
  },
  fileNameText: {
    marginTop: 12,
    color: GLASS_THEME.glassText,
    fontSize: 14,
    fontWeight: "500",
  },
  statusLabel: {
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  selectInput: {
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.glassSurface,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  webSelect: {
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    borderRadius: 12,
    backgroundColor: GLASS_THEME.white,
    color: GLASS_THEME.glassText,
    fontSize: 16,
    fontWeight: "500",
    width: "100%",
  },
  webFileInputContainer: {
    height: 50,
    justifyContent: "center",
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
  },
  submitButtonContainer: {
    marginVertical: 20,
    marginBottom: 40,
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#001e66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: GLASS_THEME.lightBlue,
    borderWidth: 0,
  },
  secondaryButton: {
    backgroundColor: GLASS_THEME.glassSurface,
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
  },
  yellowButton: {
    backgroundColor: "#ffd800",
    borderWidth: 0,
  },
  deleteButton: {
    backgroundColor: "#cf1a24",
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: GLASS_THEME.glassText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: GLASS_THEME.glassSurface,
    padding: 24,
    borderRadius: 20,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 2,
    borderColor: GLASS_THEME.glassBorder,
    ...(Platform.OS === "web" && { backdropFilter: "blur(10px)" }),
    shadowColor: GLASS_THEME.darkBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: GLASS_THEME.glassText,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: GLASS_THEME.lightBlue,
    marginTop: 10,
    shadowColor: GLASS_THEME.lightBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonText: {
    color: GLASS_THEME.white,
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  headingOne: {
    fontSize: 32,
    fontWeight: "900",
    color: GLASS_THEME.glassText,
    marginBottom: 20,
    textAlign: "center",
  },
});

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { colors } from "../../styles/colors";
import { Picker } from "@react-native-picker/picker";

export default function EditFormPage({ navigation, route }) {
  const routeData = route.params;

  const role = localStorage.getItem("role");
  const office = localStorage.getItem("office");

  const [fileName, setFileName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [editData, setEditData] = useState({
    event_name: "",
    contact_person: "",
    event_date: "",
    attach_document: null,
    organization: "",
  });

  // Snapshot of original data for change detection
  const [originalData, setOriginalData] = useState({});

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  // Fetch event data for autofill
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/Events/${routeData.id}/`
        );
        const data = response.data;

        const filledData = {
          event_name: data.event_name || "",
          contact_person: data.contact_person || "",
          event_date: data.event_date || "",
          attach_document: null,
          organization: data.organization || "",
        };

        setEditData(filledData);
        setOriginalData(filledData); // save snapshot

        if (data.attach_document) {
          const parts = data.attach_document.split("/");
          setFileName(parts[parts.length - 1]);
        }

        if (data.pickerValue) setSelectedValue(data.pickerValue);
      } catch (error) {
        console.error(
          "Error fetching event data:",
          error.response?.data || error
        );
      }
    };

    if (routeData?.id) fetchEvent();
  }, [routeData?.id]);

  // Handle file input on Web
  const handleWebFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEditData({ ...editData, attach_document: file });
      setFileName(file.name);
    } else {
      setEditData({ ...editData, attach_document: null });
      setFileName("");
    }
  };

  // Submit edited data (partial update) with proper change detection
  const putData = async () => {
    const hasChanges =
      (editData.event_name?.trim() || "") !==
        (originalData.event_name?.trim() || "") ||
      (editData.contact_person?.trim() || "") !==
        (originalData.contact_person?.trim() || "") ||
      (editData.event_date?.trim() || "") !==
        (originalData.event_date?.trim() || "") ||
      (editData.organization?.trim() || "") !==
        (originalData.organization?.trim() || "") ||
      editData.attach_document !== null; // file change

    if (!hasChanges) {
      setModalMessage("No changes detected.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
      return; // skip PUT request
    }

    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        if (editData[key] !== null) formData.append(key, editData[key]);
      });

      await axios.put(
        `http://127.0.0.1:8000/api/Events/${routeData.id}/`,
        formData
      );

      setModalMessage("Changes saved successfully!");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);

      setOriginalData({ ...editData }); // update snapshot after save
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Form Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={editData.event_name}
        onChangeText={(text) => handleChange("event_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Person"
        value={editData.contact_person}
        onChangeText={(text) => handleChange("contact_person", text)}
      />

      {/* Date Input */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.datePickerLabel}>Event Date (YYYY-MM-DD):</Text>
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={editData.event_date}
            onChange={(e) => handleChange("event_date", e.target.value)}
            style={styles.webDateInput}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="e.g., 2024-12-31"
            value={editData.event_date}
            onChangeText={(text) => handleChange("event_date", text)}
          />
        )}
      </View>

      {/* File Upload */}
      <View style={styles.filePickerSection}>
        {Platform.OS === "web" ? (
          <div>
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
              Attach Document:
            </Text>
            <input type="file" onChange={handleWebFileChange} />
          </div>
        ) : (
          <Button
            title="Select Document (Mobile)"
            onPress={() => alert("Use DocumentPicker for Mobile")}
          />
        )}

        <Text style={styles.fileNameText}>
          {fileName ? `File selected: ${fileName}` : "No file selected."}
        </Text>
      </View>

      {/* Picker (OSA Admin Only) */}
      {role === "admin" && office === "OSA" ? (
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => setSelectedValue(value)}
        >
          <Picker.Item label="Option 1" value="value1" />
          <Picker.Item label="Option 2" value="value2" />
          <Picker.Item label="Option 3" value="value3" />
        </Picker>
      ) : null}

      {/* Go Back Button */}
      <View style={{ marginVertical: 10 }}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>

      {/* Save Button */}
      <View style={{ marginVertical: 20 }}>
        <Button title="Save" onPress={putData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: "100vh", backgroundColor: colors.surface, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
  datePickerContainer: { marginVertical: 10 },
  datePickerLabel: { marginBottom: 5, fontWeight: "600" },
  webDateInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
  },
  filePickerSection: { marginVertical: 20 },
  fileNameText: { marginTop: 8, color: "#444" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 350,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#1976D2",
  },
  modalButtonText: { color: "white", fontWeight: "600" },
});

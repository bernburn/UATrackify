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
  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const routeData = route.params;

  const role = localStorage.getItem("role");
  const office = localStorage.getItem("office");

  const [fileName, setFileName] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [editData, setEditData] = useState({
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
          organization: data.organization || "",
          event_name: data.event_name || "",
          contact_person: data.contact_person || "",
          event_date: data.event_date || "",
          attach_document: null,
          status_osa: data.status_osa || "NS",
          osa_note: data.osa_note || "",
          status_vpaa: data.status_vpaa || "NS",
          vpaa_note: data.vpaa_note || "",
          status_finance: data.status_finance || "NS",
          finance_note: data.finance_note || "",
          status_vpa: data.status_vpa || "NS",
          vpa_note: data.vpa_note || "",
          remarks: data.remarks || "",
        };

        setEditData(filledData);
        setOriginalData(filledData); // save snapshot

        if (data.attach_document) {
          const parts = data.attach_document.split("/");
          setFileName(parts[parts.length - 1]);
        }
      } catch (error) {
        console.error(
          "Error fetching event data:",
          error.response?.data || error
        );
        setModalMessage("Failed to load event data.");
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
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
  // Delete function for admin
  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/Events/${routeData.id}/`);
      setShowDeleteConfirm(false);
      setModalMessage("Event deleted successfully!");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setShowDeleteConfirm(false);
      setModalMessage("Delete failed.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };
  const putData = async () => {
    const hasChanges = Object.keys(editData).some(
      (key) =>
        (editData[key]?.trim?.() ?? editData[key]) !==
        (originalData[key]?.trim?.() ?? originalData[key])
    );

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
      setModalMessage("Update failed.");
      setModalVisible(true);
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Delete Confirmation Modal (only for admin) */}
      {role === "admin" && (
        <Modal
          visible={showDeleteConfirm}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete this form?
              </Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
                <Pressable style={styles.modalButton} onPress={handleDelete}>
                  <Text style={styles.modalButtonText}>Yes, Delete</Text>
                </Pressable>
                <Pressable
                  style={styles.modalButton}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
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

      {/* Conditional fields for admin and office */}
      {role === "admin" && office === "OSA" && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status OSA:</Text>
          {Platform.OS === "web" ? (
            <select
              style={{ ...styles.webDateInput, marginBottom: 10 }}
              value={editData.status_osa}
              onChange={(e) => handleChange("status_osa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_osa}
              onValueChange={(value) => handleChange("status_osa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="OSA Note"
            value={editData.osa_note}
            onChangeText={(text) => handleChange("osa_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "VPAA" && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            Status VPAA:
          </Text>
          {Platform.OS === "web" ? (
            <select
              style={{ ...styles.webDateInput, marginBottom: 10 }}
              value={editData.status_vpaa}
              onChange={(e) => handleChange("status_vpaa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_vpaa}
              onValueChange={(value) => handleChange("status_vpaa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="VPAA Note"
            value={editData.vpaa_note}
            onChangeText={(text) => handleChange("vpaa_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "FINANCE" && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            Status FINANCE:
          </Text>
          {Platform.OS === "web" ? (
            <select
              style={{ ...styles.webDateInput, marginBottom: 10 }}
              value={editData.status_finance}
              onChange={(e) => handleChange("status_finance", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_finance}
              onValueChange={(value) => handleChange("status_finance", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="Finance Note"
            value={editData.finance_note}
            onChangeText={(text) => handleChange("finance_note", text)}
          />
        </>
      )}
      {role === "admin" && office === "VPA" && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status VPA:</Text>
          {Platform.OS === "web" ? (
            <select
              style={{ ...styles.webDateInput, marginBottom: 10 }}
              value={editData.status_vpa}
              onChange={(e) => handleChange("status_vpa", e.target.value)}
            >
              <option value="NS">Not Started</option>
              <option value="IP">In Progress</option>
              <option value="C">Completed</option>
            </select>
          ) : (
            <Picker
              selectedValue={editData.status_vpa}
              onValueChange={(value) => handleChange("status_vpa", value)}
            >
              <Picker.Item label="Not Started" value="NS" />
              <Picker.Item label="In Progress" value="IP" />
              <Picker.Item label="Completed" value="C" />
            </Picker>
          )}
          <TextInput
            style={styles.input}
            placeholder="VPA Note"
            value={editData.vpa_note}
            onChangeText={(text) => handleChange("vpa_note", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks (Optional)"
            value={editData.remarks}
            onChangeText={(text) => handleChange("remarks", text)}
          />
        </>
      )}
      {/* For non-admins or other offices, show Remarks only */}
      {!(role === "admin" && office === "VPA") && (
        <TextInput
          style={styles.input}
          placeholder="Remarks (Optional)"
          value={editData.remarks}
          onChangeText={(text) => handleChange("remarks", text)}
        />
      )}
      {/* Go Back Button */}
      <View style={{ marginVertical: 10, flexDirection: "row", gap: 10 }}>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
        {role === "admin" && (
          <Button
            title="Delete"
            color="#E53935"
            onPress={() => setShowDeleteConfirm(true)}
          />
        )}
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

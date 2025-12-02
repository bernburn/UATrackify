import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import axios from "axios";

export default function AddForm({ navigation }) {
  const org = localStorage.getItem("organization");
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
  const role = localStorage.getItem("role");
  const office = localStorage.getItem("office");
  const [formData, setFormData] = useState({
    organization: org,
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
    <View style={styles.container}>
      <View style={{}}>
        <Text style={{}}>Submit A Form:</Text>
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
          value={formData.organization}
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
            <Text style={{ marginBottom: 5, fontWeight: "bold" }}>
              Attach Document:
            </Text>
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
          <Text style={styles.fileNameText}>File selected: **{fileName}**</Text>
        ) : (
          <Text style={styles.fileNameText}>No file selected.</Text>
        )}
      </View>

      {/* Conditional fields for admin and office */}
      {role === "admin" && office === "OSA" && (
        <>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status OSA:</Text>
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
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Status VPA:</Text>
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
        <Button title="Submit Form" onPress={handleSubmit} />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownLabel: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  webSelect: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "white",
    appearance: "none",
    fontSize: 16,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePickerLabel: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 14,
  },
  webDateInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "white",
    fontSize: 16,
  },
  filePickerSection: {
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  webFileInputContainer: {
    height: 50,
    justifyContent: "center",
  },
  fileNameText: {
    marginTop: 5,
    fontSize: 12,
    color: "#555",
  },
  submitButtonContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
});

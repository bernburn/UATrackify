import React, { useState } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    TouchableOpacity, // For the dropdown button
    Modal,          // For the overlay selection menu
    FlatList,       // For the scrollable list of choices
    SafeAreaView,   // To keep the list within bounds
    Image 
} from "react-native";
import styles from "../../styles/styles"; 
import favicon from "../../assets/favicon.png";
import axios from "axios"; 

// 🚨 PLACEHOLDER (Replace with actual import if using native)
const AsyncStorage = {
    setItem: async (key, value) => { console.log(`AsyncStorage SET: ${key} = ${value}`); },
    getItem: async (key) => { return null; }
};

// 🎯 LIST OF 22 ORGANIZATION CHOICES
const ORGANIZATION_CHOICES = [
    "UACSC", "INA", "ICpEP.se", "CHARMS",
    "LEAD", "PSYCHSOC", "BACC", "PIIE",
    "AAA", "PICE", "CREATE", "BATAS",
    "CDW", "CRCYC", "JPPhA", "NSC",
    "BHS-PHS", "LTSP", "JPIA", "MCSA",
    "UASAO", "SSITE",
];

export default function RegisterPage({ navigation }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // 🎯 Organization state now holds the selected value
    const [organization, setOrganization] = useState(""); 
    
    const [error, setError] = useState(""); 
    const [isModalVisible, setIsModalVisible] = useState(false); // Dropdown visibility state
    const role = "student"; 

    const handleSelectOrganization = (item) => {
        setOrganization(item);
        setIsModalVisible(false);
    };

    // --- Dropdown Item Renderer ---
    const renderOrganizationItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => handleSelectOrganization(item)}
        >
            <Text style={styles.dropdownItemText}>{item}</Text>
        </TouchableOpacity>
    );

    const handleRegister = () => {
        setError("");
        
        if (!firstName || !lastName || !email || !password || !organization) {
            setError("Please fill in all required fields, including Organization.");
            return;
        }

        // 1. Collect all registration data
        const registrationData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            organization: organization, 
            role: role, 
            username: email, 
        };
        
        // 2. Pass all collected data via route.params
        navigation.navigate("ReviewUserInfo", registrationData); 
    };

    return (
        <View style={styles.container}>
            <View style={styles.registerCard}>
            <Text style={styles.title}>Register</Text>
            
            {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

            <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            
            {/* 🎯 DROPDOWN FIELD START */}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>
                    {organization || "Select Organization"}
                </Text>
            </TouchableOpacity>
            {/* 🎯 DROPDOWN FIELD END */}

            <View style={styles.roleField}>
                <Text style={{ fontSize: 16, color: "#7b7979ff", fontWeight: "bold", }}>Role: {role}</Text>
            </View>
            
            <View style={styles.reviewButtonWrapper}>
    <Button title="Review & Confirm" onPress={handleRegister} />
</View>
 

            <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.registerLink}>Back to Login</Text>
</TouchableOpacity>


            {/* 🎯 MODAL FOR SCROLLABLE DROPDOWN */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)} // Dismiss modal when tapping outside
                >
                    <View style={styles.dropdownContainer}>
                        <SafeAreaView style={styles.dropdownListWrapper}>
                            <FlatList
                                data={ORGANIZATION_CHOICES}
                                renderItem={renderOrganizationItem}
                                keyExtractor={(item) => item}
                                // FlatList is scrollable by default
                            />
                        </SafeAreaView>
                        <Button title="Close" onPress={() => setIsModalVisible(false)} />
                    </View>
                </TouchableOpacity>
            </Modal>
            </View>
        </View>
    );
}
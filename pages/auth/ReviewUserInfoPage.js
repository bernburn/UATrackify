import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    TouchableOpacity, 
    Modal, 
    FlatList, 
    SafeAreaView 
} from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is imported for real use
import styles from "../../styles/styles";
import axios from "axios";

// 🚨 PLACEHOLDER (Replace with actual import if using native)
const AsyncStorage = {
    setItem: async (key, value) => { console.log(`AsyncStorage SET: ${key} = ${value}`); },
    getItem: async (key) => { return null; }
};

// 🎯 LIST OF 22 ORGANIZATION CHOICES (Must match RegisterPage)
const ORGANIZATION_CHOICES = [
    "UACSC", "INA", "ICpEP.se", "CHARMS",
    "LEAD", "PSYCHSOC", "BACC", "PIIE",
    "AAA", "PICE", "CREATE", "BATAS",
    "CDW", "CRCYC", "JPPhA", "NSC",
    "BHS-PHS", "LTSP", "JPIA", "MCSA",
    "UASAO", "SSITE",
];


export default function ReviewUserInfoPage({ navigation, route }) {
    
    const params = route.params || {};
    
    // Auth and Profile Data initialization from route.params
    const [email, setEmail] = useState(params.email || "");
    const [role, setRole] = useState(params.role || "");
    const [password, setPassword] = useState(params.password || ""); 

    const [firstName, setFirstName] = useState(params.first_name || ""); 
    const [lastName, setLastName] = useState(params.last_name || ""); 
    
    // 🎯 Organization state initialized from params
    const [organization, setOrganization] = useState(params.organization || ""); 
    
    // Auth Data (will be populated AFTER successful POST/LOGIN)
    const [userId, setUserId] = useState("");
    const [authToken, setAuthToken] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Review and confirm your information to create your account.");
    const [authMissing, setAuthMissing] = useState(false); 
    
    // 🎯 State for dropdown visibility
    const [isModalVisible, setIsModalVisible] = useState(false); 

    // --- Dropdown Handlers ---
    const handleSelectOrganization = (item) => {
        setOrganization(item);
        setIsModalVisible(false);
    };
    
    const renderOrganizationItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.dropdownItem} 
            onPress={() => handleSelectOrganization(item)}
        >
            <Text style={styles.dropdownItemText}>{item}</Text>
        </TouchableOpacity>
    );
    // -------------------------


    // --- FUNCTION: Log in the user immediately after registration POST ---
    const loginUser = async (userEmail, userPassword) => {
        try {
            const loginResponse = await axios.post("http://127.0.0.1:8000/auth/token/login/", {
                email: email, 
                password: userPassword
            });

            // CRITICAL: Save the authentication data
            await AsyncStorage.setItem('authToken', loginResponse.data.auth_token);
            await AsyncStorage.setItem("user_id", loginResponse.data.user_id ? loginResponse.data.user_id.toString() : '');
            await AsyncStorage.setItem("email", loginResponse.data.email);
            await AsyncStorage.setItem("role", loginResponse.data.role);

            return {
                user_id: loginResponse.data.user_id,
                authToken: loginResponse.data.auth_token,
            };

        } catch (loginError) {
            console.error('Auto-Login Failed:', loginError.response ? loginError.response.data : loginError.message);
            setMessage("Account created, but failed to log you in. Please log in manually.");
            setAuthMissing(true); 
            return null;
        }
    };
    // -------------------------------------------------------------------

    // 🎯 FUNCTION: Handles the INITIAL USER CREATION (POST)
    const handleUpdateAndProceed = async () => {
        setIsLoading(true);
        setMessage("Creating account...");

        const registrationData = {
            first_name: firstName,
            last_name: lastName,
            email: email, 
            password: password, 
            organization: organization, // 🎯 Use the state value
            role: role, 
            username: email, 
        };

        try {
            // 1. PERFORM THE INITIAL USER CREATION (POST REQUEST)
            await axios.post("http://127.0.0.1:8000/api/Users/", registrationData); 
            
            setMessage("Account created successfully. Logging in...");
            
            // 2. Immediately log in to get tokens
            const credentials = await loginUser(email, password);

            if (credentials && credentials.authToken && credentials.user_id) {
                setAuthToken(credentials.authToken);
                setUserId(credentials.user_id);
                
                setMessage("Profile ready! Redirecting to Dashboard...");
                
                // 3. Navigate to the Dashboard
                setTimeout(() => navigation.navigate("Dashboard"), 500);

            } else {
                // Login failed, stop and force manual login
                navigation.navigate("Login");
            }

        } catch (error) {
            console.error('Error during initial registration POST:', error.response ? error.response.data : error.message);
            
            let errorMessage = "Registration failed. Check your data or server connection.";
            if (error.response && error.response.data.email) {
                 errorMessage = `Registration failed: ${error.response.data.email[0]}`;
            }
            if (error.response && error.response.data.username) {
                 errorMessage = `Registration failed: Username/Email already exists.`;
            }
            setMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Fallback check for already logged-in users on reload ---
    useEffect(() => {
        const checkExistingAuth = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const id = await AsyncStorage.getItem("user_id");
            if (token && id) {
                 setAuthToken(token);
                 setUserId(id);
                 setMessage("You are already logged in. Click confirm to finalize this profile.");
            }
        };
        checkExistingAuth();
    }, []);
    // -----------------------------------------------------------

    return (
        <View style={styles.container}>
            <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>Review Your Information</Text>

            <Text style={{ color: authMissing ? 'red' : (isLoading ? 'blue' : 'black'), marginBottom: 16 }}>
                {message}
            </Text>
            
            {authMissing && (
                <Button
                    title="Go to Login Page"
                    onPress={() => navigation.navigate("Login")}
                    color="red"
                />
            )}

            <View pointerEvents={authMissing ? 'none' : 'auto'} style={{ opacity: authMissing ? 0.5 : 1 }}>

                <TextInput
                    style={styles.reviewInput}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    editable={!authMissing}
                />
                <TextInput
                    style={styles.reviewInput}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    editable={!authMissing}
                />
                <TextInput
                    style={[styles.reviewInput, { backgroundColor: '#fff' }]} 
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!authMissing} 
                />
                
                {/* 🎯 DROPDOWN FIELD START */}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsModalVisible(true)}
                    disabled={authMissing}
                >
                    <Text style={styles.dropdownButtonText}>
                        {organization || "Select Organization"}
                    </Text>
                </TouchableOpacity>
                {/* 🎯 DROPDOWN FIELD END */}

                <View style={styles.roleField}>
                    <Text style={{ fontSize: 16, color: "#333", fontWeight: 'bold' }}>Role: {role}</Text>
                </View>

                <View style={styles.reviewButtonWrapper}>
                <Button
                    title={isLoading ? "Processing..." : "Confirm & Create Account"}
                    onPress={handleUpdateAndProceed}
                    disabled={isLoading || !firstName || !lastName || !email || !password || !organization || authMissing}
                />
                </View>
            </View>

            {/* 🎯 MODAL FOR SCROLLABLE DROPDOWN (Copied from RegisterPage) */}
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
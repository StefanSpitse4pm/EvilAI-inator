import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";

const API_BASE_URL = 'http://141.252.152.178:8000';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [voornaam, setVoornaam] = useState("");
    const [achternaam, setAchternaam] = useState("");
    const [error, setError] = useState("");

    const [isRegister, setIsRegister] = useState(false);

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }
        // Add authentication logic here
        setError("");
        // Example: navigate to home screen or show success
    };

    const handleRegister = async() => {
        if (!email || !password) {
            setError("Please enter email and password.");
            return;
        }

        if (!voornaam) {
            setError("Voer een voornaam in.")
            return;
        }

        if (!achternaam) {
            setError("Voer een achternaam in.")
            return;
        }



        const response = await fetch(`${API_BASE_URL}/user/`, {
            method: "POST",
            headers: {
                'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3b29Ad29vLmNvbSIsImV4cCI6NTM0OTE1NzE3OX0.uQxzGCNAuxY0n2pbIHz3cmuYwmgdm5BCY1ao3cTHSLs',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "Voornaam":voornaam,
                "Achternaam":achternaam,
                "Email":email,
                "Wachtwoord":password,
            })
        });
        
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            setError(data.detail[0].msg);
        }

        
    }
    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}>
            {!isRegister ? (
                <>
                    <View style={styles.container}>
                        <Text style={styles.title}>Login</Text>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address" />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry />
                        <Button title="Login" onPress={handleLogin} />
                    </View>
                    <Text
                        style={styles.link}
                        onPress={() => setIsRegister(true)}
                    >
                        Don't have an account? Register here
                    </Text>
                </>
            ) : (
                <>
                    <View style={styles.container}>
                        <Text style={styles.title}>Register</Text>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Voornaam"
                            value={voornaam}
                            onChangeText={setVoornaam}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Achternaam"
                            value={achternaam}
                            onChangeText={setAchternaam}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address" />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry />
                        <Button title="Register" onPress={handleRegister} />
                    </View>
                    <Text
                        style={styles.link}
                        onPress={() => setIsRegister(false)}
                    >
                        Already have an account? Login here
                    </Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    error: {
        color: "red",
        marginBottom: 16,
        textAlign: "center",
    },
    link: {
        color: "#007bff",
        marginTop: 16,
        textAlign: "center",
        textDecorationLine: "underline",
    },
});

export default Login;
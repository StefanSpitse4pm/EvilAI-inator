import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../context/AuthContext'

const API_BASE_URL = 'https://api.tobiasschipper.tech';

const Login = () => {
    const { token } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [voornaam, setVoornaam] = useState("");
    const [achternaam, setAchternaam] = useState("");
    const [error, setError] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const { signIn } = useContext(AuthContext);

    const handleLogin = async() => {
        if (!email || !password) {
            setError("Please enter email and password."); 
            return;
        }
        const response = await fetch(`${API_BASE_URL}/login`,   {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "Email":email,
                    "Wachtwoord":password
                })
            }
        )
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            setError(data.detail[0].msg)
        } else {
            
            signIn(data)
        }

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
                'Authorization':`Bearer ${token}`,
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
        } else {
            setIsRegister(false)
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
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Achternaam"
                            value={achternaam}
                            onChangeText={setAchternaam}
                            autoCapitalize="none"
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
        color: '#000'
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
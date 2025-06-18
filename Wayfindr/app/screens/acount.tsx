import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from "react-native";

const AcountScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuleer async data ophalen
    const fetchData = async () => {
      try {
        // Bijvoorbeeld: await fetch("https://jouw-api.com/user/123");
        // Voor nu dummy data:
        const data = {
          name: "Jan de Vries",
          studentNumber: "123456",
          avatarUrl: "https://via.placeholder.com/150",
        };
        setUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Kon geen data laden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
        <Text style={styles.label}>Naam</Text>
        <Text style={styles.value}>{userData.name}</Text>

        <Text style={styles.label}>Studentnummer</Text>
        <Text style={styles.value}>{userData.studentNumber}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderWidth: 2,
    borderColor: "blue",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "blue",
  },
  label: {
    alignSelf: "flex-start",
    color: "blue",
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 10,
  },
  value: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "black",
  },
});

export default AcountScreen;

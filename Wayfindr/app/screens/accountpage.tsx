import React from "react"
import { useState } from "react"
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';

interface UserProfile {
  name: string
  description: string
  profileImage: string | null
}

export default function AccountPage() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    description: "Avontuurlijke reiziger die graag nieuwe plekken ontdekt",
    profileImage: null,
  })
  const [isEditing, setIsEditing] = useState(false)

const handleSave = async () => {
    try {
        // Profieldata voorbereiden
        const data = {
            name: profile.name,
            description: profile.description,
            profileImage: profile.profileImage, // Dit is een URI, upload eventueel eerst!
        };

        // Verstuur naar FastAPI (pas de URL aan)
        const response = await fetch("http://jouw-backend-url/api/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setIsEditing(false);
            Alert.alert("Succes", "Profiel succesvol bijgewerkt!");
        } else {
            Alert.alert("Fout", "Kon profiel niet opslaan.");
        }
    } catch (error) {
        Alert.alert("Fout", "Er ging iets mis.");
    }
};

const handleImagePicker = async () => {
    const ImagePicker = await import("expo-image-picker");

    // Vraag permissie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Toestemming geweigerd", "We hebben toegang tot je foto's nodig.");
        return;
    }

    // Open de image picker
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfile({ ...profile, profileImage: result.assets[0].uri });
    }
}

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={28} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mijn Account</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="options-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>{isEditing ? "Annuleren" : "Bewerken"}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={isEditing ? handleImagePicker : undefined}
          disabled={!isEditing}
        >
          {profile.profileImage ? (
            <Image source={{ uri: profile.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📷</Text>
              <Text style={styles.placeholderSubtext}>Foto toevoegen</Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.editOverlay}>
              <Text style={styles.editOverlayText}>Wijzigen</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Naam</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Voer je naam in"
                placeholderTextColor="#999"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Beschrijving</Text>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={profile.description}
                onChangeText={(text) => setProfile({ ...profile, description: text })}
                placeholder="Vertel iets over jezelf..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : (
              <Text style={styles.fieldValue}>{profile.description}</Text>
            )}
          </View>
        </View>
      </View>

      {isEditing && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Opslaan</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#3498db",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  profileSection: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#3498db",
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(52, 152, 219, 0.9)",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingVertical: 8,
    alignItems: "center",
  },
  editOverlayText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#2c3e50",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#27ae60",
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

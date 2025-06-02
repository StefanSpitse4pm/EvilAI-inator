import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Homescreen = () => {
  return (
    <ScrollView style={styles.container}>
      
      {/* Blauwe topbar met menu en titel */}
      <View style={styles.topbar}>
        <Text style={styles.topbarIcon}>☰</Text>
        <Text style={styles.topbarTitle}>Wayfindr</Text>
        <View style={{ width: 24 }} /> {/* lege ruimte voor centreren */}
      </View>

      {/* Welkomstbericht */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Welkom bij NHL Stenden</Text>
      </View>

      {/* Agenda en Event Feed naast elkaar */}
      <View style={styles.contentRow}>
        
        {/* Agenda */}
        <View style={styles.agenda}>
          <Text style={styles.sectionTitle}>Agenda</Text>

          <View style={styles.agendaItem}>
            <Text style={styles.bold}>Afspraak: Atelier</Text>
            <Text>📍 1.016</Text>
          </View>

          <View style={styles.agendaItem}>
            <Text style={styles.bold}>Les: OOP 1.5</Text>
            <Text>📍 1.035</Text>
          </View>
        </View>

        {/* Event Feed */}
        <View style={styles.eventFeed}>
          <Text style={styles.sectionTitle}>Event Feed</Text>

          <View style={[styles.eventBox, { backgroundColor: "blue", borderColor: "blue" }]} />
          <View style={[styles.eventBox, { backgroundColor: "red", borderColor: "red" }]} />
          <View style={[styles.eventBox, { backgroundColor: "green", borderColor: "green" }]} />
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#005EB8",
    padding: 16,
  },
  topbarIcon: {
    color: "#fff",
    fontSize: 24,
  },
  topbarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcome: {
    backgroundColor: "#ccc",
    padding: 60,
    margin: 16,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "justify",
  },
  contentRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  agenda: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
  },
  agendaItem: {
    backgroundColor: "#aaa",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  eventFeed: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 20,
    marginLeft: 8,
  },
  eventBox: {
    height: 90,
    marginVertical: 5,
    borderWidth: 2,
    
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default Homescreen;

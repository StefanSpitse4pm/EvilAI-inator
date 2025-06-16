import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const agendaData = [
  { title: "Afspraak: Atelier", location: "1.016" },
  { title: "Les: OOP 1.5", location: "1.035" },
  { title: "Projectoverleg", location: "1.012" },
  { title: "Reflectie moment", location: "1.020" },
];

const eventFeedData = [
  { id: 1, type: "nu", title: "Gastcollege UX" },
  { id: 2, type: "info", title: "Hackathon vrijdag" },
  { id: 3, type: "info", title: "Deadline Portfolio" },
];

const Homescreen = () => {
  return (
    <ScrollView style={styles.container}>
      
      {/* Welkomstbericht */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Welkom bij NHL Stenden</Text>
      </View>

      {/* Agenda en Event Feed naast elkaar */}
      <View style={styles.contentRow}>
        
        {/* Agenda */}
        <View style={styles.agenda}>
          <Text style={styles.sectionTitle}>Agenda</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {agendaData.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.agendaItem}>
                <Text style={styles.bold}>{item.title}</Text>
                <Text>📍 {item.location}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Event Feed */}
        <View style={styles.eventFeed}>
          <Text style={styles.sectionTitle}>Event Feed</Text>
          {eventFeedData.map((event) => (
            <View
              key={event.id}
              style={[
                styles.eventBox,
                event.type === "nu"
                  ? { borderColor: "blue", backgroundColor: "transparent" }
                  : { backgroundColor: "lightgray", borderColor: "gray" },
              ]}
            >
              <Text
                style={{
                  color: event.type === "nu" ? "blue" : "black",
                  fontWeight: "bold",
                }}
              >
                {event.title}
              </Text>
            </View>
          ))}
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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

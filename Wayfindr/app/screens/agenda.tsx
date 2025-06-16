import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';

// Types en constanten
type CategoryType = 'Les' | 'Kick-off' | 'Toets' | 'Activiteit' | 'Assessment';

type Afspraak = {
    id: number;
    title: string;
    time: string;
    date: string;
    category: CategoryType;
    location: string;
};

// Opties en kleuren voor categorieën
const categorieOpties = ['Les', 'Kick-off', 'Toets', 'Activiteit', 'Assessment'];
const categoryColors = {
  'Les': '#9399FF',
  'Kick-off': '#93FFA3',
  'Toets': '#FFA770',
  'Activiteit': '#FFFA70',
  'Assessment': '#FE5858',
};

// Uitleg per categorie
const categorieUitleg = {
  'Les': 'Een reguliere les of college.',
  'Kick-off': 'De start van een project of periode.',
  'Toets': 'Een toetsmoment of examen.',
  'Activiteit': 'Een extra activiteit, zoals een uitje.',
  'Assessment': 'Een beoordeling of presentatie.',
};

// Voorbeelddata voor afspraken
const initialAfspraken: Afspraak[] = [
  { id: 1, title: 'Informatica', time: '10:00', date: '2025-05-28', category: 'Les', location: '' },
  { id: 2, title: 'Project', time: '11:00', date: '2025-05-29', category: 'Kick-off', location: '' },
  { id: 3, title: 'Engels', time: '12:00', date: '2025-05-30', category: 'Toets', location: '' },
  { id: 4, title: 'Sport', time: '13:00', date: '2025-06-01', category: 'Activiteit', location: '' },
  { id: 5, title: 'Presentatie', time: '14:00', date: '2025-06-02', category: 'Assessment', location: '' },
];

export default function Agenda() {
  // State hooks voor afspraken en modals
  const [afspraken, setAfspraken] = useState(initialAfspraken);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAfspraak, setSelectedAfspraak] = useState<Afspraak | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState(categorieOpties[0]);
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryType>(categorieOpties[0] as CategoryType);

  // Open modal om categorie en details van een bestaande afspraak te bewerken
  const openCategorieModal = (afspraak: Afspraak) => {
    setSelectedAfspraak(afspraak);
    setLocationInput(afspraak.location || '');
    setDateInput(afspraak.date || '');
    setNewTime(afspraak.time || '');
    setEditCategory(afspraak.category);
    setModalVisible(true);
  };

  // Verander de categorie van een bestaande afspraak
  const handleCategorieChange = (id: number, newCategory: CategoryType) => {
      setAfspraken(afspraken =>
        afspraken.map(afspraak =>
          afspraak.id === id ? { ...afspraak, category: newCategory } : afspraak
        )
      );
    };

  // Sla wijzigingen in locatie en datum op voor een bestaande afspraak
  const handleSaveLocation = () => {
    if (!selectedAfspraak) return;
    setAfspraken(afspraken =>
      afspraken.map(afspraak =>
        afspraak.id === selectedAfspraak.id
          ? { ...afspraak, location: locationInput, date: dateInput, time: newTime, category : editCategory}
          : afspraak
      )
    );
    setModalVisible(false);
  };

  // Open modal om een nieuwe afspraak toe te voegen
  const openAddModal = () => {
    setNewTitle('');
    setNewTime('');
    setNewCategory(categorieOpties[0]);
    setNewLocation('');
    setAddModalVisible(true);
  };

  // Voeg een nieuwe afspraak toe aan de lijst
  const handleAddAfspraak = () => {
    if (!newTitle || !newTime || !newDate) return;
    const newAfspraak: Afspraak = {
      id: afspraken.length ? afspraken[afspraken.length - 1].id + 1 : 1,
      title: newTitle,
      time: newTime,
      date: newDate,
      category: newCategory as CategoryType,
      location: newLocation,
    };
    setAfspraken([...afspraken, newAfspraak]);
    setAddModalVisible(false);
  };

  // Verwijder een afspraak uit de lijst
  const handleDeleteAfspraak = (id: number) => {
    setAfspraken(afspraken => afspraken.filter(afspraak => afspraak.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header met titel en plus-knop */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Afspraken</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {/* Lijst met afspraken */}
      <FlatList
        data={afspraken}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.afspraak,
            {
              backgroundColor: categoryColors[item.category as CategoryType] || '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          ]}>
            {/* Klikbaar: open bewerk-modal */}
            <TouchableOpacity style={{ flex: 1 }} onPress={() => openCategorieModal(item)}>
              <Text style={styles.titel}>{item.title}</Text>
              <Text>{item.time}</Text>
              <Text>{item.date}</Text>
              <Text style={{ marginTop: 5, fontStyle: 'italic' }}>{item.category}</Text>
              {item.location ? (
                <Text style={{ marginTop: 5, color: '#555' }}>📍 {item.location}</Text>
              ) : null}
            </TouchableOpacity>
            {/* Verwijder-knop */}
            <TouchableOpacity onPress={() => handleDeleteAfspraak(item.id)} style={styles.deleteButton}>
              <Text style={styles.trashIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bewerken modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Selecteer een categorie</Text>
            <Text style={{ color: '#888', marginBottom: 8, fontSize: 13 }}>
              {categorieUitleg[editCategory]}
            </Text>
            <View style={styles.colorPickerContainer}>
              {categorieOpties.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.colorOption,
                    { backgroundColor: categoryColors[opt as CategoryType] },
                    editCategory === opt && styles.selectedColor
                  ]}
                  onPress={() => setEditCategory(opt as CategoryType)}
                >
                </TouchableOpacity>
              ))}
            </View>
            {/* Locatie invoer */}
            <TextInput
              style={styles.locationInput}
              placeholder="Voer locatie in..."
              placeholderTextColor="#888"
              value={locationInput}
              onChangeText={setLocationInput}
            />
            {/* Datum veld met custom kalender */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => setShowCustomCalendar(true)}
            >
              <Text style={{ color: newDate ? '#222' : '#888' }}>
                {newDate ? newDate : 'Datum (bijv. 2025-05-28)'}
              </Text>
            </TouchableOpacity>
            {showCustomCalendar && (
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 10,
                marginVertical: 10,
                elevation: 5,
              }}>
                <Calendar
                  onDayPress={day => {
                    setNewDate(day.dateString);
                    setShowCustomCalendar(false);
                  }}
                  markedDates={{
                    [newDate]: { selected: true, selectedColor: '#007AFF' }
                  }}
                  theme={{
                    backgroundColor: '#fff',
                    calendarBackground: '#fff',
                    textSectionTitleColor: '#222',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#007AFF',
                    dayTextColor: '#222',
                    textDisabledColor: '#d9e1e8',
                    arrowColor: '#007AFF',
                    monthTextColor: '#222',
                  }}
                />
              </View>
            )}

            {/* Tijd kiezen via timepicker */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: newTime ? '#222' : '#888' }}>
                {newTime ? newTime : 'Tijd (bijv. 10:00)'}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={newTime ? new Date(`1970-01-01T${newTime}`) : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                    setNewTime(`${hours}:${minutes}`);
                  }
                }}
              />
            )}
            {/* Annuleren en opslaan knoppen */}
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveLocation} style={styles.saveButton}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Opslaan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toevoegen modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Nieuwe afspraak</Text>
            {/* Titel invoer */}
            <TextInput
              style={styles.locationInput}
              placeholder="Titel"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            {/* Tijd invoer */}
            <TextInput
              style={styles.locationInput}
              placeholder="Tijd (bijv. 10:00)"
              placeholderTextColor="#888"
              value={newTime}
              onChangeText={setNewTime}
            />
            {/* Datum veld met custom kalender */}
            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => setShowCustomCalendar(true)}
            >
              <Text style={{ color: newDate ? '#222' : '#888' }}>
                {newDate ? newDate : 'Datum (bijv. 2025-05-28)'}
              </Text>
            </TouchableOpacity>
            {showCustomCalendar && (
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 10,
                marginVertical: 10,
                elevation: 5,
              }}>
                <Calendar
                  onDayPress={day => {
                    setNewDate(day.dateString);
                    setShowCustomCalendar(false);
                  }}
                  markedDates={{
                    [newDate]: { selected: true, selectedColor: '#007AFF' }
                  }}
                  theme={{
                    backgroundColor: '#fff',
                    calendarBackground: '#fff',
                    textSectionTitleColor: '#222',
                    selectedDayBackgroundColor: '#007AFF',
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#007AFF',
                    dayTextColor: '#222',
                    textDisabledColor: '#d9e1e8',
                    arrowColor: '#007AFF',
                    monthTextColor: '#222',
                  }}
                />
              </View>
            )}
            {/* Categorie uitleg en kleurkeuze */}
            <Text style={{ marginTop: 10, marginBottom: 5, fontWeight: 'bold' }}>Categorie:</Text>
            <Text style={{ color: '#888', marginBottom: 8, fontSize: 13 }}>
              {categorieUitleg[newCategory as CategoryType]}
            </Text>
            <View style={styles.colorPickerContainer}>
              {categorieOpties.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.colorOption,
                    { backgroundColor: categoryColors[opt as CategoryType] },
                    newCategory === opt && styles.selectedColor
                  ]}
                  onPress={() => setNewCategory(opt)}
                />
              ))}
            </View>
            {/* Locatie invoer */}
            <TextInput
              style={styles.locationInput}
              placeholder="Locatie (optioneel)"
              placeholderTextColor="#888"
              value={newLocation}
              onChangeText={setNewLocation}
            />
            {/* Annuleren en toevoegen knoppen */}
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.cancelButton}>
                <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddAfspraak} style={styles.saveButton}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Toevoegen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Stijlen voor de agenda
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: -2 },
  afspraak: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', borderRadius: 8, marginBottom: 10 },
  titel: { fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCC',
    marginHorizontal: 10,
  },
  selectedColor: {
    borderColor: '#007AFF',
    borderWidth: 3,
  },
  locationInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
  },
  saveButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
  trashCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashIcon: {
    fontSize: 18,
    color: '#FF3B30',
  },
});
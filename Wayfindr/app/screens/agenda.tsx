import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';

const categorieOpties = ['Les', 'Kick-off', 'Toets', 'Activiteit', 'Assessment'];
const categoryColors = {
  'Les': '#9399FF',
  'Kick-off': '#93FFA3',
  'Toets': '#FFA770',
  'Activiteit': '#FFFA70',
  'Assessment': '#FE5858',
};

const initialAfspraken = [
  { id: 1, title: 'Informatica', time: '10:00 AM', date: '2025-05-28', category: 'Les', location: '' },
  { id: 2, title: 'Project', time: '11:00 AM', date: '2025-05-29', category: 'Kick-off', location: '' },
  { id: 3, title: 'Engels', time: '12:00 PM', date: '2025-05-30', category: 'Toets', location: '' },
  { id: 4, title: 'Sport', time: '13:00 PM', date: '2025-06-01', category: 'Activiteit', location: '' },
  { id: 5, title: 'Presentatie', time: '14:00 PM', date: '2025-06-02', category: 'Assessment', location: '' },
];

export default function Agenda() {
  const [afspraken, setAfspraken] = useState(initialAfspraken);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAfspraak, setSelectedAfspraak] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState(categorieOpties[0]);
  const [newLocation, setNewLocation] = useState('');
  const [newDate, setNewDate] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

  const openCategorieModal = (afspraak) => {
    setSelectedAfspraak(afspraak);
    setLocationInput(afspraak.location || '');
    setDateInput(afspraak.date || '');
    setModalVisible(true);
  };

  const handleCategorieChange = (id, newCategory) => {
    setAfspraken(afspraken =>
      afspraken.map(afspraak =>
        afspraak.id === id ? { ...afspraak, category: newCategory } : afspraak
      )
    );
  };

  const handleSaveLocation = () => {
    setAfspraken(afspraken =>
      afspraken.map(afspraak =>
        afspraak.id === selectedAfspraak.id
          ? { ...afspraak, location: locationInput, date: dateInput }
          : afspraak
      )
    );
    setModalVisible(false);
  };

  const openAddModal = () => {
    setNewTitle('');
    setNewTime('');
    setNewCategory(categorieOpties[0]);
    setNewLocation('');
    setAddModalVisible(true);
  };

  const handleAddAfspraak = () => {
    if (!newTitle || !newTime || !newDate) return;
    const newAfspraak = {
      id: afspraken.length ? afspraken[afspraken.length - 1].id + 1 : 1,
      title: newTitle,
      time: newTime,
      date: newDate,
      category: newCategory,
      location: newLocation,
    };
    setAfspraken([...afspraken, newAfspraak]);
    setAddModalVisible(false);
  };

  const handleDeleteAfspraak = (id) => {
    setAfspraken(afspraken => afspraken.filter(afspraak => afspraak.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Afspraken</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={afspraken}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.afspraak, { backgroundColor: categoryColors[item.category] || '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => openCategorieModal(item)}>
              <Text style={styles.titel}>{item.title}</Text>
              <Text>{item.time}</Text>
              <Text>{item.date}</Text>
              <Text style={{ marginTop: 5, fontStyle: 'italic' }}>{item.category}</Text>
              {item.location ? (
                <Text style={{ marginTop: 5, color: '#555' }}>📍 {item.location}</Text>
              ) : null}
            </TouchableOpacity>
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
            <View style={styles.colorPickerContainer}>
              {categorieOpties.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.colorOption,
                    { backgroundColor: categoryColors[opt] },
                    selectedAfspraak?.category === opt && styles.selectedColor
                  ]}
                  onPress={() => handleCategorieChange(selectedAfspraak.id, opt)}
                />
              ))}
            </View>
            <TextInput
              style={styles.locationInput}
              placeholder="Voer locatie in..."
              placeholderTextColor="#888"
              value={locationInput}
              onChangeText={setLocationInput}
            />
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

            <TouchableOpacity
              style={styles.locationInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: newTime ? '#222' : '#888' }}>
                {newTime ? newTime : 'Tijd (bijv. 10:00 AM)'}
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
            <TextInput
              style={styles.locationInput}
              placeholder="Titel"
              placeholderTextColor="#888"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.locationInput}
              placeholder="Tijd (bijv. 10:00 AM)"
              placeholderTextColor="#888"
              value={newTime}
              onChangeText={setNewTime}
            />
            <TextInput
              style={styles.locationInput}
              placeholder="Datum (bijv. JJJJ-MM-DD)"
              placeholderTextColor="#888"
              value={dateInput}
              onChangeText={setDateInput}
            />
            <Text style={{ marginTop: 10, marginBottom: 5 }}>Categorie:</Text>
            <View style={styles.colorPickerContainer}>
              {categorieOpties.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.colorOption,
                    { backgroundColor: categoryColors[opt] },
                    newCategory === opt && styles.selectedColor
                  ]}
                  onPress={() => setNewCategory(opt)}
                />
              ))}
            </View>
            <TextInput
              style={styles.locationInput}
              placeholder="Locatie (optioneel)"
              placeholderTextColor="#888"
              value={newLocation}
              onChangeText={setNewLocation}
            />
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
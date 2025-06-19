import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { toast } from 'sonner-native';
import SlideMenu from './sidemenu';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native';
import { useTheme } from '../Theme/ThemeContext';
import { AuthContext } from '@/context/AuthContext';

const API_BASE_URL = 'http://141.252.152.11:8000';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

const colorOptions = ['#9399FF', '#93FFA3', '#FFA770', '#FFFA70', '#FE5858', '#005aa7'];

export default function Notities() {
  const { colors } = useTheme(); // Use theme context
  const { token } = useContext(AuthContext); // Get token from context

  const styles = getStyles(colors);

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  // Fetch all notes from API
  const loadNotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/note`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      // Map backend fields to frontend Note interface
      setNotes(
        data.map((n: any) => ({
          id: n.id.toString(),
          title: n.title,
          content: n.note,
          date: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
          color: n.color,
        }))
      );
    } catch (error) {
      toast.error('Failed to load notes');
    }
  };

  // Save or update note via API
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const notePayload = {
      title: title.trim(),
      content: content.trim(),
      color,
    };

    try {
      let response;
      if (editingId) {
        // Update existing note
        response = await fetch(`${API_BASE_URL}/note`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ ...notePayload, id: Number(editingId) }),
        });
      } else {
        // Create new note
        response = await fetch(`${API_BASE_URL}/note`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(notePayload),
        });
      }
      if (!response.ok) throw new Error('Failed to save note');
      await loadNotes();
      resetForm();
      toast.success(editingId ? 'Note updated successfully' : 'Note saved successfully');
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  // Delete note via API
  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/note/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete note');
      await loadNotes();
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const startEditing = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || '#FFFFFF');
    setEditingId(note.id);
    setIsCreating(true);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setColor('#FFFFFF');
    setEditingId(null);
    setIsCreating(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mijn Notities</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setIsCreating(true);
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isCreating ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View entering={FadeInUp} exiting={FadeOutDown} style={[styles.createNoteContainer]}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Note Title"
                  placeholderTextColor={colors.background === '#f8f9fa' ? '#888' : colors.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={50}
                />
                <TextInput
                  style={styles.contentInput}
                  placeholder="Write your note here..."
                  placeholderTextColor={colors.background === '#f8f9fa' ? '#888' : colors.textSecondary}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                />
                <View style={styles.colorPickerContainer}>
                  {colorOptions.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.colorOption, { backgroundColor: c }, c === color && styles.selectedColor]}
                      onPress={() => setColor(c)}
                    />
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetForm}>
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveNote}>
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Save</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView style={styles.notesList}>
          {notes.length === 0 ? (
            <Text style={styles.emptyText}>No notes yet. Create one!</Text>
          ) : (
            notes.map((note) => (
              <TouchableOpacity key={note.id} onPress={() => startEditing(note)} activeOpacity={0.9}>
                <Animated.View entering={FadeInUp} style={[styles.noteCard, { backgroundColor: note.color || '#FFFFFF' }]}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle}>{note.title}</Text>
                    <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noteContent}>{note.content}</Text>
                  <Text style={styles.noteDate}>{note.date}</Text>
                </Animated.View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <SlideMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: colors.background === '#f8f9fa' ? '#005aa7' : colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      flex: 1,
      textAlign: 'center',
    },
    menuButton: {
      padding: 8,
    },
    addButton: {
      padding: 4,
    },
    createNoteContainer: {
      backgroundColor: colors.card,
      padding: 16,
      margin: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    titleInput: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
      padding: 8,
      backgroundColor: colors.background === '#f8f9fa' ? '#ededed' : '#181a20', 
      color: colors.text,
      borderRadius: 8,
    },
    contentInput: {
      fontSize: 16,
      minHeight: 150,
      padding: 8,
   backgroundColor: colors.background === '#f8f9fa' ? '#ededed' : '#181a20',
      color: colors.text,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: colors.cancelButtonBackground,
    },
    saveButton: {
      backgroundColor: '#005aa7', 
      borderColor: '#005aa7',     
      borderWidth: 2,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.buttonText,
    },
    saveButtonText: {
      color: colors.background === 'white' ? 'black' : 'white',
    },
    cancelButtonText: {
      color: colors.background === '#f8f9fa' ? 'black' : 'white',
    },
    notesList: {
      padding: 16,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.background === '#f8f9fa' ? 'black' : 'white',
      fontSize: 16,
      marginTop: 80,
    },
    noteCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    noteTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      color: "black",
    },
    deleteButton: {
      padding: 4,
    },
    noteContent: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    noteDate: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.textSecondary,
    },
    colorPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 12,
      gap: 10,
    },
    colorOption: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#CCC',
    },
    selectedColor: {
      borderWidth: 2,
      borderColor: '#007AFF',
    },
  });

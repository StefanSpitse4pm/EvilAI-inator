import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import { useNavigation } from '@react-navigation/native';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

interface ToggleItemProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
  showChevron = true,
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#666" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.itemRight}>
      {rightElement}
      {showChevron && !rightElement && (
        <Ionicons name="chevron-forward" size={16} color="#e0e0e0" />
      )}
    </View>
  </TouchableOpacity>
);

const ToggleItem: React.FC<ToggleItemProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
}) => (
  <View style={styles.settingsItem}>
    <View style={styles.itemLeft}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
      thumbColor="#fff"
    />
  </View>
);

const SectionHeader: React.FC<{ title: string; icon: keyof typeof Ionicons.glyphMap }> = ({
  title,
  icon,
}) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon} size={18} color="#007AFF" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation();

  // Notification Settings
  const [agendaUpdates, setAgendaUpdates] = useState(true);
  const [activityFeed, setActivityFeed] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [notificationStyle, setNotificationStyle] = useState('Push');

  // Language & Appearance
  const [language, setLanguage] = useState('Dutch');
  const [fontSize, setFontSize] = useState('Medium');
  const [highContrast, setHighContrast] = useState(false);

  // Calendar Integration
  const [calendarSync, setCalendarSync] = useState(false);
  const [reminderTime, setReminderTime] = useState('10 minutes');

  // Privacy & Permissions
  const [locationAccess, setLocationAccess] = useState(false);
  const [calendarAccess, setCalendarAccess] = useState(false);

  // App Version Modal
  const [versionModalVisible, setVersionModalVisible] = useState(false);

  const showPicker = (title: string, options: string[], currentValue: string, onSelect: (value: string) => void) => {
    Alert.alert(
      title,
      'Select an option:',
      [
        ...options.map((option) => ({
          text: option,
          onPress: () => onSelect(option),
          style: option === currentValue ? 'default' as const : 'default' as const,
        })),
        { text: 'Cancel', style: 'cancel' as const, onPress: () => {} }
      ]
    );
  };

  const handleTimeSettings = () => {
    showPicker(
      'Reminder Time',
      ['5 minutes', '10 minutes', '15 minutes', '30 minutes', '1 hour'],
      reminderTime,
      setReminderTime
    );
  };

  const handlePermissionCheck = (type: string) => {
    toast.info(`${type} permission: ${type === 'Notification' ? 'Granted' : 'Not granted'}`);
  };

  const handleSupport = (type: string) => {
    toast.success(`${type} submitted successfully`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, alignItems: 'flex-start' }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        {/* Spacer to balance the back button */}
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <SectionHeader title="Language" icon="language-outline" />
        <View style={styles.section}>
          <SettingsItem
            title="App Language"
            subtitle={language}
            icon="globe-outline"
          />
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" icon="color-palette-outline" />
        <View style={styles.section}>
          <SettingsItem
            title="Text Size"
            subtitle={fontSize}
            icon="text-outline"
          />
        </View>

        {/* Support & Feedback Section */}
        <SectionHeader title="Support & Feedback" icon="help-circle-outline" />
        <View style={styles.section}>
          <SettingsItem
            title="Help / FAQ"
            subtitle="Get help and find answers"
            icon="help-outline"
            onPress={() => {
              const url = 'https://www.nhlstenden.com/faq';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
          />

          <SettingsItem
            title="Report a Problem"
            subtitle="Let us know about issues"
            icon="bug-outline"
            onPress={() => {
              const url = 'https://www.nhlstenden.com/locaties';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
          />
          <SettingsItem
            title="Suggest a Feature"
            subtitle="Share your ideas"
            icon="bulb-outline"
            onPress={() => {
              const url = 'https://www.nhlstenden.com/locaties';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" icon="information-circle-outline" />
        <View style={styles.section}>
          <SettingsItem
            title="App Version"
            subtitle="1.0.0 (Build 2025)"
            icon="code-outline"
            onPress={() => setVersionModalVisible(true)}
          />
          <SettingsItem
            title="Terms of Service"
            subtitle="Read our terms"
            icon="document-text-outline"
            onPress={() => {
              const url = 'https://www.nhlstenden.com/over-nhl-stenden';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
          />
          <SettingsItem
            title="Privacy Policy"
            subtitle="How we protect your data"
            icon="lock-closed-outline"
            onPress={() => {
              const url = 'https://www.nhlstenden.com/over-nhl-stenden';
              if (Platform.OS === 'web') {
                window.open(url, '_blank');
              } else {
                Linking.openURL(url);
              }
            }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Copyright By Evil-AI-Inator</Text>
        </View>
      </ScrollView>

      {/* App Version Modal */}
      <Modal
        visible={versionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVersionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.versionModalContent}>
            <Text style={styles.versionModalTitle}>App Version</Text>
            <Text style={styles.versionModalVersion}>1.0.0</Text>
            <Text style={styles.versionModalBuild}>Build 2025</Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setVersionModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#005aa7',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1, 
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
    elevation: 5,
  },
  versionModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#005aa7',
  },
  versionModalVersion: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  versionModalBuild: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  closeModalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
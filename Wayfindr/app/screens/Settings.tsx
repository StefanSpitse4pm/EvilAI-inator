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
  Appearance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../Theme/ThemeContext';

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

import type { StatusBarStyle } from 'react-native';

const themeColors: {
  Light: {
    background: string;
    card: string;
    text: string;
    border: string;
    icon: string;
    statusBar: StatusBarStyle;
  };
  Dark: {
    background: string;
    card: string;
    text: string;
    border: string;
    icon: string;
    statusBar: StatusBarStyle;
  };
} = {
  Light: {
    background: '#f8f9fa',
    card: '#fff',
    text: '#1a1a1a',
    border: '#e0e0e0',
    icon: '#666',
    statusBar: 'dark-content',
  },
  Dark: {
    background: '#181a20',
    card: '#23262f',
    text: '#fff',
    border: '#23262f',
    icon: '#bbb',
    statusBar: 'light-content',
  },
};

const SettingsItem: React.FC<SettingsItemProps & { colors: typeof themeColors.Light }> = ({
  title,
  subtitle,
  icon,
  onPress,
  rightElement,
  showChevron = true,
  colors,
}) => (
  <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: colors.border }]} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
        <Ionicons name={icon} size={20} color={colors.icon} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.itemSubtitle, { color: colors.icon }]}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.itemRight}>
      {rightElement}
      {showChevron && !rightElement && (
        <Ionicons name="chevron-forward" size={16} color={colors.border} />
      )}
    </View>
  </TouchableOpacity>
);

const ToggleItem: React.FC<ToggleItemProps & { colors: typeof themeColors.Light }> = ({
  title,
  subtitle,
  value,
  onValueChange,
  colors,
}) => (
  <View style={[styles.settingsItem, { borderBottomColor: colors.border }]}>
    <View style={styles.itemLeft}>
      <View style={styles.textContainer}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.itemSubtitle, { color: colors.icon }]}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: '#007AFF' }}
      thumbColor="#fff"
    />
  </View>
);

const SectionHeader: React.FC<{ title: string; icon: keyof typeof Ionicons.glyphMap; colors: typeof themeColors.Light }> = ({
  title,
  icon,
}) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon} size={18} color="#007AFF" />
    <Text style={[styles.sectionTitle, { color: '#007AFF' }]}>{title}</Text>
  </View>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, setTheme, colors } = useTheme();

  // Notification Settings
  const [agendaUpdates, setAgendaUpdates] = useState(true);
  const [activityFeed, setActivityFeed] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [notificationStyle, setNotificationStyle] = useState('Push');

  // Language & Appearance
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState('Medium');
  const [highContrast, setHighContrast] = useState(false);

  // Calendar Integration
  const [calendarSync, setCalendarSync] = useState(false);
  const [reminderTime, setReminderTime] = useState('10 minutes');

  // Privacy & Permissions
  const [locationAccess, setLocationAccess] = useState(false);
  const [calendarAccess, setCalendarAccess] = useState(false);


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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <SectionHeader title="Language" icon="language-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsItem
            title="App Language"
            subtitle={language}
            icon="globe-outline"
            onPress={() => showPicker('Language', ['English', 'Dutch', 'Spanish', 'French'], language, setLanguage)}
            colors={colors}
          />
        </View>

        {/* Appearance Section */}
        <SectionHeader title="Appearance" icon="color-palette-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsItem
            title="Theme"
            subtitle={theme}
            icon="moon-outline"
            onPress={() =>
              showPicker('Theme', ['Light', 'Dark', 'System default'], theme, setTheme)
            }
            colors={colors}
          />
          <SettingsItem
            title="Text Size"
            subtitle={fontSize}
            icon="text-outline"
            onPress={() => showPicker('Font Size', ['Small', 'Medium', 'Large', 'Extra Large'], fontSize, setFontSize)}
            colors={colors}
          />
        </View>

        {/* Calendar Integration Section */}
        <SectionHeader title="Calendar Integration" icon="calendar-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ToggleItem
            title="Sync with Calendar"
            subtitle="Google Calendar / Apple Calendar"
            value={calendarSync}
            onValueChange={setCalendarSync}
            colors={colors}
          />
          <SettingsItem
            title="Default Reminder Time"
            subtitle={`${reminderTime} before class`}
            icon="alarm-outline"
            onPress={handleTimeSettings}
            colors={colors}
          />
        </View>

        {/* Privacy & Permissions Section */}
        <SectionHeader title="Privacy & Permissions" icon="shield-checkmark-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <ToggleItem
            title="Location Access"
            subtitle="For campus navigation"
            value={locationAccess}
            onValueChange={setLocationAccess}
            colors={colors}
          />
          <ToggleItem
            title="Calendar Access"
            subtitle="Sync with device calendar"
            value={calendarAccess}
            onValueChange={setCalendarAccess}
            colors={colors}
          />
          <SettingsItem
            title="Notification Permissions"
            subtitle="Check current permissions"
            icon="checkmark-circle-outline"
            onPress={() => handlePermissionCheck('Notification')}
            colors={colors}
          />
        </View>

        {/* Support & Feedback Section */}
        <SectionHeader title="Support & Feedback" icon="help-circle-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsItem
            title="Help / FAQ"
            subtitle="Get help and find answers"
            icon="help-outline"
            onPress={() => toast.info('Opening help center...')}
            colors={colors}
          />
          <SettingsItem
            title="Report a Problem"
            subtitle="Let us know about issues"
            icon="bug-outline"
            onPress={() => handleSupport('Bug report')}
            colors={colors}
          />
          <SettingsItem
            title="Suggest a Feature"
            subtitle="Share your ideas"
            icon="bulb-outline"
            onPress={() => handleSupport('Feature suggestion')}
            colors={colors}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="About" icon="information-circle-outline" colors={colors} />
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsItem
            title="App Version"
            subtitle="1.0.0 (Build 2025)"
            icon="code-outline"
            showChevron={false}
            colors={colors}
          />
          <SettingsItem
            title="Terms of Service"
            subtitle="Read our terms"
            icon="document-text-outline"
            onPress={() => toast.info('Opening terms of service...')}
            colors={colors}
          />
          <SettingsItem
            title="Privacy Policy"
            subtitle="How we protect your data"
            icon="lock-closed-outline"
            onPress={() => toast.info('Opening privacy policy...')}
            colors={colors}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.icon }]}>Copyright By Evil-AI-Inator</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
});
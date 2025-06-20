import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../Theme/ThemeContext';
import SlideMenu from './sidemenu';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Activity type definition
type Activity = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: 'event' | 'sports' | 'academic' | 'meeting' | 'club' | string;
  isSchoolWide: boolean;
};

// Mock data for activities (simulating database fetch)
const mockActivities: Activity[] = [
  { 
    id: '1', 
    title: 'School Assembly', 
    date: new Date(2025, 5, 17),
    time: '8:30 AM', 
    location: 'Main Hall', 
    type: 'event',
    isSchoolWide: true
  },
  { 
    id: '2', 
    title: 'Basketball Practice', 
    date: new Date(2025, 5, 17),
    time: '3:30 PM', 
    location: 'Gym', 
    type: 'sports',
    isSchoolWide: false
  },
  { 
    id: '3', 
    title: 'Science Fair', 
    date: new Date(2025, 5, 18),
    time: '1:00 PM', 
    location: 'Science Lab', 
    type: 'academic',
    isSchoolWide: false
  },
  { 
    id: '4', 
    title: 'Game Night', 
    date: new Date(2025, 5, 19),
    time: '5:00 PM', 
    location: 'Classrooms', 
    type: 'meeting',
    isSchoolWide: true
  },
  { 
    id: '5', 
    title: 'Think Wireles', 
    date: new Date(2025, 5, 20),
    time: '3:30 PM', 
    location: 'Auditorium', 
    type: 'event',
    isSchoolWide: false
  },
  { 
    id: '6', 
    title: 'Open dag ', 
    date: new Date(2025, 5, 21),
    time: '9:00 AM', 
    location: 'Hoofdingang', 
    type: 'event',
    isSchoolWide: true
  },
]; // <-- Add this closing bracket and semicolon

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [schoolWideActivities, setSchoolWideActivities] = useState<Activity[]>([]);
  const [personalActivities, setPersonalActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [menuVisible, setMenuVisible] = useState(false); // <-- Add this
  const navigation = useNavigation();

  // Days of the week
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Simulate fetching activities from a database
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setActivities(mockActivities);
        setLoading(false);
      }, 1000);
    };

    fetchActivities();
  }, []);

  // Filter activities based on selected date
  useEffect(() => {
    if (activities.length > 0) {
      const filtered = activities.filter(activity => 
        activity.date.getDate() === selectedDate.getDate() &&
        activity.date.getMonth() === selectedDate.getMonth() &&
        activity.date.getFullYear() === selectedDate.getFullYear()
      );
      
      setFilteredActivities(filtered);
      
      // Separate school-wide and personal activities
      setSchoolWideActivities(filtered.filter(activity => activity.isSchoolWide));
      setPersonalActivities(filtered.filter(activity => !activity.isSchoolWide));
    }
  }, [selectedDate, activities]);

  // Check if a date has activities
  const hasActivities = (date: Date) => {
    return activities.some((activity: Activity) => 
      activity.date.getDate() === date.getDate() &&
      activity.date.getMonth() === date.getMonth() &&
      activity.date.getFullYear() === date.getFullYear()
    );
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ day: '', date: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ 
        day: i, 
        date: date,
        isToday: 
          date.getDate() === new Date().getDate() && 
          date.getMonth() === new Date().getMonth() && 
          date.getFullYear() === new Date().getFullYear(),
        isSelected: 
          date.getDate() === selectedDate.getDate() && 
          date.getMonth() === selectedDate.getMonth() && 
          date.getFullYear() === selectedDate.getFullYear(),
        hasActivities: hasActivities(date)
      });
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Select a date
  const selectDate = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      toast.success(`Selected: ${date.toDateString()}`);
    }
  };

  // Format date for display
  interface FormatDateOptions {
    weekday?: 'long' | 'short' | 'narrow';
    month?: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    day?: 'numeric' | '2-digit';
  }

  const formatDate = (date: Date, options?: FormatDateOptions): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      ...options
    });
  };

  // Get activity icon based on type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'event':
        return <Ionicons name="calendar" size={24} color="#4285F4" />;
      case 'sports':
        return <Ionicons name="basketball" size={24} color="#EA4335" />;
      case 'academic':
        return <Ionicons name="school" size={24} color="#FBBC05" />;
      case 'meeting':
        return <Ionicons name="people" size={24} color="#34A853" />;
      case 'club':
        return <Ionicons name="color-palette" size={24} color="#8E24AA" />;
      default:
        return <Ionicons name="ellipsis-horizontal" size={24} color="#757575" />;
    }
  };

  // Render activity item
  const renderActivityItem = ({ item }: { item: Activity }) => (
    <View style={styles.activityCard}>
      <View style={styles.activityIconContainer}>
        {getActivityIcon(item.type)}
      </View>
      <View style={styles.activityDetails}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>
          {item.time}
        </Text>
        <Text style={styles.activityLocation}>
          <Ionicons name="location" size={14} color="#757575" /> {item.location}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Home</Text>
        {/* Spacer to balance the back button */}
        <View style={{ width: 40 }} />
      </View>
      <ScrollView>
        {/* Header */}

        <Text style={styles.tagline}>Excellence in Education</Text>

        {/* Main Content Container */}
        <View style={styles.mainContentContainer}>
          {/* Mini Calendar Section */}
          <View style={styles.miniCalendarContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.miniSectionTitle}>Calendar</Text>
              <View style={styles.monthSelector}>
                <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
                  <Ionicons name="chevron-back" size={18} color="#333" />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                  {monthNames[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
                  <Ionicons name="chevron-forward" size={18} color="#333" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Days of week header */}
            <View style={styles.daysOfWeekContainer}>
              {daysOfWeek.map((day, index) => (
                <Text 
                  key={index} 
                  style={[
                    styles.dayOfWeekText,
                    index === 0 || index === 6 ? styles.weekendText : null
                  ]}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.miniCalendarDay,
                    item.isToday ? styles.todayDay : null,
                    item.isSelected ? styles.selectedDay : null,
                    !item.date ? styles.emptyDay : null,
                    item.hasActivities && !item.isSelected ? styles.activityDay : null
                  ]}
                  onPress={() => item.date && selectDate(item.date)}
                  disabled={!item.date}
                >
                  <Text 
                    style={[
                      styles.miniCalendarDayText,
                      item.isToday ? styles.todayText : null,
                      item.isSelected ? styles.selectedDayText : null,
                      item.hasActivities && !item.isSelected ? styles.activityDayText : null
                    ]}
                  >
                    {item.day}
                  </Text>
                  {item.hasActivities && !item.isSelected && (
                    <View style={styles.activityDot} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Selected Date Display */}
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              {formatDate(selectedDate)}
            </Text>
          </View>

          {/* School-wide Activities Section */}
          <View style={styles.activityFeedContainer}>
            <View style={styles.activityHeaderContainer}>
              <Ionicons name="school" size={22} color="#1A237E" />
              <Text style={styles.sectionTitle}>School-wide Events</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Loading activities...</Text>
              </View>
            ) : (
              <FlatList
                data={schoolWideActivities}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={renderActivityItem}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No school-wide events for this day</Text>
                }
              />
            )}
          </View>

          {/* Personal Activities Section */}
          <View style={styles.activityFeedContainer}>
            <View style={styles.activityHeaderContainer}>
              <Ionicons name="person" size={22} color="#1A237E" />
              <Text style={styles.sectionTitle}>Your Activities</Text>
            </View>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Loading activities...</Text>
              </View>
            ) : (
              <FlatList
                data={personalActivities}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={renderActivityItem}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No personal activities for this day</Text>
                }
              />
            )}
          </View>
        </View>
      </ScrollView>
      <SlideMenu isVisible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  menuButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center', // Center text
  },
  tagline: {
    fontSize: 14,
    color: '#E8EAF6',
    flex: 1,
    textAlign: 'center', // Center text
  },
  mainContentContainer: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  miniSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  miniCalendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    marginBottom: 10,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  monthButton: {
    padding: 4,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  dayOfWeekText: {
    width: 30,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
    fontSize: 12,
  },
  weekendText: {
    color: '#9E9E9E',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  miniCalendarDay: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: 15,
    position: 'relative',
  },
  miniCalendarDayText: {
    fontSize: 12,
    color: '#333',
  },
  todayDay: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  todayText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#1A237E',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  activityDay: {
    position: 'relative',
  },
  activityDayText: {
    fontWeight: '600',
  },
  activityDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4285F4',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  selectedDateContainer: {
    backgroundColor: '#E8EAF6',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A237E',
  },
  activityFeedContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  activityHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#757575',
  },
  activityCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activityIconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 14,
    color: '#757575',
  },
  emptyListText: {
    padding: 20,
    textAlign: 'center',
    color: '#757575',
    fontStyle: 'italic',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E8EAF6',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
});
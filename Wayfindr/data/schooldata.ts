import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface SchoolLocation {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  building: string;
  hours: string;
  phone?: string;
  services?: string[];
  image: string;
}

export const schoolLocations: SchoolLocation[] = [
  {
    id: '1',
    name: 'Library',
    description: 'Main campus library with extensive collection of books, digital resources, and quiet study spaces. Features group study rooms, computer labs, and research assistance.',
    x: screenWidth * 0.3,
    y: screenHeight * 0.4,
    icon: 'library-outline',
    color: '#3b82f6',
    building: 'Learning Commons',
    hours: '7:00 AM - 11:00 PM',
    phone: '(555) 123-4567',
    services: ['Books & Journals', 'Computer Access', 'Study Rooms', 'Research Help', 'Printing Services'],
    image: 'https://api.a0.dev/assets/image?text=modern%20university%20library%20interior%20with%20students%20studying&aspect=16:9',
  },
  {
    id: '2',
    name: 'Student Center',
    description: 'Hub of student life featuring dining options, recreation facilities, meeting spaces, and student organization offices.',
    x: screenWidth * 0.7,
    y: screenHeight * 0.3,
    icon: 'people-outline',
    color: '#10b981',
    building: 'Student Union',
    hours: '6:00 AM - 12:00 AM',
    phone: '(555) 234-5678',
    services: ['Dining Hall', 'Game Room', 'Meeting Rooms', 'Student Services', 'ATM'],
    image: 'https://api.a0.dev/assets/image?text=bustling%20university%20student%20center%20with%20students%20socializing&aspect=16:9',
  },
  {
    id: '3',
    name: 'Science Building',
    description: 'State-of-the-art laboratories and classrooms for biology, chemistry, physics, and engineering programs.',
    x: screenWidth * 0.5,
    y: screenHeight * 0.6,
    icon: 'flask-outline',
    color: '#f59e0b',
    building: 'Science Complex',
    hours: '7:00 AM - 10:00 PM',
    phone: '(555) 345-6789',
    services: ['Research Labs', 'Computer Lab', 'Lecture Halls', 'Equipment Checkout'],
    image: 'https://api.a0.dev/assets/image?text=modern%20science%20laboratory%20with%20equipment%20and%20students&aspect=16:9',
  },
  {
    id: '4',
    name: 'Gymnasium',
    description: 'Full-service fitness center with basketball courts, weight rooms, cardio equipment, and group fitness classes.',
    x: screenWidth * 0.2,
    y: screenHeight * 0.7,
    icon: 'fitness-outline',
    color: '#ef4444',
    building: 'Athletic Center',
    hours: '5:00 AM - 11:00 PM',
    phone: '(555) 456-7890',
    services: ['Basketball Courts', 'Weight Room', 'Cardio Equipment', 'Group Classes', 'Locker Rooms'],
    image: 'https://api.a0.dev/assets/image?text=university%20gymnasium%20with%20basketball%20court%20and%20fitness%20equipment&aspect=16:9',
  },
  {
    id: '5',
    name: 'Cafeteria',
    description: 'Main dining facility offering diverse meal options, including vegetarian, vegan, and international cuisine.',
    x: screenWidth * 0.8,
    y: screenHeight * 0.5,
    icon: 'restaurant-outline',
    color: '#8b5cf6',
    building: 'Dining Hall',
    hours: '7:00 AM - 9:00 PM',
    phone: '(555) 567-8901',
    services: ['Multiple Food Stations', 'Salad Bar', 'Grab & Go', 'Special Dietary Options'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
  },
  {
    id: '6',
    name: 'Admin Office',
    description: 'Main administrative building housing registrar, financial aid, admissions, and other student services.',
    x: screenWidth * 0.6,
    y: screenHeight * 0.2,
    icon: 'business-outline',
    color: '#64748b',
    building: 'Administration',
    hours: '8:00 AM - 5:00 PM',
    phone: '(555) 678-9012',
    services: ['Registrar', 'Financial Aid', 'Admissions', 'Bursar', 'Academic Advising'],
    image: 'https://api.a0.dev/assets/image?text=university%20administration%20building%20exterior%20with%20students%20walking&aspect=16:9',
  },
];
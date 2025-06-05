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
  floor: number;
}

export const schoolLocations: SchoolLocation[] = [
  {
    id: '1',
    name: 'Mediatheek',
    description: 'Main campus library with extensive collection of books, digital resources, and quiet study spaces. Features group study rooms, computer labs, and research assistance.',
    x: 910,
    y: -200,
    icon: 'library-outline',
    color: '#3b82f6',
    building: 'Learning Commons',
    hours: '7:00 AM - 11:00 PM',
    phone: '(555) 123-4567',
    services: ['Books & Journals', 'Computer Access', 'Study Rooms', 'Research Help', 'Printing Services'],
    image: 'https://api.a0.dev/assets/image?text=modern%20university%20library%20interior%20with%20students%20studying&aspect=16:9',
    floor: 1,
  },
  {
    id: '2',
    name: 'Balie',
    description: 'Hub of student life featuring dining options, recreation facilities, meeting spaces, and student organization offices.',
    x: -135,
    y: 255,
    icon: 'people-outline',
    color: '#10b981',
    building: 'Student Union',
    hours: '6:00 AM - 12:00 AM',
    phone: '(555) 234-5678',
    services: ['Dining Hall', 'Game Room', 'Meeting Rooms', 'Student Services', 'ATM'],
    image: 'https://api.a0.dev/assets/image?text=bustling%20university%20student%20center%20with%20students%20socializing&aspect=16:9',
    floor: 1,
  },
  {
    id: '5',
    name: 'Cafeteria',
    description: 'Main dining facility offering diverse meal options, including vegetarian, vegan, and international cuisine.',
    x: 560,
    y: -40,
    icon: 'restaurant-outline',
    color: '#8b5cf6',
    building: 'Dining Hall',
    hours: '7:00 AM - 9:00 PM',
    phone: '(555) 567-8901',
    services: ['Multiple Food Stations', 'Salad Bar', 'Grab & Go', 'Special Dietary Options'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
  },
];
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
    description: 'Mediatheek met moderne faciliteiten voor studenten, inclusief studieruimtes, computerwerkplekken en een uitgebreide collectie boeken en tijdschriften. Boekleenwebsite https://learning.oreilly.com/home/',
    x: 900,
    y: -270,
    icon: 'library-outline',
    color: '#3b82f6',
    building: 'NHL Stenden Bibliotheek',
    hours: '7:00 AM - 11:00 PM',
    phone: '(555) 123-4567',
    services: ['Boeken & Documenten', 'Bibliotheek Winkel', 'Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=modern%20university%20library%20interior%20with%20students%20studying&aspect=16:9',
    floor: 1,
  },
  {
    id: '2',
    name: 'Balie',
    description: 'Studentenbalie voor administratieve ondersteuning, inclusief inschrijvingen, studiefinanciering en algemene vragen.',
    x: -145,
    y: 190,
    icon: 'people-outline',
    color: '#10b981',
    building: 'NHL Stenden Balie',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 234-5678',
    services: ['Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=bustling%20university%20student%20center%20with%20students%20socializing&aspect=16:9',
    floor: 1,
  },
  {
    id: '3',
    name: 'Balie',
    description: 'Studentenbalie voor administratieve ondersteuning, inclusief inschrijvingen, studiefinanciering en algemene vragen.',
    x: -125,
    y: 190,
    icon: 'people-outline',
    color: '#10b981',
    building: 'NHL Stenden Balie',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 234-5678',
    services: ['Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=bustling%20university%20student%20center%20with%20students%20socializing&aspect=16:9',
    floor: 1,
  },
  {
    id: '5',
    name: 'Cafeteria',
    description: 'Main dining facility offering diverse meal options, including vegetarian, vegan, and international cuisine.',
    x: 560,
    y: -120,
    icon: 'restaurant-outline',
    color: '#8b5cf6',
    building: 'NHL Stenden Cafeteria',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 567-8901',
    services: ['Cafetaria', 'Cafe', 'Restaurant'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
  },
];
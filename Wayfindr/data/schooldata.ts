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
  interactive?: boolean;
}

export const schoolLocations: SchoolLocation[] = [
  {
    id: '1',
    name: 'Mediatheek',
    description: 'Mediatheek met moderne faciliteiten voor studenten, inclusief studieruimtes, computerwerkplekken en een uitgebreide collectie boeken en tijdschriften. Boekleenwebsite https://learning.oreilly.com/home/',
    x: 1335,
    y: 325,
    icon: 'library-outline',
    color: '#3b82f6',
    building: 'NHL Stenden Emmen',
    hours: '8:30 AM - 17:00 PM',
    phone: '058 244 1717',
    services: ['Boeken & Documenten', 'Bibliotheek Winkel', 'Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=modern%20university%20library%20interior%20with%20students%20studying&aspect=16:9',
    floor: 1,
    interactive: true,
  },
  {
    id: '2',
    name: 'Balie',
    description: 'Studentenbalie voor administratieve ondersteuning, inclusief inschrijvingen, studiefinanciering en algemene vragen.',
    x: 810,
    y: 555,
    icon: 'people-outline',
    color: '#10b981',
    building: 'NHL Stenden Emmen',
    hours: '7:30 AM - 19:30 PM',
    phone: '0591 853 100',
    services: ['Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=bustling%20university%20student%20center%20with%20students%20socializing&aspect=16:9',
    floor: 1,
    interactive: true,
  },
  {
    id: '5',
    name: 'Cafeteria',
    description: 'Studentenrestaurant met een breed scala aan maaltijden, snacks en drankjes. Gezellige eetruimte met uitzicht op de campus.',
    x: 1160,
    y:  400,
    icon: 'restaurant-outline',
    color: '#8b5cf6',
    building: 'NHL Stenden Emmen',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 567-8901',
    services: ['Cafetaria', 'Cafe', 'Restaurant'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
    interactive: true,
  },
  {
    id: '6',
    name: 'Cafe',
    description: 'NHL Stenden Emmen Cafe, een gezellige plek voor studenten om te ontspannen met koffie, thee en lichte snacks. Ideaal voor een korte pauze tussen de lessen.',
    x: 1175,
    y: 310,
    icon: 'cafe-outline',
    color: '#C5325D',
    building: 'NHL Stenden Emmen',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 567-8901',
    services: ['Cafetaria', 'Cafe', 'Restaurant'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
    interactive: true,
  },
    {
    id: '7',
    name: 'Stones',
    description: 'Restaurant Stones, een populaire eetgelegenheid op de campus van NHL Stenden Emmen. Biedt een gevarieerd menu met zowel lokale als internationale gerechten, perfect voor studenten en personeel.',
    x: 955,
    y: 320,
    icon: 'restaurant-outline',
    color: '#ff0004',
    building: 'NHL Stenden Emmen',
    hours: '7:00 AM - 17:00 PM',
    phone: '(555) 567-8901',
    services: ['Cafetaria', 'Cafe', 'Restaurant'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
    interactive: true,
  },
  {
    id: '8',
    name: '0.037',
    description: 'Receptie 0.037 - Ontvangstruimte DCterra',
    x: 993,
    y: 915,
    icon: 'people-outline',
    color: '#10b981',
    building: 'NHL Stenden Emmen',
    hours: '7:00 AM - 19:30 PM',
    phone: 'N.V.T',
    services: ['Studenten Info'],
    image: 'https://api.a0.dev/assets/image?text=university%20cafeteria%20with%20food%20stations%20and%20dining%20tables&aspect=16:9',
    floor: 1,
    interactive: true,
  },
];
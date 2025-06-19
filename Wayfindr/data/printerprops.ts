import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface PrinterProps {
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

export const printerProps: PrinterProps[] = [

  {
    id: '1',
    name: 'Printer-1',
    description: 'Printer is gelokaliseerd op de eerste verdieping van het gebouw, dicht bij de Mediatheek. Deze printer ondersteunt zowel zwart-wit als kleurafdrukken.',
    x: 1315,
    y: 570,
    icon: 'print-outline',
    color: '#c1c1c1',
    building: 'NHL Stenden Emmen',
    hours: '8:30 AM - 17:00 PM',
    phone: 'N.V.T',
    services: ['Zwart-wit afdrukken', 'Kleur afdrukken', 'Scannen'],
    image: '../../assets/images/printer-1.png',
    floor: 1,
    interactive: true,
  },
  {
    id: '2',
    name: 'Printer-2',
    description: 'Deze printer bevindt zich op de tweede verdieping, naast de studieruimtes. Het biedt snelle afdrukmogelijkheden en is ideaal voor studenten die snel documenten moeten printen.',
    x: 1030,
    y: 490,
    icon: 'print-outline',
    color: '#c1c1c1',
    building: 'NHL Stenden Emmen',
    hours: '8:30 AM - 17:00 PM',
    phone: 'N.V.T',
    services: ['Zwart-wit afdrukken', 'Kleur afdrukken'],
    image: '../../assets/images/printer-2.png',
    floor: 2,
    interactive: true,
  },
];
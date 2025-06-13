import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface StaticMarker {
  id: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  floor: number;
}
  
export const staticMarkers: StaticMarker[] = [
    
    {
    id: 'Info-1-next-to-main-entrance',
    x: 765,
    y: 525,
    icon: 'information-circle-outline',
    color: '#187287',
    floor: 1,
  },
  {
    id: 'Stair-1-leading-to-studentlandscape(floor 2 Informatica)',
    x: 995,
    y: 540,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'Stair-2-cafeteria-leading-to-floor-2',
    x: 1113,
    y: 290,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-2-Next-to-entrance-tower',
    x: 420,
    y: 410,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-3-Next-to-Auditorium',
    x: 320,
    y: 550,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-4-leading-to-Tower-entrance-2',
    x: 290,
    y: 695,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-5-leading-to-tower-floor-2',
    x: 230,
    y: 669,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-6-leading-to-tower-floor-2',
    x: 230,
    y: 635,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'TowerStair-7-below-Auditorium',
    x: 230,
    y: 612,
    icon: 'swap-vertical-outline',
    color: '#735c46',
    floor: 1,
  },
  {
    id: 'Main-entrance-NHL-Stenden-Emmen',
    x: 715,
    y: 542,
    icon: 'enter-outline',
    color: '#9c9c9c',
    floor: 1,
  },
  {
    id: 'Tower-entrance-1-NHL-Stenden-Emmen',
    x: 465,
    y: 390,
    icon: 'enter-outline',
    color: '#9c9c9c',
    floor: 1,
  },
  {
    id: 'Tower-entrance-2-NHL-Stenden-Emmen',
    x: 254,
    y: 685,
    icon: 'enter-outline',
    color: '#9c9c9c',
    floor: 1,
  },
    {
    id: 'WC-1',
    x: 857,
    y: 475,
    icon: 'female',
    color: '#e79fef',
    floor: 1,
  },
  {
    id: 'WC-2',
    x: 880,
    y: 475,
    icon: 'male',
    color: '#75bde6',
    floor: 1,
  },
  {
    id: 'WC-3',
    x: 1043,
    y: 356,
    icon: 'male',
    color: '#75bde6',
    floor: 1,
  },
  {
    id: 'WC-4',
    x: 1043,
    y: 336,
    icon: 'female',
    color: '#e79fef',
    floor: 1,
  },
  {
    id: 'WC-5',
    x: 1088,
    y: 644,
    icon: 'female',
    color: '#e79fef',
    floor: 1,
  },
  {
    id: 'WC-6',
    x: 1056,
    y: 644,
    icon: 'male',
    color: '#75bde6',
    floor: 1,
  },
  {
    id: 'WC-7',
    x: 476,
    y: 468,
    icon: 'male',
    color: '#75bde6',
    floor: 1,
  },
  {
    id: 'WC-8',
    x: 446,
    y: 471,
    icon: 'female',
    color: '#e79fef',
    floor: 1,
  },
  {
    id: 'WC-9',
    x: 1315,
    y: 486,
    icon: 'female',
    color: '#e79fef',
    floor: 1,
  },
  {
    id: 'WC-10',
    x: 1315,
    y: 465,
    icon: 'male',
    color: '#75bde6',
    floor: 1,
  },
];
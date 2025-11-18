import { Theme } from './types';

export const themes: Theme[] = [
  {
    name: 'default',
    displayName: 'GymPro Default',
    light: {
      primary: '217.2 91.2% 59.8%', // tailwind blue-600
      'primary-foreground': '210 40% 98%', // tailwind slate-50
    },
    dark: {
      primary: '217.2 91.2% 59.8%',
      'primary-foreground': '210 40% 98%',
    },
  },
  {
    name: 'orange',
    displayName: 'Sunset Orange',
    light: {
      primary: '24.6 95% 53.1%', // tailwind orange-600
      'primary-foreground': '20 14.3% 97.3%',
    },
    dark: {
      primary: '24.6 95% 53.1%',
      'primary-foreground': '20 14.3% 97.3%',
    },
  },
  {
    name: 'green',
    displayName: 'Forest Green',
    light: {
      primary: '142.1 76.2% 36.3%', // tailwind green-600
      'primary-foreground': '142.1 70.6% 95.1%',
    },
    dark: {
      primary: '142.1 76.2% 36.3%',
      'primary-foreground': '142.1 70.6% 95.1%',
    },
  },
  {
    name: 'purple',
    displayName: 'Royal Purple',
    light: {
      primary: '262.1 83.3% 57.8%', // tailwind violet-600
      'primary-foreground': '262.1 80% 97.8%',
    },
    dark: {
      primary: '262.1 83.3% 57.8%',
      'primary-foreground': '262.1 80% 97.8%',
    },
  },
  {
    name: 'teal',
    displayName: 'Ocean Teal',
    light: {
      primary: '173.5 83.5% 35.5%', // tailwind teal-600
      'primary-foreground': '173.5 70% 95.1%',
    },
    dark: {
      primary: '173.5 83.5% 35.5%',
      'primary-foreground': '173.5 70% 95.1%',
    },
  },
  {
    name: 'red',
    displayName: 'Ruby Red',
    light: {
      primary: '346.8 77.2% 49.8%', // tailwind red-600
      'primary-foreground': '346.8 70% 97.1%',
    },
    dark: {
      primary: '346.8 77.2% 49.8%',
      'primary-foreground': '346.8 70% 97.1%',
    },
  },
];
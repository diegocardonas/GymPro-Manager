import { Achievement } from '../types';

export const MOCK_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ach1',
        name: 'Primer Entrenamiento',
        description: 'Completaste tu primera sesión de entrenamiento.',
        icon: 'star',
    },
    {
        id: 'ach2',
        name: 'Novato Constante',
        description: 'Registraste 3 entrenamientos en tu primera semana.',
        icon: 'fire',
    },
    {
        id: 'ach3',
        name: 'Guerrero Semanal',
        description: 'Completaste todos los entrenamientos programados de una semana.',
        icon: 'shield',
    },
    {
        id: 'ach4',
        name: 'Mes de Progreso',
        description: 'Registraste al menos 10 entrenamientos en un mes.',
        icon: 'calendar',
    },
    {
        id: 'ach5',
        name: 'Entusiasta de las Clases',
        description: 'Asististe a 5 clases grupales.',
        icon: 'users',
    },
    {
        id: 'ach6',
        name: 'Pájaro Madrugador',
        description: 'Registraste 5 entrenamientos antes de las 7 AM.',
        icon: 'sun',
    },
];
import { Challenge } from '../types';

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 'chal1',
        name: 'Rey del Cardio de Julio',
        description: 'Registra la mayor cantidad de kilómetros en la cinta, bicicleta o elíptica este mes.',
        goal: 100,
        unit: 'km',
        startDate: '2024-07-01T00:00:00.000Z',
        endDate: '2024-07-31T23:59:59.000Z',
        participants: [
            { userId: '2', progress: 55 },
            { userId: '5', progress: 78 },
            { userId: '9', progress: 42 },
        ],
    },
    {
        id: 'chal2',
        name: 'Fuerza de Verano',
        description: 'Acumula el mayor peso total levantado en todos los ejercicios.',
        goal: 50000,
        unit: 'kg',
        startDate: '2024-06-15T00:00:00.000Z',
        endDate: '2024-08-15T23:59:59.000Z',
        participants: [
            { userId: '3', progress: 35000 },
            { userId: '6', progress: 41000 },
        ],
    },
];
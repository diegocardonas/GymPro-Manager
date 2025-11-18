import { GymClass } from '../types';

const getISODate = (dayOffset: number, hour: number, durationMinutes: number): { start: string, end: string } => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + dayOffset);
    startDate.setHours(hour, 0, 0, 0);

    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    return { start: startDate.toISOString(), end: endDate.toISOString() };
};

export const MOCK_CLASSES: GymClass[] = [
    {
        id: 'c1',
        name: 'Morning HIIT',
        description: 'High-Intensity Interval Training to kickstart your day. Get ready to sweat!',
        trainerId: 't1', // Chris Validator
        startTime: getISODate(1, 8, 45).start, // Tomorrow at 8:00 AM
        endTime: getISODate(1, 8, 45).end,
        capacity: 15,
        bookedClientIds: ['2', '5', '9'],
    },
    {
        id: 'c2',
        name: 'Vinyasa Yoga Flow',
        description: 'A dynamic yoga class focusing on breath-synchronized movement.',
        trainerId: 't2', // Diana Prince
        startTime: getISODate(1, 18, 60).start, // Tomorrow at 6:00 PM
        endTime: getISODate(1, 18, 60).end,
        capacity: 20,
        bookedClientIds: ['6', '10', '14', '20'],
    },
    {
        id: 'c3',
        name: 'Strength & Conditioning',
        description: 'Build raw strength and improve your overall conditioning with this intense workout.',
        trainerId: 't3', // Ben Affleck
        startTime: getISODate(2, 17, 75).start, // Day after tomorrow at 5:00 PM
        endTime: getISODate(2, 17, 75).end,
        capacity: 12,
        bookedClientIds: ['25', '29', '34'],
    },
    {
        id: 'c4',
        name: 'Endurance Cardio',
        description: 'Push your limits with a mix of running, cycling, and rowing.',
        trainerId: 't4', // Sarah Connor
        startTime: getISODate(2, 9, 60).start, // Day after tomorrow at 9:00 AM
        endTime: getISODate(2, 9, 60).end,
        capacity: 18,
        bookedClientIds: [],
    },
    {
        id: 'c5',
        name: 'Powerlifting Basics',
        description: 'Learn the fundamentals of the three big lifts: squat, bench, and deadlift.',
        trainerId: 't5', // John Cena
        startTime: getISODate(3, 19, 90).start, // In 3 days at 7:00 PM
        endTime: getISODate(3, 19, 90).end,
        capacity: 10,
        bookedClientIds: ['3', '15', '21'],
    },
];

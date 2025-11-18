import { PreEstablishedRoutine } from '../types';

export const MOCK_ROUTINES: PreEstablishedRoutine[] = [
    {
        id: 'rt1',
        name: 'Beginner Full Body',
        description: 'A 3-day per week full-body workout for beginners to build foundational strength.',
        routines: [
            { day: 'Monday', exercises: [{ name: 'Squats', sets: 3, reps: '8-12' }, { name: 'Push-ups', sets: 3, reps: 'To Failure' }, { name: 'Rows', sets: 3, reps: '8-12' }, { name: 'Plank', sets: 3, reps: '30s' }] },
            { day: 'Tuesday', exercises: [] },
            { day: 'Wednesday', exercises: [{ name: 'Romanian Deadlifts', sets: 3, reps: '8-12' }, { name: 'Overhead Press', sets: 3, reps: '8-12' }, { name: 'Pull-ups (Assisted)', sets: 3, reps: '5-8' }, { name: 'Leg Raises', sets: 3, reps: '15' }] },
            { day: 'Thursday', exercises: [] },
            { day: 'Friday', exercises: [{ name: 'Goblet Squats', sets: 3, reps: '10-15' }, { name: 'Dumbbell Bench Press', sets: 3, reps: '8-12' }, { name: 'Face Pulls', sets: 3, reps: '15-20' }, { name: 'Bicep Curls', sets: 3, reps: '10-12' }] },
            { day: 'Saturday', exercises: [] },
            { day: 'Sunday', exercises: [] },
        ]
    },
    {
        id: 'rt2',
        name: 'Advanced Push/Pull/Legs',
        description: 'A 6-day split for advanced lifters focusing on hypertrophy and strength.',
        routines: [
            { day: 'Monday', exercises: [{ name: 'Bench Press', sets: 4, reps: '5-8' }, { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12' }, { name: 'Lateral Raises', sets: 4, reps: '12-15' }, { name: 'Tricep Pushdowns', sets: 3, reps: '10-15' }] }, // Push
            { day: 'Tuesday', exercises: [{ name: 'Deadlifts', sets: 4, reps: '3-5' }, { name: 'Pull-ups', sets: 4, reps: 'To Failure' }, { name: 'Barbell Rows', sets: 3, reps: '8-10' }, { name: 'Bicep Curls', sets: 3, reps: '10-12' }] }, // Pull
            { day: 'Wednesday', exercises: [{ name: 'Squats', sets: 4, reps: '5-8' }, { name: 'Leg Press', sets: 3, reps: '10-15' }, { name: 'Leg Curls', sets: 3, reps: '12-15' }, { name: 'Calf Raises', sets: 4, reps: '15-20' }] }, // Legs
            { day: 'Thursday', exercises: [{ name: 'Overhead Press', sets: 4, reps: '5-8' }, { name: 'Dips', sets: 3, reps: 'To Failure' }, { name: 'Front Raises', sets: 3, reps: '12-15' }, { name: 'Skull Crushers', sets: 3, reps: '10-15' }] }, // Push
            { day: 'Friday', exercises: [{ name: 'Weighted Pull-ups', sets: 4, reps: '6-8' }, { name: 'T-Bar Rows', sets: 3, reps: '8-10' }, { name: 'Face Pulls', sets: 4, reps: '15-20' }, { name: 'Hammer Curls', sets: 3, reps: '10-12' }] }, // Pull
            { day: 'Saturday', exercises: [{ name: 'Front Squats', sets: 4, reps: '6-8' }, { name: 'Lunges', sets: 3, reps: '10-12/leg' }, { name: 'Good Mornings', sets: 3, reps: '12-15' }, { name: 'Seated Calf Raises', sets: 4, reps: '15-20' }] }, // Legs
            { day: 'Sunday', exercises: [] },
        ]
    },
];

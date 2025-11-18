import { EquipmentItem, EquipmentStatus } from '../types';

export const MOCK_EQUIPMENT: EquipmentItem[] = [
    {
        id: 'eq1',
        name: 'Treadmill #1',
        type: 'Cardio',
        location: 'Cardio Zone',
        status: EquipmentStatus.OPERATIONAL,
    },
    {
        id: 'eq2',
        name: 'Treadmill #2',
        type: 'Cardio',
        location: 'Cardio Zone',
        status: EquipmentStatus.OPERATIONAL,
    },
    {
        id: 'eq3',
        name: 'Leg Press Machine',
        type: 'Strength',
        location: 'Machine Area',
        status: EquipmentStatus.IN_REPAIR,
    },
    {
        id: 'eq4',
        name: 'Dumbbell Rack (5-50kg)',
        type: 'Free Weights',
        location: 'Weights Area',
        status: EquipmentStatus.OPERATIONAL,
    },
    {
        id: 'eq5',
        name: 'Squat Rack #1',
        type: 'Strength',
        location: 'Weights Area',
        status: EquipmentStatus.OPERATIONAL,
    },
    {
        id: 'eq6',
        name: 'Lat Pulldown Machine',
        type: 'Strength',
        location: 'Machine Area',
        status: EquipmentStatus.OUT_OF_SERVICE,
    },
];

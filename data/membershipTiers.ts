import { MembershipTier } from '../types';

export const MOCK_TIERS: MembershipTier[] = [
    { id: 'tier1', name: 'Basic', price: 30, duration: 1, features: ['Gym Access', 'Locker Room'], color: '#3b82f6' }, // blue-500
    { id: 'tier2', name: 'Premium', price: 50, duration: 1, features: ['Gym Access', 'Locker Room', 'Group Classes', 'Sauna'], color: '#a855f7' }, // purple-500
    { id: 'tier3', name: 'VIP', price: 80, duration: 1, features: ['All Premium Features', 'Personal Trainer Session (1/month)', 'Towel Service', 'Smoothie Bar Discount'], color: '#f59e0b' }, // amber-500
];

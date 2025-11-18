import { Payment, PaymentStatus } from '../types';
import { MOCK_USERS } from './mockUsers';
import { MOCK_TIERS } from './membershipTiers';
import { MembershipStatus } from '../types';

export const MOCK_PAYMENTS: Payment[] = MOCK_USERS
    .filter(user => user.role === 'CLIENT' && user.membership.tierId)
    .map((user, index) => {
        const tier = MOCK_TIERS.find(t => t.id === user.membership.tierId);
        let status: PaymentStatus;
        // FIX: Replaced raw strings 'Active' and 'Pending' with MembershipStatus enum members for type-safe comparison.
        switch (user.membership.status) {
            case MembershipStatus.ACTIVE:
                status = PaymentStatus.COMPLETED;
                break;
            case MembershipStatus.PENDING:
                status = PaymentStatus.PENDING;
                break;
            default:
                status = PaymentStatus.FAILED;
                break;
        }

        // Create some variety in dates
        const paymentDate = new Date(user.membership.startDate);
        if (index % 3 === 0) {
            paymentDate.setMonth(paymentDate.getMonth() - 1);
        }
        if (index % 5 === 0) {
            status = PaymentStatus.FAILED; // Add some failed payments
        }


        return {
            id: `p${user.id}-${index}`,
            userId: user.id,
            amount: tier?.price || 0,
            date: paymentDate.toISOString(),
            status: status,
            tierId: user.membership.tierId!,
        };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
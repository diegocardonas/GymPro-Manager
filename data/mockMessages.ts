import { Message } from '../types';

export const MOCK_MESSAGES: Message[] = [
    // Conversation between Samantha Williams (client '2') and Chris Validator (trainer 't1')
    {
        id: 'm1',
        conversationId: '2-t1',
        senderId: 't1',
        receiverId: '2',
        text: 'Hey Samantha, great job on your last workout! How did the increased weight on the bench press feel?',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        isRead: true,
    },
    {
        id: 'm2',
        conversationId: '2-t1',
        senderId: '2',
        receiverId: 't1',
        text: 'Thanks, Chris! It was challenging but I managed to complete all the sets. My chest was definitely sore the next day.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
    },
    {
        id: 'm3',
        conversationId: '2-t1',
        senderId: 't1',
        receiverId: '2',
        text: 'That\'s a good sign! Keep up the great work. Let me know if you need any adjustments to your routine.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
    },

    // Conversation between Michael Brown (client '3') and Diana Prince (trainer 't2')
    {
        id: 'm4',
        conversationId: '3-t2',
        senderId: '3',
        receiverId: 't2',
        text: 'Hi Diana, I had a question about the deadlift form. Can we go over it quickly before my next session?',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
    },
    {
        id: 'm5',
        conversationId: '3-t2',
        senderId: 't2',
        receiverId: '3',
        text: 'Of course, Michael. Let\'s do that. Just find me on the floor 10 minutes before your scheduled workout time.',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
        isRead: true,
    },
];

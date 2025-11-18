import React, { useState, useMemo, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Notification, NotificationType } from '../types';
import { BellIcon } from './icons/BellIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';

const typeInfo: Record<NotificationType, { icon: React.FC<any>, color: string, bgColor: string }> = {
    [NotificationType.SUCCESS]: { icon: CheckCircleIcon, color: 'text-green-800 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-500/20' },
    [NotificationType.WARNING]: { icon: ClockIcon, color: 'text-yellow-800 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-500/20' },
    [NotificationType.ALERT]: { icon: XCircleIcon, color: 'text-red-800 dark:text-red-300', bgColor: 'bg-red-100 dark:bg-red-500/20' },
    [NotificationType.INFO]: { icon: BellIcon, color: 'text-blue-800 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-500/20' },
};

const NotificationsView: React.FC = () => {
    const { currentUser, notifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } = useContext(AuthContext);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const userNotifications = useMemo(() => {
        if (!currentUser) return [];
        const filtered = notifications.filter(n => n.userId === currentUser.id);
        if (filter === 'unread') return filtered.filter(n => !n.isRead);
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, currentUser, filter]);

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };
    
    if (!currentUser) return null;

    return (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h2>
            </div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex space-x-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400'}`}>All</button>
                    <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${filter === 'unread' ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow' : 'text-gray-500 dark:text-gray-400'}`}>Unread</button>
                </div>
                 <button 
                    onClick={() => markAllNotificationsAsRead(currentUser.id)}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                 >
                    Mark all as read
                 </button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                {userNotifications.length > 0 ? userNotifications.map(n => {
                    const { icon: Icon, color, bgColor } = typeInfo[n.type];
                    return (
                         <div key={n.id} className={`p-4 flex items-start gap-4 transition-colors ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                            <div className={`p-2 rounded-full ${bgColor}`}>
                                <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                            </div>
                            <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                                <p className="text-xs text-gray-400 dark:text-gray-500">{timeSince(n.timestamp)}</p>
                                <div className="flex items-center gap-2">
                                    {!n.isRead && (
                                        <button onClick={() => markNotificationAsRead(n.id)} title="Mark as read" className="w-2 h-2 rounded-full bg-blue-500 hover:bg-blue-700"></button>
                                    )}
                                    <button onClick={() => deleteNotification(n.id)} title="Delete notification" className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                     <p className="p-8 text-center text-gray-500 dark:text-gray-400">You have no {filter === 'unread' ? 'unread' : ''} notifications.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsView;

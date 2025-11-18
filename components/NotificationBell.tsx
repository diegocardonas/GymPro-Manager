import React, { useState, useContext, useMemo, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BellIcon } from './icons/BellIcon';
import { Notification, NotificationType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ClockIcon } from './icons/ClockIcon';

const typeIcons: Record<NotificationType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [NotificationType.SUCCESS]: CheckCircleIcon,
    [NotificationType.WARNING]: ClockIcon,
    [NotificationType.ALERT]: XCircleIcon,
    [NotificationType.INFO]: BellIcon,
};

const typeColors: Record<NotificationType, string> = {
    [NotificationType.SUCCESS]: 'text-green-500 dark:text-green-400',
    [NotificationType.WARNING]: 'text-yellow-500 dark:text-yellow-400',
    [NotificationType.ALERT]: 'text-red-500 dark:text-red-400',
    [NotificationType.INFO]: 'text-blue-500 dark:text-blue-400',
};

const NotificationBell: React.FC<{ onViewAll: () => void; onNotificationClick: (view: string) => void; }> = ({ onViewAll, onNotificationClick }) => {
    const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const userNotifications = useMemo(() => {
        if (!currentUser) return [];
        return notifications
            .filter(n => n.userId === currentUser.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [notifications, currentUser]);

    const unreadCount = useMemo(() => userNotifications.filter(n => !n.isRead).length, [userNotifications]);
    
    const togglePopover = () => {
        setIsOpen(prev => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "m ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " min ago";
        return Math.floor(seconds) + "s ago";
    };
    
    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markNotificationAsRead(notification.id);
        }
        if (notification.linkTo) {
            const view = notification.linkTo.replace(/^\//, '');
            onNotificationClick(view);
            setIsOpen(false);
        }
    };

    const handleMarkAllAsRead = () => {
        if (currentUser) {
            markAllNotificationsAsRead(currentUser.id);
        }
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button onClick={togglePopover} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative" aria-label="Notifications">
                <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 ring-2 ring-white dark:ring-gray-800">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-50">
                    <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={unreadCount === 0}
                        >
                            Mark all as read
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {userNotifications.length > 0 ? (
                            userNotifications.slice(0, 5).map(n => {
                                const Icon = typeIcons[n.type];
                                const color = typeColors[n.type];
                                const content = (
                                    <>
                                        <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${color}`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{n.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeSince(n.timestamp)}</p>
                                        </div>
                                         {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 self-center"></div>}
                                    </>
                                );
                                const commonClasses = `w-full text-left p-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`;

                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={commonClasses}
                                        disabled={n.isRead && !n.linkTo}
                                    >
                                        {content}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No notifications yet.</p>
                        )}
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={() => { onViewAll(); setIsOpen(false); }} className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;


import React from 'react';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '../icons/HomeIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

interface BottomNavigationProps {
    activeView: string;
    onNavigate: (view: any) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeView, onNavigate }) => {
    const { t } = useTranslation();

    const navItems = [
        { id: 'dashboard', label: t('sidebar.home'), icon: HomeIcon },
        { id: 'routine', label: t('client.sidebar.routine'), icon: ClipboardListIcon },
        { id: 'classes', label: t('client.sidebar.classes'), icon: CalendarDaysIcon },
        { id: 'profile', label: t('client.sidebar.profile'), icon: UserCircleIcon },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {navItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onNavigate(item.id)}
                            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary'}`} />
                            <span className="text-xs truncate w-full text-center">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

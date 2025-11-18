import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { CogIcon } from './icons/CogIcon';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';
import { WrenchScrewdriverIcon } from './icons/WrenchScrewdriverIcon';
import { LogoIcon } from './icons/LogoIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { BellIcon } from './icons/BellIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { MegaphoneIcon } from './icons/MegaphoneIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { WrenchIcon } from './icons/WrenchIcon';


type View = 'dashboard' | 'users' | 'reports' | 'membership-tiers' | 'routine-templates' | 'app-settings' | 'notifications' | 'settings' | 'payments' | 'class-schedule' | 'announcements' | 'challenges' | 'equipment';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
    const { t } = useTranslation();
    const navItems = [
        { id: 'dashboard', label: t('admin.sidebar.dashboard'), icon: ChartBarIcon },
        { id: 'users', label: t('admin.sidebar.userManagement'), icon: UserGroupIcon },
        { id: 'payments', label: t('admin.sidebar.finances'), icon: CurrencyDollarIcon },
        { id: 'reports', label: t('admin.sidebar.reports'), icon: DocumentChartBarIcon },
        { id: 'class-schedule', label: t('admin.sidebar.classSchedule'), icon: CalendarDaysIcon },
        { id: 'announcements', label: t('admin.sidebar.announcements'), icon: MegaphoneIcon },
        { id: 'challenges', label: t('admin.sidebar.challenges'), icon: TrophyIcon },
        { id: 'equipment', label: t('admin.sidebar.equipment'), icon: WrenchIcon },
        { id: 'membership-tiers', label: t('admin.sidebar.membershipTiers'), icon: CreditCardIcon },
        { id: 'routine-templates', label: t('admin.sidebar.routineTemplates'), icon: ClipboardDocumentListIcon },
        { id: 'notifications', label: t('admin.sidebar.notifications'), icon: BellIcon },
        { id: 'app-settings', label: t('admin.sidebar.appSettings'), icon: WrenchScrewdriverIcon },
        { id: 'settings', label: t('admin.sidebar.mySettings'), icon: CogIcon },
    ];

    return (
        <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                <LogoIcon className="w-10 h-10" />
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                    GymPro
                </span>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <button 
                                onClick={() => {
                                    setActiveView(item.id as View);
                                    onClose();
                                }}
                                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-lg transition-colors ${activeView === item.id ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <item.icon className="w-6 h-6" />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
import React from 'react';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { CogIcon } from '../icons/CogIcon';
import { LogoIcon } from '../icons/LogoIcon';
import { BellIcon } from '../icons/BellIcon';
import { ClipboardDocumentListIcon } from '../icons/ClipboardDocumentListIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';

type View = 'dashboard' | 'clients' | 'schedule' | 'messages' | 'profile' | 'routine-templates' | 'notifications' | 'settings';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    isOpen: boolean;
    onClose: () => void;
}

const TrainerSidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
    const navItems = [
        { id: 'dashboard', label: 'Panel de Control', icon: ChartBarIcon },
        { id: 'clients', label: 'Mis Clientes', icon: UserGroupIcon },
        { id: 'schedule', label: 'Mi Horario', icon: CalendarDaysIcon },
        { id: 'messages', label: 'Mensajes', icon: ChatBubbleLeftRightIcon },
        { id: 'routine-templates', label: 'Mis Plantillas', icon: ClipboardDocumentListIcon },
        { id: 'profile', label: 'Mi Perfil', icon: UserCircleIcon },
        { id: 'notifications', label: 'Notificaciones', icon: BellIcon },
        { id: 'settings', label: 'Ajustes', icon: CogIcon },
    ];

    return (
        <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                <LogoIcon className="w-10 h-10" />
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400">
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
};

export default TrainerSidebar;
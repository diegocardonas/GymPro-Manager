
import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LogoIcon } from './icons/LogoIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { MenuIcon } from './icons/MenuIcon';
import NotificationBell from './NotificationBell';
import NotificationsView from './NotificationsView';
import LanguageSwitcher from './LanguageSwitcher';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import MessagingView from './MessagingView';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import Footer from './Footer';

type View = 'schedule' | 'messages' | 'notifications';

const GroupInstructorDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, logout, gymClasses, users, toggleReportModal } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<View>('schedule');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const myClasses = useMemo(() => {
        const matches = gymClasses.filter(c => c.trainerId === currentUser?.id);
        return matches.length > 0 ? matches : gymClasses.slice(0, 3); 
    }, [gymClasses, currentUser]);

    const renderContent = () => {
        switch (activeView) {
            case 'schedule':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('instructor.myClasses')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myClasses.map(cls => (
                                <div key={cls.id} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-primary">{cls.name}</h3>
                                            <p className="text-sm text-gray-500">{new Date(cls.startTime).toLocaleDateString()} • {new Date(cls.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                                            {cls.bookedClientIds.length} / {cls.capacity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{cls.description}</p>
                                    
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">{t('instructor.attendees')}</h4>
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {cls.bookedClientIds.slice(0, 5).map(userId => {
                                                const u = users.find(user => user.id === userId);
                                                return u ? <img key={userId} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800" src={u.avatarUrl} alt={u.name} /> : null;
                                            })}
                                            {cls.bookedClientIds.length > 5 && (
                                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 text-xs font-medium">+{cls.bookedClientIds.length - 5}</span>
                                            )}
                                             {cls.bookedClientIds.length === 0 && <span className="text-sm text-gray-400 italic">{t('instructor.noSignups')}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'messages':
                return <MessagingView />;
            case 'notifications':
                return <NotificationsView />;
            default:
                return null;
        }
    };

    const getViewTitle = (view: View) => {
        switch(view) {
            case 'schedule': return t('instructor.myClasses');
            case 'messages': return t('general.messages');
            case 'notifications': return t('admin.dashboard.notifications');
            default: return view;
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
             <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                    <LogoIcon className="w-10 h-10" />
                    <span className="text-xl font-bold text-primary">{t('instructor.title')}</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveView('schedule')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'schedule' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <CalendarDaysIcon className="w-6 h-6" />
                        <span>{t('instructor.myClasses')}</span>
                    </button>
                    <button onClick={() => setActiveView('messages')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'messages' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                        <span>{t('general.messages')}</span>
                    </button>
                </nav>
                 <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                     <button onClick={toggleReportModal} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}>
                        <ExclamationTriangleIcon className="w-6 h-6" />
                        <span>{t('app.reportProblem')}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out ml-0">
                 <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold capitalize">{getViewTitle(activeView)}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <NotificationBell onViewAll={() => setActiveView('notifications')} onNotificationClick={() => {}} />
                        <div className="flex items-center space-x-2">
                            <img src={currentUser?.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                            <span className="hidden sm:inline font-medium">{currentUser?.name}</span>
                        </div>
                        <button onClick={logout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>
                <main className="p-6 flex-1 overflow-y-auto">
                    {renderContent()}
                </main>
                <Footer />
            </div>
             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" />}
        </div>
    );
};

export default GroupInstructorDashboard;

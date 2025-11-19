
import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Role, MembershipStatus } from '../types';
import { useTranslation } from 'react-i18next';
import { LogoIcon } from './icons/LogoIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { MenuIcon } from './icons/MenuIcon';
import NotificationBell from './NotificationBell';
import NotificationsView from './NotificationsView';
import LanguageSwitcher from './LanguageSwitcher';
import { CheckIcon } from './icons/CheckIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import Footer from './Footer';
import { UserProfileMenu } from './shared/UserProfileMenu';
import SettingsView from './SettingsView';

type View = 'check-in' | 'users' | 'classes' | 'notifications' | 'settings';

const ReceptionistDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, logout, users, gymClasses, addNotification, toggleReportModal } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<View>('check-in');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedInUsers, setCheckedInUsers] = useState<string[]>([]);

    const handleCheckIn = (user: User) => {
        if (user.membership.status !== MembershipStatus.ACTIVE) {
            alert(`${user.name} has an ${user.membership.status} membership!`);
            return;
        }
        if (!checkedInUsers.includes(user.id)) {
            setCheckedInUsers(prev => [user.id, ...prev]);
            addNotification({
                userId: user.id,
                title: 'Check-In Successful',
                message: `Welcome to the gym, ${user.name}!`,
                type: 'success' as any
            });
            alert(t('receptionist.checkInSuccess', { name: user.name }));
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => 
            u.role === Role.CLIENT && 
            (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    const todayClasses = useMemo(() => {
        const today = new Date();
        return gymClasses.filter(c => {
            const classDate = new Date(c.startTime);
            return classDate.getDate() === today.getDate() && 
                   classDate.getMonth() === today.getMonth() && 
                   classDate.getFullYear() === today.getFullYear();
        }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [gymClasses]);

    const renderContent = () => {
        switch (activeView) {
            case 'check-in':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('receptionist.checkIn')}</h2>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder={t('receptionist.searchMember')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-4 pl-12 rounded-lg bg-gray-100 dark:bg-gray-700 border-transparent focus:ring-2 focus:ring-primary text-lg"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <IdentificationIcon className="w-6 h-6" />
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-2">
                                {searchTerm && filteredUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${user.membership.status === MembershipStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.membership.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleCheckIn(user)}
                                            disabled={checkedInUsers.includes(user.id)}
                                            className={`px-6 py-2 rounded-lg font-bold transition-colors ${checkedInUsers.includes(user.id) ? 'bg-green-500 text-white cursor-default' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                                        >
                                            {checkedInUsers.includes(user.id) ? t('receptionist.checkedIn') : t('receptionist.checkInButton')}
                                        </button>
                                    </div>
                                ))}
                                {searchTerm && filteredUsers.length === 0 && (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('receptionist.noMembersFound')}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-primary" />
                                    {t('receptionist.upcomingClasses')} ({t('messagingView.today')})
                                </h3>
                                <div className="space-y-3">
                                    {todayClasses.length > 0 ? todayClasses.map(cls => (
                                        <div key={cls.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{cls.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(cls.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                    {new Date(cls.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </p>
                                            </div>
                                            <span className="text-sm font-bold text-primary">{cls.bookedClientIds.length}/{cls.capacity}</span>
                                        </div>
                                    )) : <p className="text-gray-500 text-sm">{t('receptionist.noClassesToday')}</p>}
                                </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                    {t('receptionist.recentCheckIns')}
                                </h3>
                                <div className="space-y-3">
                                    {checkedInUsers.slice(0, 5).map(id => {
                                        const u = users.find(user => user.id === id);
                                        return u ? (
                                            <div key={id} className="flex items-center gap-3 p-2">
                                                <img src={u.avatarUrl} className="w-8 h-8 rounded-full" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{u.name}</span>
                                                <span className="ml-auto text-xs text-gray-400">{t('general.justNow')}</span>
                                            </div>
                                        ) : null;
                                    })}
                                    {checkedInUsers.length === 0 && <p className="text-gray-500 text-sm">{t('receptionist.noCheckInsYet')}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">{t('general.actions')} - {t('admin.userManagement.clients')}</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">{t('general.name')}</th>
                                        <th className="p-3">{t('general.status')}</th>
                                        <th className="p-3">{t('general.phone')}</th>
                                        <th className="p-3 rounded-tr-lg">{t('general.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {users.filter(u => u.role === Role.CLIENT).map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3">
                                                 <span className={`text-xs px-2 py-1 rounded-full ${user.membership.status === MembershipStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.membership.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-500">{user.phone}</td>
                                            <td className="p-3">
                                                <button onClick={() => handleCheckIn(user)} className="text-primary hover:underline text-sm font-semibold">{t('receptionist.checkInButton')}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
             case 'notifications':
                return <NotificationsView />;
             case 'settings':
                return <SettingsView />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
            {/* Sidebar */}
             <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                    <LogoIcon className="w-10 h-10" />
                    <span className="text-xl font-bold text-primary">{t('receptionist.title')}</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveView('check-in')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'check-in' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <IdentificationIcon className="w-6 h-6" />
                        <span>{t('receptionist.nav.checkIn')}</span>
                    </button>
                    <button onClick={() => setActiveView('users')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'users' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <UserGroupIcon className="w-6 h-6" />
                        <span>{t('receptionist.nav.members')}</span>
                    </button>
                    <button onClick={() => setActiveView('classes')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'classes' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <CalendarDaysIcon className="w-6 h-6" />
                        <span>{t('receptionist.nav.classes')}</span>
                    </button>
                </nav>
                 <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                     <button onClick={toggleReportModal} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}>
                        <ExclamationTriangleIcon className="w-6 h-6" />
                        <span>{t('app.reportProblem')}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out ml-0">
                 <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold capitalize">
                            {activeView === 'check-in' ? t('receptionist.nav.checkIn') : 
                             activeView === 'users' ? t('receptionist.nav.members') : 
                             activeView === 'classes' ? t('receptionist.nav.classes') : 
                             activeView === 'settings' ? t('admin.dashboard.settings') :
                             t('admin.dashboard.notifications')}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <NotificationBell onViewAll={() => setActiveView('notifications')} onNotificationClick={() => {}} />
                        {currentUser && (
                             <UserProfileMenu 
                                user={currentUser}
                                onSettings={() => setActiveView('settings')}
                                onLogout={logout}
                            />
                        )}
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

export default ReceptionistDashboard;

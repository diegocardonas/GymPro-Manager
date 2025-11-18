
import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { User, Role } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { MenuIcon } from './icons/MenuIcon';
import NotificationBell from './NotificationBell';
import NotificationsView from './NotificationsView';
import LanguageSwitcher from './LanguageSwitcher';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { AppleIcon } from './icons/AppleIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

type View = 'clients' | 'logs' | 'notifications';

const NutritionistDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, logout, users } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<View>('clients');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    // In a real app, filter by clients assigned to this nutritionist. For demo, show all clients.
    const clients = useMemo(() => users.filter(u => u.role === Role.CLIENT), [users]);

    const renderContent = () => {
        switch (activeView) {
            case 'clients':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('nutritionist.clients')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clients.map(client => (
                                <div key={client.id} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:ring-primary transition-all">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <img src={client.avatarUrl} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">{client.name}</h3>
                                            <p className="text-sm text-gray-500">{client.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <p><strong>Goals:</strong> {client.fitnessGoals || 'N/A'}</p>
                                        <p><strong>Dietary:</strong> {client.dietaryPreferences || 'N/A'}</p>
                                    </div>
                                    <button 
                                        onClick={() => { setSelectedClient(client); setActiveView('logs'); }}
                                        className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        View Logs
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'logs':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center space-x-2">
                             <button onClick={() => setSelectedClient(null)} className="text-sm text-gray-500 hover:text-primary underline">All Clients</button>
                             <span>/</span>
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedClient ? `${selectedClient.name}'s Logs` : t('nutritionist.nutritionLogs')}
                            </h2>
                        </div>
                        
                        {selectedClient ? (
                             <div className="space-y-4">
                                {selectedClient.nutritionLogs && selectedClient.nutritionLogs.length > 0 ? (
                                    selectedClient.nutritionLogs.map((log, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-mono text-gray-400">{new Date(log.date).toLocaleString()}</span>
                                            </div>
                                            <p className="text-lg font-medium mb-4">{log.mealDescription}</p>
                                            {log.aiAnalysis && (
                                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                                                    <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                                        <AppleIcon className="w-4 h-4" /> AI Analysis
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-4 text-center mb-2">
                                                        <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                                            <p className="text-xs text-gray-500">Protein</p>
                                                            <p className="font-bold">{log.aiAnalysis.estimatedMacros.protein}</p>
                                                        </div>
                                                        <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                                            <p className="text-xs text-gray-500">Carbs</p>
                                                            <p className="font-bold">{log.aiAnalysis.estimatedMacros.carbs}</p>
                                                        </div>
                                                        <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                                            <p className="text-xs text-gray-500">Fat</p>
                                                            <p className="font-bold">{log.aiAnalysis.estimatedMacros.fat}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-green-700 dark:text-green-200 italic">"{log.aiAnalysis.suggestion}"</p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No logs recorded for this client yet.</p>
                                )}
                             </div>
                        ) : (
                            <p className="text-gray-500">{t('nutritionist.selectClient')}</p>
                        )}
                    </div>
                );
            case 'notifications':
                return <NotificationsView />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
             <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                    <LogoIcon className="w-10 h-10" />
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">NutriPro</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveView('clients')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'clients' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <UserGroupIcon className="w-6 h-6" />
                        <span>Clients</span>
                    </button>
                    <button onClick={() => setActiveView('logs')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'logs' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <ClipboardListIcon className="w-6 h-6" />
                        <span>Logs</span>
                    </button>
                </nav>
            </div>

            <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out ml-0">
                 <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold capitalize">{activeView}</h2>
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
            </div>
             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" />}
        </div>
    );
};

export default NutritionistDashboard;

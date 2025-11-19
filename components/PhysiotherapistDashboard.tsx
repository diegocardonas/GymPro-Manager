
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
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import Footer from './Footer';

type View = 'patients' | 'notes' | 'notifications';

const PhysiotherapistDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, logout, users, updateUser, toggleReportModal } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<View>('patients');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [newNote, setNewNote] = useState('');

    const patients = useMemo(() => users.filter(u => u.role === Role.CLIENT), [users]);

    const handleAddNote = () => {
        if (!selectedPatient || !newNote.trim()) return;
        const updatedPatient = {
            ...selectedPatient,
            progressNotes: [
                { date: new Date().toISOString(), note: newNote },
                ...(selectedPatient.progressNotes || [])
            ]
        };
        updateUser(updatedPatient);
        setSelectedPatient(updatedPatient);
        setNewNote('');
        alert(t('physio.noteAddedSuccess'));
    };

    const renderContent = () => {
        switch (activeView) {
            case 'patients':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('physio.patients')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {patients.map(patient => (
                                <div key={patient.id} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 hover:ring-teal-500 transition-all">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <h3 className="font-bold text-lg">{patient.name}</h3>
                                            <p className="text-sm text-gray-500">{patient.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <p><strong>{t('physio.conditions')}:</strong> {patient.medicalConditions || t('physio.noneReported')}</p>
                                    </div>
                                    <button 
                                        onClick={() => { setSelectedPatient(patient); setActiveView('notes'); }}
                                        className="mt-4 w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Manage Recovery
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="space-y-6 animate-fade-in">
                         <div className="flex items-center space-x-2">
                             <button onClick={() => setSelectedPatient(null)} className="text-sm text-gray-500 hover:text-primary underline">{t('nutritionist.allClients')}</button>
                             <span>/</span>
                             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedPatient ? `${selectedPatient.name}` : t('physio.progressNotes')}
                            </h2>
                        </div>

                        {selectedPatient ? (
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-bold mb-4">{t('physio.medicalInfo')}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">{t('physio.conditions')}</label>
                                            <p className="p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg mt-1">{selectedPatient.medicalConditions || t('physio.noneReported')}</p>
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-gray-500">{t('general.emergencyContact')}</label>
                                            <p className="mt-1">{selectedPatient.emergencyContact?.name} - {selectedPatient.emergencyContact?.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg flex flex-col h-[600px]">
                                    <h3 className="text-xl font-bold mb-4">{t('physio.progressNotes')}</h3>
                                    
                                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                        {selectedPatient.progressNotes && selectedPatient.progressNotes.length > 0 ? (
                                            selectedPatient.progressNotes.map((note, idx) => (
                                                <div key={idx} className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                                    <span className="text-xs text-gray-500 block mb-1">{new Date(note.date).toLocaleDateString()}</span>
                                                    <p>{note.note}</p>
                                                </div>
                                            ))
                                        ) : <p className="text-gray-500 text-center py-4">{t('physio.noNotesYet')}</p>}
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <label htmlFor="newNote" className="sr-only">Add Note</label>
                                        <div className="flex gap-2">
                                            <textarea
                                                id="newNote"
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                                placeholder={t('physio.addNotePlaceholder')}
                                                rows={2}
                                            />
                                            <button onClick={handleAddNote} className="px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center">
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        ) : (
                            <p className="text-gray-500">{t('physio.selectPatient')}</p>
                        )}
                    </div>
                );
            case 'notifications':
                return <NotificationsView />;
            default:
                return null;
        }
    };

    const getViewTitle = (view: View) => {
        switch(view) {
            case 'patients': return t('physio.nav.patients');
            case 'notes': return t('physio.nav.notes');
            case 'notifications': return t('admin.dashboard.notifications');
            default: return view;
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
             <div className={`w-64 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-r border-black/10 dark:border-white/10 p-4 flex flex-col fixed h-full z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
                <div className="flex items-center gap-2 mb-10 px-2 pt-2">
                    <LogoIcon className="w-10 h-10" />
                    <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{t('physio.title')}</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <button onClick={() => setActiveView('patients')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'patients' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <UserGroupIcon className="w-6 h-6" />
                        <span>{t('physio.nav.patients')}</span>
                    </button>
                    <button onClick={() => setActiveView('notes')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeView === 'notes' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300' : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
                        <ClipboardListIcon className="w-6 h-6" />
                        <span>{t('physio.nav.notes')}</span>
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

export default PhysiotherapistDashboard;

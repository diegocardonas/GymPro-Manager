
// FIX: Imported `useMemo` to resolve 'Cannot find name' errors.
import React, { useState, useContext, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { LogoutIcon } from './icons/LogoutIcon';
import DashboardOverview from './admin/DashboardOverview';
import UserManagement from './admin/UserManagement';
import { MembershipStatus, Role, User } from '../types';
import Sidebar from './Sidebar';
import { MenuIcon } from './icons/MenuIcon';
import SettingsView from './SettingsView';
// FIX: Changed to a named import as 'Reports' does not have a default export.
import { Reports } from './admin/Reports';
import AppSettings from './admin/AppSettings';
import MembershipTiers from './admin/MembershipTiers';
import NotificationBell from './NotificationBell';
import NotificationsView from './NotificationsView';
import RoutineTemplates from './admin/RoutineTemplates';
import Payments from './admin/Payments';
import ClassSchedule from './admin/ClassSchedule';
import Announcements from './admin/Announcements';
import ChallengesManagement from './admin/ChallengesManagement';
import EquipmentManagement from './admin/EquipmentManagement';
import { MOCK_TIERS } from '../data/membershipTiers';
import { XCircleIcon } from './icons/XCircleIcon';
import { PencilIcon } from './icons/PencilIcon';
import LanguageSwitcher from './LanguageSwitcher';
import Footer from './Footer';


type View = 'dashboard' | 'users' | 'reports' | 'membership-tiers' | 'routine-templates' | 'app-settings' | 'settings' | 'notifications' | 'payments' | 'class-schedule' | 'announcements' | 'challenges' | 'equipment';
export type DashboardFilter = { type: 'status', value: MembershipStatus } | { type: 'role', value: Role.CLIENT | Role.TRAINER } | { type: 'unassigned' } | null;

const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { currentUser, users, logout, updateCurrentUser } = useContext(AuthContext);
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [filter, setFilter] = useState<DashboardFilter>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    // Sidebar states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse

    const [viewingUser, setViewingUser] = useState<User | null>(null);

    const handleNavigation = (view: any, newFilter: DashboardFilter = null) => {
        setFilter(newFilter);
        setActiveView(view);
    };

    const handleProfileSave = (updatedUser: User) => {
        updateCurrentUser(updatedUser);
        setIsEditModalOpen(false);
    }
    
    const renderContent = () => {
        switch(activeView) {
            case 'dashboard':
                return <DashboardOverview onNavigate={handleNavigation} onUserClick={setViewingUser} />;
            case 'users':
                return <UserManagement initialFilter={filter} onFilterClear={() => setFilter(null)} onViewUserDetails={setViewingUser} />;
            case 'reports':
                return <Reports />;
            case 'payments':
                return <Payments />;
            case 'class-schedule':
                return <ClassSchedule />;
            case 'announcements':
                return <Announcements />;
            case 'challenges':
                return <ChallengesManagement />;
            case 'equipment':
                return <EquipmentManagement />;
            case 'membership-tiers':
                return <MembershipTiers />;
            case 'routine-templates':
                return <RoutineTemplates />;
            case 'app-settings':
                return <AppSettings />;
            case 'notifications':
                return <NotificationsView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <DashboardOverview onNavigate={handleNavigation} onUserClick={setViewingUser} />;
        }
    }
    
    const viewTitles: Record<View, string> = {
        dashboard: t('admin.dashboard.title'),
        users: t('admin.dashboard.userManagement'),
        reports: t('admin.dashboard.reports'),
        payments: t('admin.dashboard.finances'),
        'class-schedule': t('admin.dashboard.classSchedule'),
        announcements: t('admin.dashboard.announcements'),
        challenges: t('admin.dashboard.challenges'),
        equipment: t('admin.dashboard.equipment'),
        'membership-tiers': t('admin.dashboard.membershipTiers'),
        'routine-templates': t('admin.dashboard.routineTemplates'),
        'app-settings': t('admin.dashboard.appSettings'),
        notifications: t('admin.dashboard.notifications'),
        settings: t('admin.dashboard.settings')
    }

    const handleOpenEditFromView = (user: User) => {
        setViewingUser(null);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
             {/* Mobile Overlay */}
             {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" aria-hidden="true" />}
            
            {/* Main Content - Adjusts margin based on sidebar state */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-black/10 dark:border-white/10">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {/* Hamburger Menu - Mobile Only */}
                             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden" aria-label="Toggle sidebar">
                                <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                            <h2 className="text-xl font-semibold capitalize text-gray-900 dark:text-white">{viewTitles[activeView]}</h2>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <NotificationBell 
                                onViewAll={() => setActiveView('notifications')}
                                onNotificationClick={(view) => setActiveView(view as View)}
                            />
                            <button onClick={() => setIsEditModalOpen(true)} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">{t('admin.dashboard.welcome', { name: currentUser?.name })}</span>
                                <img src={currentUser?.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"/>
                            </button>
                            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Logout">
                                <LogoutIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
                            </button>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto p-4 md:p-8 flex-1 flex items-start justify-center">
                    <div key={activeView} className="w-full animate-fade-in">
                        {renderContent()}
                    </div>
                </main>
                <Footer />
                {isEditModalOpen && currentUser && <AdminEditProfileModal user={currentUser} onSave={handleProfileSave} onClose={() => setIsEditModalOpen(false)} />}
                {viewingUser && <UserDetailsModal user={viewingUser} allUsers={users} onClose={() => setViewingUser(null)} onEdit={handleOpenEditFromView} />}
            </div>
        </div>
    );
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{title}</h3>
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">{children}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-800 dark:text-gray-200 font-medium">{value || 'N/A'}</p>
    </div>
);

const UserDetailsModal: React.FC<{ user: User; allUsers: User[]; onClose: () => void; onEdit: (user: User) => void; }> = ({ user, allUsers, onClose, onEdit }) => {
    const { t } = useTranslation();
    const tier = useMemo(() => MOCK_TIERS.find(t => t.id === user.membership.tierId), [user]);
    const trainers = useMemo(() => allUsers.filter(u => u.role === Role.TRAINER), [allUsers]);
    const clients = useMemo(() => allUsers.filter(u => u.role === Role.CLIENT), [allUsers]);

    const assignedTrainers = useMemo(() => trainers.filter(t => user.trainerIds?.includes(t.id)).map(t => t.name).join(', '), [trainers, user.trainerIds]);
    const clientCount = useMemo(() => clients.filter(c => c.trainerIds?.includes(user.id)).length, [clients, user.id]);

    const roleBg = user.role === Role.CLIENT ? 'bg-blue-500' : user.role === Role.TRAINER ? 'bg-purple-500' : 'bg-gray-500';
    // FIX: Corrected the properties of the `statusClasses` object to use the enum keys (ACTIVE, EXPIRED, PENDING) instead of Spanish string values.
    const statusClasses: Record<MembershipStatus, string> = {
        [MembershipStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
        [MembershipStatus.EXPIRED]: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
        [MembershipStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                             <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${roleBg} capitalize`}>{t(`roles.${user.role}`)}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><XCircleIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <DetailSection title={t('admin.userDetailsModal.keyInfo')}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user.role === Role.CLIENT ? (
                                <>
                                    <DetailItem label={t('admin.userDetailsModal.status')} value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[user.membership.status]}`}>{t(`statuses.membership.${user.membership.status}`)}</span>} />
                                    <DetailItem label={t('admin.userDetailsModal.tier')} value={tier?.name} />
                                </>
                            ) : (
                                <DetailItem label={t('admin.userDetailsModal.status')} value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[user.membership.status]}`}>{t(`statuses.membership.${user.membership.status}`)}</span>}/>
                            )}
                             {user.role === Role.TRAINER && <DetailItem label={t('admin.userDetailsModal.clientLoad')} value={t('admin.userDetailsModal.clientsCount', { count: clientCount })} />}
                            <DetailItem label={t('admin.userDetailsModal.memberSince')} value={new Date(user.joinDate).toLocaleDateString()} />
                             {user.role === Role.CLIENT && <DetailItem label={t('admin.userDetailsModal.expiresOn')} value={new Date(user.membership.endDate).toLocaleDateString()} />}
                        </div>
                         {user.role === Role.CLIENT && <DetailItem label={t('admin.userDetailsModal.assignedTrainers')} value={assignedTrainers || t('admin.userDetailsModal.none')} />}
                    </DetailSection>

                    <DetailSection title={t('admin.userDetailsModal.personalInfo')}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DetailItem label={t('admin.userDetailsModal.phone')} value={user.phone} />
                            <DetailItem label={t('admin.userDetailsModal.gender')} value={user.gender ? t(`genders.${user.gender}`) : undefined} />
                            <DetailItem label={t('admin.userDetailsModal.age')} value={user.age ? t('admin.userDetailsModal.ageYears', { age: user.age }) : undefined} />
                        </div>
                    </DetailSection>
                    
                    {user.role === Role.CLIENT && (
                         <DetailSection title={t('admin.userDetailsModal.healthFitness')}>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <DetailItem label={t('admin.userDetailsModal.fitnessLevel')} value={user.fitnessLevel ? t(`fitnessLevels.${user.fitnessLevel}`) : undefined} />
                                <DetailItem label={t('admin.userDetailsModal.height')} value={user.height ? t('admin.userDetailsModal.heightCm', { height: user.height }) : undefined} />
                                <DetailItem label={t('admin.userDetailsModal.weight')} value={user.weight ? t('admin.userDetailsModal.weightKg', { weight: user.weight }) : undefined} />
                            </div>
                            <DetailItem label={t('admin.userDetailsModal.fitnessGoals')} value={<p className="whitespace-pre-wrap">{user.fitnessGoals}</p>} />
                            <DetailItem label={t('admin.userDetailsModal.dietaryPreferences')} value={<p className="whitespace-pre-wrap">{user.dietaryPreferences}</p>} />
                             <DetailItem label={t('admin.userDetailsModal.medicalConditions')} value={<p className="whitespace-pre-wrap">{user.medicalConditions}</p>} />
                        </DetailSection>
                    )}
                    
                    {user.role !== Role.CLIENT && user.skills && (
                        <DetailSection title={t('admin.userDetailsModal.professionalInfo')}>
                             <DetailItem label={t('admin.userDetailsModal.skills')} value={user.skills} />
                        </DetailSection>
                    )}

                    <DetailSection title={t('admin.userDetailsModal.emergencyContact')}>
                         <div className="grid grid-cols-2 gap-4">
                             <DetailItem label={t('admin.userDetailsModal.name')} value={user.emergencyContact?.name} />
                             <DetailItem label={t('admin.userDetailsModal.phone')} value={user.emergencyContact?.phone} />
                         </div>
                    </DetailSection>
                </div>
                <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold">{t('admin.userDetailsModal.close')}</button>
                    <button onClick={() => onEdit(user)} className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-primary-foreground flex items-center space-x-2">
                        <PencilIcon className="h-4 w-4"/>
                        <span>{t('admin.userDetailsModal.editUser')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const AdminEditProfileModal: React.FC<{user: User, onSave: (user: User) => void, onClose: () => void}> = ({ user, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'emergencyContactName') {
            setFormData(prev => ({...prev, emergencyContact: { ...prev.emergencyContact, name: value, phone: prev.emergencyContact?.phone || '' }}));
        } else if (name === 'emergencyContactPhone') {
             setFormData(prev => ({...prev, emergencyContact: { ...prev.emergencyContact, phone: value, name: prev.emergencyContact?.name || '' }}));
        } else {
             setFormData(prev => ({...prev, [name]: value}));
        }
    };
    
    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRandomAvatar = () => {
        setFormData(prev => ({...prev, avatarUrl: `https://picsum.photos/seed/${Date.now()}/200`}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
                <h2 className="text-2xl font-bold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">{t('admin.editProfileModal.title')}</h2>
                
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="flex items-center space-x-4">
                        <img src={formData.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover"/>
                        <div className="flex flex-col gap-2">
                             <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm rounded-lg text-gray-800 dark:text-gray-200"
                            >
                                {t('admin.editProfileModal.uploadPhoto')}
                            </button>
                            <button type="button" onClick={handleRandomAvatar} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-sm rounded-lg text-gray-800 dark:text-gray-200">{t('admin.editProfileModal.randomAvatar')}</button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarFileChange}
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-800 dark:text-gray-200">{t('admin.editProfileModal.personalInfo')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('general.name')}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" required/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('general.email')}</label>
                            <input type="email" name="email" id="email" value={formData.email} className="mt-1 block w-full bg-gray-200/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" disabled/>
                            <p className="text-xs text-gray-500 mt-1">{t('admin.userManagement.emailCannotBeChanged')}</p>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('general.phone')}</label>
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white"/>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.gender')}</label>
                            <select name="gender" id="gender" value={formData.gender || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white">
                                <option value="">{t('admin.editProfileModal.selectGender')}</option>
                                <option value="Masculino">{t('genders.Masculino')}</option>
                                <option value="Femenino">{t('genders.Femenino')}</option>
                                <option value="Otro">{t('genders.Otro')}</option>
                                <option value="Prefiero no decirlo">{t('genders.Prefiero no decirlo')}</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.editProfileModal.age')}</label>
                            <input type="number" name="age" id="age" value={formData.age || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 pt-4 text-gray-800 dark:text-gray-200">{t('admin.editProfileModal.emergencyContact')}</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.editProfileModal.contactName')}</label>
                            <input type="text" name="emergencyContactName" id="emergencyContactName" value={formData.emergencyContact?.name || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.editProfileModal.contactPhone')}</label>
                            <input type="tel" name="emergencyContactPhone" id="emergencyContactPhone" value={formData.emergencyContact?.phone || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky bottom-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold transition-colors text-gray-800 dark:text-gray-200">{t('general.cancel')}</button>
                    <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors text-primary-foreground">{t('general.saveChanges')}</button>
                </div>
            </form>
        </div>
    )
};

export default AdminDashboard;

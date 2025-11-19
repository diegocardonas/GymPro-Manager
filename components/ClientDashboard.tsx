
import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MembershipStatus, User, Role, DailyRoutine, FitnessLevel, MembershipTier, NotificationType, Announcement, PreEstablishedRoutine } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';
import { PencilIcon } from './icons/PencilIcon';
import { MenuIcon } from './icons/MenuIcon';
import ClientSidebar from './client/ClientSidebar';
import SettingsView from './SettingsView';
import MembershipCard from './client/MembershipCard';
import NotificationBell from './NotificationBell';
import NotificationsView from './NotificationsView';
import { MOCK_TIERS } from '../data/membershipTiers';
import WorkoutLog from './client/WorkoutLog';
import ProgressView from './client/ProgressView';
import ClassBooking from './client/ClassBooking';
import MessagingView from './MessagingView';
import AICoachView from './client/AICoachView';
import ChallengesView from './client/ChallengesView';
import AchievementsView from './client/AchievementsView';
import NutritionLog from './client/NutritionLog';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { ShareIcon } from './icons/ShareIcon';
import ShareRoutineModal from './shared/ShareRoutineModal';
import Footer from './Footer';
import { useTranslation } from 'react-i18next';
import { UserProfileMenu } from './shared/UserProfileMenu';
import { BottomNavigation } from './shared/BottomNavigation';
import { LogoIcon } from './icons/LogoIcon';

type View = 'dashboard' | 'routine' | 'workout-log' | 'progress' | 'classes' | 'messages' | 'membership-card' | 'profile' | 'notifications' | 'settings' | 'ai-coach' | 'challenges' | 'achievements' | 'nutrition-log';

const StatusBadge: React.FC<{ status: MembershipStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const statusInfo: Record<MembershipStatus, { classes: string; text: string }> = {
    [MembershipStatus.ACTIVE]: { classes: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: t(`statuses.membership.${MembershipStatus.ACTIVE}`) },
    [MembershipStatus.EXPIRED]: { classes: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300', text: t(`statuses.membership.${MembershipStatus.EXPIRED}`) },
    [MembershipStatus.PENDING]: { classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300', text: t(`statuses.membership.${MembershipStatus.PENDING}`) },
  };
  const { classes, text } = statusInfo[status];

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${classes}`}>
      {text}
    </span>
  );
};

const DashboardView: React.FC<{user: User, trainers: User[], tier: MembershipTier | undefined, onRenew: () => void, announcements: Announcement[], onNavigate: (view: View, contact?: User) => void}> = ({ user, trainers, tier, onRenew, announcements, onNavigate }) => {
    const { t } = useTranslation();
    const { name, membership } = user;
    const endDate = new Date(membership.endDate);
    const isExpired = new Date() > endDate;
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const isPending = membership.status === MembershipStatus.PENDING;
    const latestAnnouncement = announcements[0];

    return (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 md:p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('client.dashboard.welcomeBack', { name })}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{t('client.dashboard.summaryDesc')}</p>
            
            {latestAnnouncement && (
                <div className="mb-8 p-4 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200">{latestAnnouncement.title}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{latestAnnouncement.content}</p>
                </div>
            )}
            
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('client.dashboard.membershipStatus')}</h3>
                    <StatusBadge status={membership.status} />
                </div>
                 {tier && (
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-gray-500 dark:text-gray-400 text-xl font-semibold">{t('client.dashboard.level')}:</span>
                        <span className={`font-semibold px-4 py-2 rounded-full text-sm text-white`} style={{backgroundColor: tier.color}}>{tier.name}</span>
                    </div>
                 )}
                 <div className="flex justify-between items-baseline pt-4">
                    <span className="text-gray-500 dark:text-gray-400">{t('client.dashboard.yourTrainers')}:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-100 text-right">
                        {trainers.length > 0 ? trainers.map((t, i) => (
                           <React.Fragment key={t.id}>
                               <button onClick={() => onNavigate('messages', t)} className="hover:underline text-primary">{t.name}</button>
                               {i < trainers.length - 1 && ', '}
                           </React.Fragment>
                        )) : t('client.dashboard.unassigned')}
                    </div>
                </div>
                
                <div className="text-left pt-2">
                    <div className="flex justify-between items-baseline">
                        <span className="text-gray-500 dark:text-gray-400">{t('client.dashboard.startDate')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{new Date(membership.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-2">
                        <span className="text-gray-500 dark:text-gray-400">{t('client.dashboard.endDate')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-100">{endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                        {membership.status === MembershipStatus.ACTIVE && !isExpired ? (
                             <p className="text-center text-lg">
                                {t('client.dashboard.validFor')} <span className="font-bold text-teal-600 dark:text-teal-300">{daysRemaining}</span> {t('client.dashboard.days')}.
                            </p>
                        ) : membership.status === MembershipStatus.EXPIRED ? (
                            <p className="text-center text-lg text-red-600 dark:text-red-400 font-semibold">
                                {t('client.dashboard.pleaseRenew')}
                            </p>
                        ) : (
                             <p className="text-center text-lg text-yellow-600 dark:text-yellow-400 font-semibold">
                                {t('client.dashboard.renewalPending')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <button 
                onClick={onRenew} 
                disabled={isPending}
                className="mt-8 w-full mx-auto max-w-xs px-4 py-3 text-lg font-semibold text-primary-foreground bg-primary rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75 transition duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? t('client.dashboard.renewPendingButton') : t('client.dashboard.renewButton')}
            </button>
        </div>
    );
};

const RoutineView: React.FC<{onNavigate: (view: View) => void, onShare: (routine: DailyRoutine[]) => void}> = ({ onNavigate, onShare }) => {
    const { t } = useTranslation();
    const { currentUser, myTrainers } = useContext(AuthContext);
    const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);

    const assignedRoutines = useMemo(() => currentUser?.assignedRoutines || [], [currentUser]);

    const trainersWithRoutines = useMemo(() => {
        const trainerIdsWithRoutines = new Set(assignedRoutines.map(ar => ar.trainerId));
        return (myTrainers || []).filter(trainer => trainerIdsWithRoutines.has(trainer.id));
    }, [myTrainers, assignedRoutines]);

    useEffect(() => {
        if (trainersWithRoutines.length > 0 && !trainersWithRoutines.some(t => t.id === selectedTrainerId)) {
            setSelectedTrainerId(trainersWithRoutines[0].id);
        } else if (trainersWithRoutines.length === 0) {
            setSelectedTrainerId(null);
        }
    }, [trainersWithRoutines, selectedTrainerId]);

    const selectedRoutine = useMemo(() => 
        assignedRoutines.find(ar => ar.trainerId === selectedTrainerId)?.routine,
        [assignedRoutines, selectedTrainerId]
    );

    const selectedTrainer = useMemo(() => 
        myTrainers?.find(t => t.id === selectedTrainerId),
        [myTrainers, selectedTrainerId]
    );

    const weekDays: DailyRoutine['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('client.routine.title')}</h2>
                <div className="flex items-center gap-2">
                    {trainersWithRoutines.length > 1 && (
                        <>
                            <label htmlFor="trainer-select" className="text-gray-500 dark:text-gray-400 font-medium">{t('client.routine.trainer')}:</label>
                            <select
                                id="trainer-select"
                                value={selectedTrainerId || ''}
                                onChange={(e) => setSelectedTrainerId(e.target.value)}
                                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 font-semibold text-gray-800 dark:text-gray-200"
                            >
                                {trainersWithRoutines.map(trainer => (
                                    <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {selectedRoutine && (
                         <button onClick={() => onShare(selectedRoutine)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Share routine">
                            <ShareIcon className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
                        </button>
                    )}
                </div>
            </div>
             {selectedTrainer && ! (trainersWithRoutines.length > 1) && (
                <p className="text-gray-500 dark:text-gray-400 mb-4 -mt-4">
                    {t('client.routine.assignedBy')}: <span className="font-semibold text-gray-700 dark:text-gray-200">{selectedTrainer.name}</span>
                </p>
            )}
            {!selectedRoutine || selectedRoutine.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center">{t('client.routine.noRoutine')}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weekDays.map(day => {
                        const dayRoutine = selectedRoutine.find(r => r.day === day);
                        const hasWorkout = dayRoutine && dayRoutine.exercises.length > 0;
                        return (
                             <button key={day} onClick={() => onNavigate('workout-log')} disabled={!hasWorkout} className={`p-4 rounded-lg text-left transition-all duration-300 ${hasWorkout ? 'bg-gray-100 dark:bg-gray-700/50 hover:ring-2 hover:ring-primary' : 'bg-gray-100/50 dark:bg-gray-700/20 opacity-60 cursor-not-allowed'}`}>
                                <h3 className="font-bold text-lg text-teal-600 dark:text-teal-300 mb-3 border-b border-gray-300 dark:border-gray-600 pb-2">{t(`days.${day}`)}</h3>
                                {hasWorkout ? (
                                    <>
                                        <div className="flex items-baseline text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                                            <span className="flex-grow">{t('client.routine.exercise')}</span>
                                            <span className="w-12 text-center">{t('client.routine.sets')}</span>
                                            <span className="w-16 text-center">{t('client.routine.reps')}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {dayRoutine.exercises.map((ex, index) => (
                                                <div key={index} className="flex items-baseline text-sm">
                                                    <span className="flex-grow text-gray-700 dark:text-gray-300 pr-2">{ex.name}</span>
                                                    <span className="w-12 text-center font-mono text-gray-600 dark:text-gray-400">{ex.sets}</span>
                                                    <span className="w-16 text-center font-mono text-gray-600 dark:text-gray-400">{ex.reps}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-400 dark:text-gray-500 text-center py-4">{t('client.routine.restDay')}</p>
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

const ProfileView: React.FC<{user: User, onEdit: () => void}> = ({ user, onEdit }) => {
    const { t } = useTranslation();
    
    const calculateAge = (birthDate?: string): number | undefined => {
        if (!birthDate) return undefined;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const displayAge = user.birthDate ? calculateAge(user.birthDate) : user.age;

    return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('client.profile.title')}</h2>
            <button onClick={onEdit} className="flex items-center space-x-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-colors w-full sm:w-auto justify-center">
                <PencilIcon className="w-5 h-5"/>
                <span>{t('client.profile.editProfile')}</span>
            </button>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0 text-center">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700 mx-auto" 
                />
                <h3 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            
            <div className="w-full border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 mt-6 md:mt-0 pt-6 md:pt-0 md:pl-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('general.phone')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{user.phone || t('client.profile.notSpecified')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('client.profile.memberSince')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('admin.userDetailsModal.gender')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{user.gender ? t(`genders.${user.gender}`) : t('client.profile.notSpecified')}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('admin.userDetailsModal.age')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{displayAge ? t('admin.userDetailsModal.ageYears', { age: displayAge }) : t('client.profile.notSpecified')}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('client.profile.height')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{user.height ? t('admin.userDetailsModal.heightCm', { height: user.height }) : t('client.profile.notSpecified')}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('client.profile.weight')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{user.weight ? t('admin.userDetailsModal.weightKg', { weight: user.weight }) : t('client.profile.notSpecified')}</p>
                    </div>
                     <div className="sm:col-span-2">
                        <h4 className="font-semibold text-gray-500 dark:text-gray-400">{t('client.profile.fitnessLevel')}</h4>
                        <p className="text-gray-800 dark:text-gray-200">{user.fitnessLevel ? t(`fitnessLevels.${user.fitnessLevel}`) : t('client.profile.notSpecified')}</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                     <div>
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('client.profile.fitnessGoals')}</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.fitnessGoals || t('client.profile.notSpecified')}</p>
                     </div>
                     <div>
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('client.profile.dietaryPreferences')}</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.dietaryPreferences || t('client.profile.notSpecified')}</p>
                     </div>
                      <div>
                        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('client.profile.medicalConditions')}</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{user.medicalConditions || t('client.profile.notSpecified')}</p>
                     </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                     <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">{t('general.emergencyContact')}</h3>
                     <p><span className="font-semibold text-gray-500 dark:text-gray-400">{t('general.name')}:</span> {user.emergencyContact?.name || t('client.profile.notSpecified')}</p>
                     <p><span className="font-semibold text-gray-500 dark:text-gray-400">{t('general.phone')}:</span> {user.emergencyContact?.phone || t('client.profile.notSpecified')}</p>
                </div>
            </div>
        </div>
    </div>
)};


const ClientDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, myTrainers, announcements, logout, updateCurrentUser, addNotification } = useContext(AuthContext);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [preselectedContact, setPreselectedContact] = useState<User | null>(null);
  const [shareModalRoutine, setShareModalRoutine] = useState<DailyRoutine[] | PreEstablishedRoutine | null>(null);

  const trainers = useMemo(() => myTrainers || [], [myTrainers]);
  
  const membershipTier = useMemo(() =>
    MOCK_TIERS.find(t => t.id === currentUser?.membership.tierId),
    [currentUser]
  );

  if (!currentUser) {
    return null;
  }

  const handleProfileSave = (updatedUser: User) => {
    updateCurrentUser(updatedUser);
    setIsEditModalOpen(false);
  }
  
  const handleDashboardNavigation = (view: View, contact?: User) => {
    if(contact) {
        setPreselectedContact(contact);
    }
    setActiveView(view);
  };

  const handleRenewMembership = () => {
    if (!currentUser || currentUser.membership.status === MembershipStatus.PENDING) return;
    
    const updatedUser: User = {
        ...currentUser,
        membership: {
            ...currentUser.membership,
            status: MembershipStatus.PENDING,
        },
    };

    updateCurrentUser(updatedUser);

    addNotification({
        userId: '1',
        title: t('notifications.renewalTitle'),
        message: t('notifications.renewalMsg', { name: currentUser.name }),
        type: NotificationType.INFO,
        linkTo: '/users'
    });

    alert(t('client.dashboard.renewalPending'));
  };
  
  const renderContent = () => {
      switch (activeView) {
          case 'dashboard': return <DashboardView user={currentUser} trainers={trainers} tier={membershipTier} onRenew={handleRenewMembership} announcements={announcements} onNavigate={handleDashboardNavigation} />;
          case 'routine': return <RoutineView onNavigate={setActiveView} onShare={setShareModalRoutine} />;
          case 'workout-log': return <WorkoutLog onNavigate={(view) => setActiveView(view as View)} />;
          case 'progress': return <ProgressView />;
          case 'classes': return <ClassBooking />;
          case 'messages': return <MessagingView preselectedContact={preselectedContact} onPreselectConsumed={() => setPreselectedContact(null)} />;
          case 'ai-coach': return <AICoachView />;
          case 'challenges': return <ChallengesView />;
          case 'achievements': return <AchievementsView />;
          case 'nutrition-log': return <NutritionLog />;
          case 'profile': return <ProfileView user={currentUser} onEdit={() => setIsEditModalOpen(true)} />;
          case 'membership-card': return <MembershipCard user={currentUser} tier={membershipTier} />;
          case 'notifications': return <NotificationsView />;
          case 'settings': return <SettingsView />;
          default: return <DashboardView user={currentUser} trainers={trainers} tier={membershipTier} onRenew={handleRenewMembership} announcements={announcements} onNavigate={handleDashboardNavigation} />;
      }
  }

  return (
    <>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            <div className="hidden md:block h-full">
                <ClientSidebar 
                    activeView={activeView} 
                    setActiveView={setActiveView} 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
            </div>
            
            {/* Mobile Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-20 md:hidden" aria-hidden="true" />}

            {/* Main Content - Adjusts margin based on sidebar state */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out md:${isSidebarCollapsed ? 'ml-20' : 'ml-64'} pb-16 md:pb-0`}>
                <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm sticky top-0 z-30 p-4 flex justify-between items-center border-b border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-2 md:hidden">
                        <LogoIcon className="w-8 h-8" />
                        <span className="font-bold text-primary">GymPro</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-auto">
                        <button onClick={() => setActiveView('messages')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden md:block" aria-label={t('client.sidebar.messages')}>
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                        <NotificationBell 
                            onViewAll={() => setActiveView('notifications')}
                            onNotificationClick={(view) => setActiveView(view as View)}
                        />
                        {currentUser && (
                            <UserProfileMenu 
                                user={currentUser}
                                onEditProfile={() => setIsEditModalOpen(true)}
                                onSettings={() => setActiveView('settings')}
                                onLogout={logout}
                            />
                        )}
                    </div>
                </header>
                <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                    <div key={activeView} className="animate-fade-in w-full">
                        {renderContent()}
                    </div>
                </main>
                <div className="hidden md:block">
                   <Footer />
                </div>
            </div>
            
            <BottomNavigation activeView={activeView} onNavigate={setActiveView} />
            
            {isEditModalOpen && <EditProfileModal user={currentUser} onSave={handleProfileSave} onClose={() => setIsEditModalOpen(false)} />}
        </div>
        {shareModalRoutine && (
            <ShareRoutineModal
                routine={shareModalRoutine}
                onClose={() => setShareModalRoutine(null)}
            />
        )}
    </>
  );
};

const EditProfileModal: React.FC<{user: User, onSave: (user: User) => void, onClose: () => void}> = ({ user, onSave, onClose }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const calculateAge = (birthDate: string): number => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const currentAge = formData.birthDate ? calculateAge(formData.birthDate) : formData.age;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'emergencyContactName') {
            setFormData(prev => ({...prev, emergencyContact: { ...prev.emergencyContact, name: value, phone: prev.emergencyContact?.phone || '' }}));
        } else if (name === 'emergencyContactPhone') {
             setFormData(prev => ({...prev, emergencyContact: { ...prev.emergencyContact, phone: value, name: prev.emergencyContact?.name || '' }}));
        } else if (name === 'birthDate') {
             const newAge = calculateAge(value);
             setFormData(prev => ({...prev, birthDate: value, age: newAge}));
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
                    </div>

                    <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 pt-4 text-gray-800 dark:text-gray-200">{t('admin.userDetailsModal.healthFitness')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('general.birthDate')}</label>
                            <input type="date" name="birthDate" id="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                         <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.editProfileModal.age')}</label>
                            <input type="text" name="age" id="age" value={currentAge !== undefined ? currentAge : ''} readOnly className="mt-1 block w-full bg-gray-200/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.height')} (cm)</label>
                            <input type="number" name="height" id="height" value={formData.height || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.weight')} (kg)</label>
                            <input type="number" name="weight" id="weight" value={formData.weight || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    
                     <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 pt-4 text-gray-800 dark:text-gray-200">{t('admin.userDetailsModal.healthFitness')}</h3>
                     <div>
                        <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.fitnessLevel')}</label>
                        <select name="fitnessLevel" id="fitnessLevel" value={formData.fitnessLevel || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white">
                            <option value="">{t('admin.editProfileModal.selectGender')}</option>
                            {Object.values(FitnessLevel).map(level => <option key={level} value={level}>{t(`fitnessLevels.${level}`)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fitnessGoals" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.fitnessGoals')}</label>
                        <textarea name="fitnessGoals" id="fitnessGoals" value={formData.fitnessGoals || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.dietaryPreferences')}</label>
                        <textarea name="dietaryPreferences" id="dietaryPreferences" value={formData.dietaryPreferences || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-600 dark:text-gray-400">{t('admin.userDetailsModal.medicalConditions')}</label>
                        <textarea name="medicalConditions" id="medicalConditions" value={formData.medicalConditions || ''} onChange={handleChange} rows={3} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-white" />
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


export default ClientDashboard;

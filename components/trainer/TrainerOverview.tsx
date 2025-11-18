import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { MembershipStatus, Role, User } from '../../types';
import { FireIcon } from '../icons/FireIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';
import { TrophyIcon } from '../icons/TrophyIcon';

interface TrainerOverviewProps {
    onNavigate: (view: 'clients' | 'schedule' | 'messages') => void;
    onClientClick: (client: User) => void;
}

const TrainerOverview: React.FC<TrainerOverviewProps> = ({ onNavigate, onClientClick }) => {
    const { currentUser, myClients, gymClasses, announcements } = useContext(AuthContext);

    const clients = myClients || [];
    
    const spotlightData = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

        // 1. Most Consistent
        let mostConsistent = null;
        let maxWorkouts = 0;
        
        clients.forEach(client => {
            const recentWorkouts = client.workoutHistory?.filter(session => new Date(session.date) >= sevenDaysAgo).length || 0;
            if (recentWorkouts > 0 && recentWorkouts >= maxWorkouts) { // Only show if they've had at least one workout
                maxWorkouts = recentWorkouts;
                mostConsistent = {
                    ...client,
                    recentWorkouts
                };
            }
        });

        // 2. Needs Attention
        const needsAttention = clients.filter(client => {
            if (!client.workoutHistory || client.workoutHistory.length === 0) {
                // If they are a new member (joined within last week), don't flag them yet.
                const joinDate = new Date(client.joinDate);
                if (joinDate > sevenDaysAgo) {
                    return false;
                }
                return true; // No workouts ever
            }
            const lastWorkoutDate = new Date(client.workoutHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date);
            return lastWorkoutDate < sevenDaysAgo;
        });

        // 3. New Record (Placeholder for future implementation)
        const newRecord = null; 

        return { mostConsistent, needsAttention, newRecord };
    }, [clients]);

    const alerts = useMemo(() => {
        return clients.filter(c => c.membership.status === MembershipStatus.EXPIRED || c.membership.status === MembershipStatus.PENDING);
    }, [clients]);

    const upcomingClasses = useMemo(() => {
        return gymClasses
            .filter(c => c.trainerId === currentUser?.id && new Date(c.startTime) > new Date())
            .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .slice(0, 3);
    }, [gymClasses, currentUser]);

    const latestAnnouncement = announcements[0];

    return (
        <div className="w-full space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¡Bienvenido, {currentUser?.name}!</h2>
            
            {latestAnnouncement && (
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200">{latestAnnouncement.title}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{latestAnnouncement.content}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Spotlight Section */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-4">Cliente Destacado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Most Consistent */}
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg flex flex-col">
                            <div className="flex items-center gap-2">
                                <FireIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                <h4 className="font-bold text-green-800 dark:text-green-300">Mejor Rendimiento</h4>
                            </div>
                            <div className="flex-grow flex items-center">
                                {spotlightData.mostConsistent ? (
                                    <button onClick={() => onClientClick(spotlightData.mostConsistent!)} className="w-full text-left p-2 rounded-lg transition-colors hover:bg-green-200/50 dark:hover:bg-green-800/50">
                                        <div className="flex items-center gap-3">
                                            <img src={spotlightData.mostConsistent.avatarUrl} alt={spotlightData.mostConsistent.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{spotlightData.mostConsistent.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{spotlightData.mostConsistent.recentWorkouts} entrenamientos esta semana</p>
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 px-2">No se han registrado entrenamientos recientes.</p>
                                )}
                            </div>
                        </div>
                        {/* Needs Attention */}
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg flex flex-col">
                            <div className="flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                <h4 className="font-bold text-yellow-800 dark:text-yellow-300">Necesita Seguimiento</h4>
                            </div>
                            <div className="flex-grow flex items-center">
                                {spotlightData.needsAttention.length > 0 ? (
                                    <div className="space-y-1 w-full">
                                        {spotlightData.needsAttention.slice(0, 2).map(client => (
                                            <button key={client.id} onClick={() => onClientClick(client)} className="w-full text-left p-2 rounded-lg transition-colors hover:bg-yellow-200/50 dark:hover:bg-yellow-800/50">
                                                <div className="flex items-center gap-2">
                                                    <img src={client.avatarUrl} alt={client.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.name}</p>
                                                </div>
                                            </button>
                                        ))}
                                        {spotlightData.needsAttention.length > 2 && (
                                            <button onClick={() => onNavigate('clients')} className="text-xs text-left text-gray-500 dark:text-gray-400 hover:underline p-2">
                                                + {spotlightData.needsAttention.length - 2} más
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 px-2">¡Todos los clientes están activos!</p>
                                )}
                            </div>
                        </div>
                        {/* New Record */}
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg flex flex-col">
                            <div className="flex items-center gap-2">
                                <TrophyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h4 className="font-bold text-blue-800 dark:text-blue-300">Nuevo Récord Personal</h4>
                            </div>
                             <div className="flex-grow flex items-center">
                                {spotlightData.newRecord ? (
                                    // This part is a placeholder for future implementation
                                    <p>Logic to find new PRs coming soon!</p>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 px-2">No se han registrado nuevos RPs recientemente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Upcoming Classes */}
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">Próximas Clases</h3>
                        <div className="space-y-2">
                            {upcomingClasses.length > 0 ? upcomingClasses.map(c => (
                                <button key={c.id} onClick={() => onNavigate('schedule')} className="w-full text-left p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{c.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(c.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                                </button>
                            )) : <p className="text-sm text-gray-500 dark:text-gray-400 p-2">No hay próximas clases.</p>}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">Alertas de Clientes</h3>
                        <div className="space-y-2">
                            {alerts.length > 0 ? alerts.map(client => (
                                <button key={client.id} onClick={() => onClientClick(client)} className="w-full text-left p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{client.name}</p>
                                    <p className={`text-sm font-medium ${client.membership.status === MembershipStatus.EXPIRED ? 'text-red-500' : 'text-yellow-500'}`}>
                                        Membresía {client.membership.status}
                                    </p>
                                </button>
                            )) : <p className="text-sm text-gray-500 dark:text-gray-400 p-2">Todos los clientes están activos.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerOverview;
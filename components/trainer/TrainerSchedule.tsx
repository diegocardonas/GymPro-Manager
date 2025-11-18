import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { UserGroupIcon } from '../icons/UserGroupIcon';

const TrainerSchedule: React.FC = () => {
    const { currentUser, gymClasses } = useContext(AuthContext);

    const myClasses = useMemo(() => {
        return gymClasses
            .filter(c => c.trainerId === currentUser?.id)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [gymClasses, currentUser]);

    return (
        <div className="w-full max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Horario de Clases</h2>
            
            <div className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {myClasses.length > 0 ? myClasses.map(gymClass => (
                        <div key={gymClass.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 dark:hover:bg-gray-800 gap-4">
                            <div className="flex-1">
                                <p className="font-bold text-lg text-primary">{gymClass.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{gymClass.description}</p>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                    <span>Fecha: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(gymClass.startTime).toLocaleDateString()}</span></span>
                                    <span>Hora: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(gymClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(gymClass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold self-end sm:self-center">
                                <UserGroupIcon className="w-5 h-5" />
                                <span>{gymClass.bookedClientIds.length} / {gymClass.capacity} Reservados</span>
                            </div>
                        </div>
                    )) : (
                        <p className="p-8 text-center text-gray-500 dark:text-gray-400">No tienes clases programadas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerSchedule;
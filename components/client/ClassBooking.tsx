import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';

const ClassBooking: React.FC = () => {
    const { currentUser, users, gymClasses, bookClass } = useContext(AuthContext);

    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);
    const sortedClasses = useMemo(() => [...gymClasses].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()), [gymClasses]);

    const handleBookClass = (classId: string) => {
        if (!currentUser) return;
        const message = bookClass(classId, currentUser.id);
        alert(message);
    };

    return (
        <div className="w-full max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reservar una Clase</h2>
            
            <div className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg p-6">
                <div className="space-y-4">
                    {sortedClasses.map(gymClass => {
                        const trainer = trainers.find(t => t.id === gymClass.trainerId);
                        const isBooked = currentUser && gymClass.bookedClientIds.includes(currentUser.id);
                        const isFull = gymClass.bookedClientIds.length >= gymClass.capacity;
                        const canBook = !isBooked && !isFull;
                        
                        return (
                            <div key={gymClass.id} className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <p className="font-bold text-lg text-primary">{gymClass.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{trainer?.name || 'Unassigned'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {new Date(gymClass.startTime).toLocaleDateString()} at {new Date(gymClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{gymClass.bookedClientIds.length} / {gymClass.capacity}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Reservados</p>
                                    </div>
                                    <button 
                                        onClick={() => handleBookClass(gymClass.id)}
                                        disabled={!canBook}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors w-28 text-center
                                            ${isBooked ? 'bg-green-500 text-white cursor-default' : ''}
                                            ${isFull && !isBooked ? 'bg-red-500 text-white cursor-not-allowed' : ''}
                                            ${canBook ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : ''}
                                            disabled:opacity-70 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {isBooked ? 'Reservado' : isFull ? 'Completo' : 'Reservar Ahora'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ClassBooking;
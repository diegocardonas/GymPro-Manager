import React, { useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';

const ClassBooking: React.FC = () => {
    const { currentUser, users, gymClasses, bookClass } = useContext(AuthContext);

    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);
    const sortedClasses = useMemo(() => [...gymClasses].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()), [gymClasses]);

    const handleBookClass = (classId: string) => {
        if (!currentUser) return;
        bookClass(classId, currentUser.id);
    };

    const getCapacityColor = (current: number, max: number) => {
        const percentage = current / max;
        if (percentage >= 1) return 'bg-red-500';
        if (percentage >= 0.8) return 'bg-yellow-500';
        return 'bg-green-500';
    }

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
                        const capacityColor = getCapacityColor(gymClass.bookedClientIds.length, gymClass.capacity);
                        
                        return (
                            <div key={gymClass.id} className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                         <p className="font-bold text-lg text-primary">{gymClass.name}</p>
                                         {isBooked && <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded-full">Reservado</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{trainer?.name || 'Unassigned'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1.5 rounded text-xs">
                                            {new Date(gymClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {new Date(gymClass.startTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className={`w-2 h-2 rounded-full ${capacityColor}`}></div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{gymClass.bookedClientIds.length} / {gymClass.capacity}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleBookClass(gymClass.id)}
                                        disabled={!canBook}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all w-32 text-center shadow-sm
                                            ${isBooked ? 'bg-gray-200 text-gray-500 cursor-default dark:bg-gray-600 dark:text-gray-400' : ''}
                                            ${isFull && !isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600' : ''}
                                            ${canBook ? 'bg-primary hover:bg-primary/90 text-primary-foreground transform hover:-translate-y-0.5' : ''}
                                        `}
                                    >
                                        {isBooked ? 'Listo' : isFull ? 'Lleno' : 'Reservar'}
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
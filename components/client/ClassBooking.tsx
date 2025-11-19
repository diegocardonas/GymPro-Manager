
import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Role, GymClass } from '../../types';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { FireIcon } from '../icons/FireIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { FilterIcon } from '../icons/FilterIcon';

const ClassBooking: React.FC = () => {
    const { currentUser, users, gymClasses, bookClass } = useContext(AuthContext);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [filterTrainer, setFilterTrainer] = useState<string>('all');
    const [filterTime, setFilterTime] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);

    // Generate next 7 days for tabs
    const weekDays = useMemo(() => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            days.push(d);
        }
        return days;
    }, []);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() && 
               d1.getMonth() === d2.getMonth() && 
               d1.getFullYear() === d2.getFullYear();
    };

    const filteredClasses = useMemo(() => {
        return gymClasses
            .filter(c => {
                const classDate = new Date(c.startTime);
                // Date Filter
                const isDayMatch = isSameDay(classDate, selectedDate);
                
                // Trainer Filter
                const isTrainerMatch = filterTrainer === 'all' || c.trainerId === filterTrainer;

                // Time Filter
                let isTimeMatch = true;
                const hour = classDate.getHours();
                if (filterTime === 'morning') isTimeMatch = hour < 12;
                else if (filterTime === 'afternoon') isTimeMatch = hour >= 12 && hour < 17;
                else if (filterTime === 'evening') isTimeMatch = hour >= 17;

                return isDayMatch && isTrainerMatch && isTimeMatch;
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    }, [gymClasses, selectedDate, filterTrainer, filterTime]);

    const handleBookClass = (classId: string) => {
        if (!currentUser) return;
        bookClass(classId, currentUser.id);
    };

    // Simulate intensity based on class name (just for visual flair)
    const getClassIntensity = (name: string): 1 | 2 | 3 => {
        const lower = name.toLowerCase();
        if (lower.includes('hiit') || lower.includes('crossfit') || lower.includes('power')) return 3;
        if (lower.includes('strength') || lower.includes('cardio')) return 2;
        return 1; // Yoga, Pilates, etc.
    };

    return (
        <div className="w-full max-w-5xl space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <CalendarDaysIcon className="w-8 h-8 text-primary"/>
                        Horario de Clases
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Reserva tu lugar y alcanza tus objetivos.</p>
                </div>
                
                {/* Filters Toolbar */}
                <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FilterIcon className="w-4 h-4 text-gray-500 mr-2"/>
                        <span className="text-xs font-bold text-gray-500 uppercase">Filtros</span>
                    </div>
                    <select 
                        value={filterTrainer} 
                        onChange={(e) => setFilterTrainer(e.target.value)}
                        className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 font-medium cursor-pointer hover:text-primary"
                    >
                        <option value="all">Todos los Entrenadores</option>
                        {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                    <select 
                        value={filterTime} 
                        onChange={(e) => setFilterTime(e.target.value as any)}
                        className="text-sm bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 font-medium cursor-pointer hover:text-primary"
                    >
                        <option value="all">Cualquier Hora</option>
                        <option value="morning">Mañana (Antes 12pm)</option>
                        <option value="afternoon">Tarde (12pm - 5pm)</option>
                        <option value="evening">Noche (Después 5pm)</option>
                    </select>
                </div>
            </div>

            {/* Date Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-3 custom-scrollbar">
                {weekDays.map((date, idx) => {
                    const isActive = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center min-w-[80px] p-3 rounded-2xl transition-all duration-300 border-2 ${
                                isActive 
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105' 
                                    : 'bg-white dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <span className={`text-xs font-semibold uppercase mb-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                {isToday ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short' })}
                            </span>
                            <span className="text-xl font-bold">
                                {date.getDate()}
                            </span>
                        </button>
                    );
                })}
            </div>
            
            {/* Classes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredClasses.length > 0 ? (
                    filteredClasses.map(gymClass => (
                        <ClassCard 
                            key={gymClass.id} 
                            gymClass={gymClass} 
                            trainers={trainers} 
                            currentUser={currentUser} 
                            onBook={handleBookClass}
                            intensity={getClassIntensity(gymClass.name)}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <CalendarDaysIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Sin clases programadas</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Intenta cambiar los filtros o selecciona otro día.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ClassCard: React.FC<{ 
    gymClass: GymClass, 
    trainers: any[], 
    currentUser: any, 
    onBook: (id: string) => void,
    intensity: number 
}> = ({ gymClass, trainers, currentUser, onBook, intensity }) => {
    const trainer = trainers.find(t => t.id === gymClass.trainerId);
    const isBooked = currentUser && gymClass.bookedClientIds.includes(currentUser.id);
    const occupied = gymClass.bookedClientIds.length;
    const capacity = gymClass.capacity;
    const isFull = occupied >= capacity;
    const percentage = (occupied / capacity) * 100;
    
    const startTime = new Date(gymClass.startTime);
    const endTime = new Date(gymClass.endTime);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    // Determine status color
    let statusColor = 'bg-green-500';
    if (isFull) statusColor = 'bg-red-500';
    else if (percentage > 80) statusColor = 'bg-yellow-500';

    return (
        <div className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden ${isBooked ? 'ring-2 ring-green-500/50' : ''}`}>
            {/* Background Pattern Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        <ClockIcon className="w-4 h-4" />
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span>{duration} min</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{gymClass.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1 flex items-center gap-1">
                        con <span className="text-gray-800 dark:text-gray-200">{trainer?.name || 'Entrenador'}</span>
                    </p>
                </div>
                
                {/* Intensity Badge */}
                <div className="flex flex-col items-end gap-1">
                     <div className="flex gap-0.5">
                        {[...Array(3)].map((_, i) => (
                            <FireIcon key={i} className={`w-4 h-4 ${i < intensity ? 'text-orange-500' : 'text-gray-200 dark:text-gray-700'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Intensidad</span>
                </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 relative z-10">{gymClass.description}</p>

            {/* Capacity Bar */}
            <div className="mb-6 relative z-10">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><UserGroupIcon className="w-3 h-3"/> Lugares</span>
                    <span className={`${isFull ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {occupied} / {capacity}
                    </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${statusColor}`} 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Action Button */}
            <div className="relative z-10">
                {isBooked ? (
                    <button disabled className="w-full py-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold text-sm flex items-center justify-center gap-2 cursor-default border border-green-200 dark:border-green-800">
                        <CheckCircleIcon className="w-5 h-5" />
                        Reservado
                    </button>
                ) : (
                    <button 
                        onClick={() => onBook(gymClass.id)}
                        disabled={isFull}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
                            ${isFull 
                                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        {isFull ? 'Clase Llena' : 'Reservar Ahora'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClassBooking;
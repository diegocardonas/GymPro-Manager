import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DailyRoutine, LoggedExercise, LoggedSet } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { NumberInputWithButtons } from '../shared/NumberInputWithButtons';

const WorkoutLog: React.FC = () => {
    const { currentUser, logWorkout } = useContext(AuthContext);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DailyRoutine['day'];
    const todaysRoutine = useMemo(() => {
        const firstRoutine = currentUser?.assignedRoutines?.[0]?.routine;
        return firstRoutine?.find(r => r.day === today);
    }, [currentUser, today]);

    const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() => 
        todaysRoutine?.exercises.map(ex => ({
            name: ex.name,
            plannedSets: ex.sets,
            plannedReps: ex.reps,
            completedSets: Array(ex.sets).fill({ weight: 0, reps: 0 })
        })) || []
    );
    
    // Timer State
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [initialTime, setInitialTime] = useState(60);

    useEffect(() => {
        let interval: number | undefined;
        if (timerActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            // Could play a sound here
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const startTimer = (seconds: number) => {
        setInitialTime(seconds);
        setTimeLeft(seconds);
        setTimerActive(true);
    };
    
    const stopTimer = () => {
        setTimerActive(false);
        setTimeLeft(0);
    }
    
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSetChange = (exIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
        const newLoggedExercises = [...loggedExercises];
        newLoggedExercises[exIndex].completedSets[setIndex] = {
            ...newLoggedExercises[exIndex].completedSets[setIndex],
            [field]: value
        };
        setLoggedExercises(newLoggedExercises);
    };
    
    const handleAddSet = (exIndex: number) => {
        const newLoggedExercises = [...loggedExercises];
        newLoggedExercises[exIndex].completedSets.push({ weight: 0, reps: 0});
        setLoggedExercises(newLoggedExercises);
    };

    const handleRemoveSet = (exIndex: number, setIndex: number) => {
        const newLoggedExercises = [...loggedExercises];
        newLoggedExercises[exIndex].completedSets.splice(setIndex, 1);
        setLoggedExercises(newLoggedExercises);
    };

    const handleLogWorkout = () => {
        if (!currentUser) return;
        const session = {
            id: `ws-${Date.now()}`,
            date: new Date().toISOString(),
            day: today,
            loggedExercises,
        };
        logWorkout(currentUser.id, session);
    };

    if (!todaysRoutine || todaysRoutine.exercises.length === 0) {
        return (
            <div className="w-full max-w-2xl text-center bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Feliz Día de Descanso!</h2>
                <p className="text-gray-500 dark:text-gray-400">No hay entrenamiento programado para hoy. Disfruta tu recuperación.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl space-y-6 pb-24">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registrar Entrenamiento de Hoy: <span className="text-primary">{today}</span></h2>
            
            <div className="space-y-6">
                {loggedExercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">{exercise.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Objetivo: {exercise.plannedSets} x {exercise.plannedReps}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {exercise.completedSets.map((set, setIndex) => (
                                <div key={setIndex} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="font-bold text-gray-400 dark:text-gray-500 w-8 flex-shrink-0">#{setIndex + 1}</span>
                                    <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                                        <NumberInputWithButtons 
                                            value={set.weight} 
                                            onChange={(v) => handleSetChange(exIndex, setIndex, 'weight', v as number)} 
                                            step={2.5} 
                                            className="w-full" />
                                         <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">kg</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                                        <NumberInputWithButtons 
                                            value={set.reps} 
                                            onChange={(v) => handleSetChange(exIndex, setIndex, 'reps', v as number)} 
                                            className="w-full" />
                                        <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase">reps</span>
                                    </div>
                                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                        {/* Quick Rest Timer Trigger */}
                                        <button onClick={() => startTimer(60)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Start 60s Rest">
                                            <ClockIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleRemoveSet(exIndex, setIndex)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <button onClick={() => handleAddSet(exIndex)} className="mt-4 text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                             <PlusIcon className="w-4 h-4" /> Añadir Serie
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-6">
                 <button onClick={handleLogWorkout} className="px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-xl hover:bg-primary/90 transition-transform transform hover:scale-105 w-full sm:w-auto">
                    Finalizar Entrenamiento 🎉
                </button>
            </div>

            {/* Floating Timer */}
            <div className={`fixed bottom-20 right-4 z-40 transition-all duration-300 transform ${timerActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-700">
                    <div className="relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary transition-all duration-1000 ease-linear" strokeDasharray={175} strokeDashoffset={175 - (175 * timeLeft) / initialTime} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Descanso</p>
                        <div className="flex gap-2 mt-2">
                             <button onClick={() => startTimer(initialTime + 10)} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">+10s</button>
                             <button onClick={stopTimer} className="text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-white">Stop</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutLog;
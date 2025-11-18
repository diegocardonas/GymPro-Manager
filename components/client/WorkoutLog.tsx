import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DailyRoutine, LoggedExercise, LoggedSet } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { TrashIcon } from '../icons/TrashIcon';
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
        alert('¡Entrenamiento registrado con éxito!');
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
        <div className="w-full max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registrar Entrenamiento de Hoy: <span className="text-primary">{today}</span></h2>
            
            <div className="space-y-4">
                {loggedExercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 p-4">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{exercise.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Planeado: {exercise.plannedSets} series de {exercise.plannedReps} repeticiones</p>
                        
                        <div className="space-y-2">
                            {exercise.completedSets.map((set, setIndex) => (
                                <div key={setIndex} className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-600 dark:text-gray-400 w-12">Serie {setIndex + 1}</span>
                                    <NumberInputWithButtons 
                                        value={set.weight} 
                                        onChange={(v) => handleSetChange(exIndex, setIndex, 'weight', v as number)} 
                                        step={2.5} 
                                        className="flex-1" />
                                     <span className="text-gray-500 dark:text-gray-400">kg</span>
                                    <NumberInputWithButtons 
                                        value={set.reps} 
                                        onChange={(v) => handleSetChange(exIndex, setIndex, 'reps', v as number)} 
                                        className="flex-1" />
                                    <span className="text-gray-500 dark:text-gray-400">reps</span>
                                    <button onClick={() => handleRemoveSet(exIndex, setIndex)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                         <button onClick={() => handleAddSet(exIndex)} className="mt-2 text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                             <PlusIcon className="w-4 h-4" /> Añadir Serie
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                 <button onClick={handleLogWorkout} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:bg-primary/90 transition-transform transform hover:scale-105">
                    Finalizar y Registrar Entrenamiento
                </button>
            </div>
        </div>
    );
};

export default WorkoutLog;
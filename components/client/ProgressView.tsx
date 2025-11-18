import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LoggedExercise, WorkoutSession } from '../../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProgressView: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const [selectedExercise, setSelectedExercise] = useState<string>('');

    const workoutHistory = currentUser?.workoutHistory || [];

    const uniqueExercises = useMemo(() => {
        const exerciseSet = new Set<string>();
        workoutHistory.forEach(session => {
            session.loggedExercises.forEach(ex => exerciseSet.add(ex.name));
        });
        return Array.from(exerciseSet);
    }, [workoutHistory]);

    // Set default selected exercise
    if (!selectedExercise && uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
    }

    const chartData = useMemo(() => {
        if (!selectedExercise) return [];
        
        return workoutHistory
            .map(session => {
                const exercise = session.loggedExercises.find(ex => ex.name === selectedExercise);
                if (!exercise || exercise.completedSets.length === 0) return null;

                // Calculate max weight and total volume for the session
                const maxWeight = Math.max(...exercise.completedSets.map(s => s.weight));
                const totalVolume = exercise.completedSets.reduce((sum, set) => sum + (set.weight * set.reps), 0);

                return {
                    date: new Date(session.date).toLocaleDateString(),
                    maxWeight,
                    totalVolume
                };
            })
            .filter(Boolean) as { date: string, maxWeight: number, totalVolume: number }[];
    }, [workoutHistory, selectedExercise]);

    return (
        <div className="w-full max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Progreso</h2>

            {uniqueExercises.length > 0 ? (
                <>
                    <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                        <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecciona un ejercicio para ver el progreso:</label>
                        <select
                            id="exercise-select"
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        >
                            {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">Peso Máximo Levantado (kg)</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                                    <XAxis dataKey="date" fontSize={12} tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" />
                                    <YAxis domain={['dataMin - 5', 'dataMax + 5']} fontSize={12} tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="maxWeight" stroke="#8884d8" name="Peso Máximo" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                             <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">Volumen Total (kg)</h3>
                             <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-20" />
                                    <XAxis dataKey="date" fontSize={12} tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" />
                                    <YAxis fontSize={12} tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="totalVolume" stroke="#82ca9d" name="Volumen" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Sin Datos de Progreso</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">¡Registra tu primer entrenamiento para empezar a seguir tu progreso!</p>
                </div>
            )}
        </div>
    );
};

export default ProgressView;
import React, { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SparklesAiIcon } from '../icons/SparklesAiIcon';

const NutritionLog: React.FC = () => {
    const { currentUser, addNutritionLog } = useContext(AuthContext);
    const [mealDescription, setMealDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const nutritionHistory = useMemo(() => {
        return [...(currentUser?.nutritionLogs || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentUser?.nutritionLogs]);

    const handleLogMeal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mealDescription.trim() || !currentUser) return;

        setIsLoading(true);
        await addNutritionLog(currentUser.id, {
            date: new Date().toISOString(),
            mealDescription: mealDescription.trim(),
        });
        setMealDescription('');
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registro Nutricional</h2>

            <form onSubmit={handleLogMeal} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                <label htmlFor="mealDescription" className="block text-lg font-semibold text-gray-800 dark:text-gray-200">¿Qué comiste?</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Describe tu comida y nuestra IA la analizará por ti.</p>
                <textarea
                    id="mealDescription"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                    rows={4}
                    placeholder="p. ej., Una pechuga de pollo a la parrilla con una guarnición de quinoa y brócoli al vapor."
                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                />
                <button type="submit" disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:bg-primary/90 disabled:bg-gray-400">
                    {isLoading ? 'Analizando...' : <> <SparklesAiIcon className="w-5 h-5"/> Analizar y Registrar Comida</>}
                </button>
            </form>

            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Historial</h3>
                {nutritionHistory.map(log => (
                    <div key={log.id} className="bg-white dark:bg-gray-800/50 p-4 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(log.date).toLocaleString()}</p>
                        <p className="font-semibold mt-1">{log.mealDescription}</p>
                        {log.aiAnalysis && (
                            <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                                <p className="font-bold text-primary text-sm">Análisis IA:</p>
                                <p className="text-sm"><strong>Calorías:</strong> {log.aiAnalysis.estimatedCalories}</p>
                                <p className="text-sm"><strong>Macros:</strong> P: {log.aiAnalysis.estimatedMacros.protein}, C: {log.aiAnalysis.estimatedMacros.carbs}, F: {log.aiAnalysis.estimatedMacros.fat}</p>
                                <p className="text-sm mt-1"><strong>Sugerencia:</strong> <i>{log.aiAnalysis.suggestion}</i></p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NutritionLog;
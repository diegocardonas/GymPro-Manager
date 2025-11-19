import React, { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SparklesAiIcon } from '../icons/SparklesAiIcon';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    
    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981']; // Protein (Purple), Carbs (Blue), Fat (Green)

    // Helper to extract numeric value from strings like "~30g"
    const parseMacro = (val: string) => {
        const match = val.match(/(\d+)/);
        return match ? parseInt(match[0]) : 0;
    }

    return (
        <div className="w-full max-w-5xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Registro Nutricional IA</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                     <form onSubmit={handleLogMeal} className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
                        <label htmlFor="mealDescription" className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">¿Qué comiste?</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Describe tu comida y la IA calculará macros y calorías.</p>
                        <textarea
                            id="mealDescription"
                            value={mealDescription}
                            onChange={(e) => setMealDescription(e.target.value)}
                            rows={4}
                            placeholder="p. ej., 200g de pechuga de pollo a la parrilla con una taza de arroz y aguacate."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary resize-none text-gray-900 dark:text-white"
                        />
                        <button type="submit" disabled={isLoading} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Analizando...
                                </span>
                            ) : (
                                <> <SparklesAiIcon className="w-5 h-5"/> Analizar Comida</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Historial Reciente</h3>
                    {nutritionHistory.length > 0 ? nutritionHistory.map(log => {
                         const macroData = log.aiAnalysis ? [
                            { name: 'Proteína', value: parseMacro(log.aiAnalysis.estimatedMacros.protein) },
                            { name: 'Carbs', value: parseMacro(log.aiAnalysis.estimatedMacros.carbs) },
                            { name: 'Grasa', value: parseMacro(log.aiAnalysis.estimatedMacros.fat) },
                        ] : [];

                        return (
                            <div key={log.id} className="bg-white dark:bg-gray-800/50 p-0 rounded-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden shadow-md flex flex-col md:flex-row">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{new Date(log.date).toLocaleString()}</span>
                                    </div>
                                    <p className="font-medium text-lg text-gray-800 dark:text-gray-100 mb-4">"{log.mealDescription}"</p>
                                    {log.aiAnalysis && (
                                        <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/10">
                                            <p className="text-sm text-primary dark:text-primary-foreground font-medium italic">"{log.aiAnalysis.suggestion}"</p>
                                        </div>
                                    )}
                                </div>
                                
                                {log.aiAnalysis && (
                                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 md:w-64 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center">
                                        <div className="text-center mb-2">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Calorías Est.</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-white">{log.aiAnalysis.estimatedCalories}</p>
                                        </div>
                                        <div className="w-full h-32">
                                             <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={macroData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={25}
                                                        outerRadius={40}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {macroData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex gap-2 text-xs justify-center w-full mt-1">
                                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> P</span>
                                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> C</span>
                                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> F</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }) : (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">No hay registros aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionLog;
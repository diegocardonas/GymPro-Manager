import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AchievementsView: React.FC = () => {
    const { currentUser, achievements } = useContext(AuthContext);
    const myAchievementIds = currentUser?.achievements || [];

    return (
        <div className="w-full max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Logros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {achievements.map(ach => {
                    const isUnlocked = myAchievementIds.includes(ach.id);
                    return (
                        <div
                            key={ach.id}
                            className={`p-6 rounded-xl text-center transition-all duration-300 ${isUnlocked ? 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400' : 'bg-gray-100 dark:bg-gray-800/50'}`}
                        >
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isUnlocked ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                {/* Placeholder for icon */}
                                <span className={`text-3xl ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>🏆</span>
                            </div>
                            <h3 className={`font-bold text-lg ${isUnlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-800 dark:text-gray-200'}`}>{ach.name}</h3>
                            <p className={`text-sm mt-1 ${isUnlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-500 dark:text-gray-400'}`}>{ach.description}</p>
                            {!isUnlocked && <div className="absolute inset-0 bg-white/50 dark:bg-black/50 rounded-xl"></div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsView;
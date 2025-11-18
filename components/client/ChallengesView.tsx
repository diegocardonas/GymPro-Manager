import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ChallengesView: React.FC = () => {
    const { currentUser, challenges, joinChallenge, users } = useContext(AuthContext);

    return (
        <div className="w-full max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Desafíos del Gimnasio</h2>

            {challenges.map(challenge => {
                const myProgress = challenge.participants.find(p => p.userId === currentUser?.id);
                const leaderboard = challenge.participants
                    .map(p => ({ ...p, userName: users.find(u => u.id === p.userId)?.name || 'Unknown' }))
                    .sort((a,b) => b.progress - a.progress)
                    .slice(0, 5);
                const progressPercentage = myProgress ? (myProgress.progress / challenge.goal) * 100 : 0;

                return (
                    <div key={challenge.id} className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold text-primary">{challenge.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{challenge.description}</p>
                            </div>
                            {!myProgress && (
                                <button onClick={() => currentUser && joinChallenge(challenge.id, currentUser.id)} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                                    Unirse
                                </button>
                            )}
                        </div>

                        {myProgress && (
                            <div className="mt-4">
                                <h4 className="font-semibold">Mi Progreso</h4>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-1">
                                    <div className="bg-primary h-4 rounded-full" style={{ width: `${Math.min(progressPercentage, 100)}%` }}></div>
                                </div>
                                <p className="text-sm text-right mt-1">{myProgress.progress} / {challenge.goal} {challenge.unit}</p>
                            </div>
                        )}
                        
                        <div className="mt-6">
                             <h4 className="font-semibold mb-2">Tabla de Clasificación</h4>
                             <div className="space-y-2">
                                {leaderboard.map((p, index) => (
                                    <div key={p.userId} className="flex justify-between items-center text-sm p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                                        <p><span className="font-bold">{index + 1}.</span> {p.userName}</p>
                                        <p className="font-semibold">{p.progress} {challenge.unit}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChallengesView;
import React, { useState, useContext, useMemo } from 'react';
import { DailyRoutine, PreEstablishedRoutine, User, Role } from '../../types';
import { AuthContext } from '../../context/AuthContext';
import { XCircleIcon } from '../icons/XCircleIcon';
import { SendIcon } from '../icons/SendIcon';

interface ShareRoutineModalProps {
  routine: DailyRoutine[] | PreEstablishedRoutine;
  onClose: () => void;
}

const formatRoutineForMessage = (routine: DailyRoutine[] | PreEstablishedRoutine): string => {
    let text = `Aquí tienes una rutina para ti:\n\n`;
    const routineName = 'name' in routine ? routine.name : 'Tu Rutina Personalizada';
    const routineData = 'routines' in routine ? routine.routines : routine;
    
    text += `*${routineName}*\n`;
    if ('description' in routine && routine.description) {
        text += `${routine.description}\n\n`;
    }

    const weekDays: DailyRoutine['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    weekDays.forEach(day => {
        const dayRoutine = routineData.find(r => r.day === day);
        if (dayRoutine && dayRoutine.exercises.length > 0) {
            text += `*${day}*\n`;
            dayRoutine.exercises.forEach(ex => {
                text += `- ${ex.name}: ${ex.sets} sets of ${ex.reps} reps\n`;
            });
            text += `\n`;
        }
    });

    return text;
};

const ShareRoutineModal: React.FC<ShareRoutineModalProps> = ({ routine, onClose }) => {
    const { currentUser, users, sendMessage } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    
    const availableUsers = useMemo(() => {
        if (!currentUser) return [];
        return users
            .filter(u => u.id !== currentUser.id && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => a.name.localeCompare(b.name));
    }, [users, currentUser, searchTerm]);

    const handleToggleUser = (userId: string) => {
        setSelectedUserIds(prev => 
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };
    
    const handleSend = () => {
        if (!currentUser || selectedUserIds.length === 0) return;

        const messageText = formatRoutineForMessage(routine);
        
        selectedUserIds.forEach(userId => {
             const contactIds = [currentUser.id, userId].sort();
             sendMessage({
                conversationId: `${contactIds[0]}-${contactIds[1]}`,
                senderId: currentUser.id,
                receiverId: userId,
                text: messageText,
            });
        });
        
        alert(`¡Rutina enviada a ${selectedUserIds.length} usuario(s)!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compartir Rutina Con...</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                     <input
                        type="text"
                        placeholder="Buscar un usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {availableUsers.map(user => (
                         <label key={user.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user.id)}
                                onChange={() => handleToggleUser(user.id)}
                                className="h-5 w-5 rounded text-primary focus:ring-primary border-gray-300"
                            />
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold">Cancelar</button>
                    <button 
                        type="button" 
                        onClick={handleSend}
                        disabled={selectedUserIds.length === 0}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-primary-foreground flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <SendIcon className="w-5 h-5"/>
                        <span>Enviar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareRoutineModal;
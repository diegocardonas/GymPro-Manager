import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AICoachMessage } from '../../types';
import { SparklesAiIcon } from '../icons/SparklesAiIcon';

const AICoachView: React.FC = () => {
    const { currentUser, sendAICoachMessage } = useContext(AuthContext);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const chatHistory = currentUser?.aiCoachHistory || [];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !currentUser || isLoading) return;

        const userMessage: AICoachMessage = {
            role: 'user',
            text: input.trim(),
            timestamp: new Date().toISOString(),
        };

        setIsLoading(true);
        setInput('');

        await sendAICoachMessage(currentUser.id, userMessage);
        
        setIsLoading(false);
    };

    return (
        <div className="w-full max-w-3xl h-[80vh] bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full">
                    <SparklesAiIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Coach</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your personal fitness assistant</p>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {chatHistory.length === 0 && (
                     <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                            <SparklesAiIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-md px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                            <p className="text-sm whitespace-pre-wrap">¡Hola! Soy tu Entrenador IA. Estoy aquí para ayudarte con tus metas de fitness, responder tus preguntas sobre ejercicios, nutrición y mantenerte motivado. ¿Cómo puedo ayudarte hoy?</p>
                        </div>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                <SparklesAiIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-md px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && <img src={currentUser?.avatarUrl} className="w-8 h-8 rounded-full flex-shrink-0" />}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                           <SparklesAiIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-md px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                             <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your AI coach anything..."
                    className="w-full p-3 bg-gray-200 dark:bg-gray-700 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isLoading}
                />
            </form>
        </div>
    );
};

export default AICoachView;

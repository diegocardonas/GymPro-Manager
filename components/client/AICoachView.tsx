import React, { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AICoachMessage } from '../../types';
import { SparklesAiIcon } from '../icons/SparklesAiIcon';
import { SendIcon } from '../icons/SendIcon';

const SUGGESTED_PROMPTS = [
    "Dame una rutina de HIIT de 20 minutos",
    "¿Cuáles son buenos snacks post-entreno?",
    "Explícame la sobrecarga progresiva",
    "Motívame para entrenar hoy",
    "Diferencia entre series y repeticiones"
];

const AICoachView: React.FC = () => {
    const { currentUser, sendAICoachMessage } = useContext(AuthContext);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const chatHistory = currentUser?.aiCoachHistory || [];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !currentUser || isLoading) return;

        const userMessage: AICoachMessage = {
            role: 'user',
            text: text.trim(),
            timestamp: new Date().toISOString(),
        };

        setIsLoading(true);
        setInput('');

        await sendAICoachMessage(currentUser.id, userMessage);
        
        setIsLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    }

    return (
        <div className="w-full max-w-3xl h-[80vh] bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-lg shadow-purple-500/30">
                    <SparklesAiIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Coach</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tu asistente personal de fitness 24/7</p>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {chatHistory.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-70">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                            <SparklesAiIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center max-w-md px-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">¡Hola! Soy tu Entrenador IA.</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Estoy aquí para ayudarte con tus metas, responder dudas sobre ejercicios, nutrición y mantenerte motivado.</p>
                        </div>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                <SparklesAiIcon className="w-4 h-4 text-white" />
                            </div>
                        )}
                        <div className={`max-w-[85%] md:max-w-[75%] px-5 py-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-100 dark:border-gray-600'}`}>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                         {msg.role === 'user' && <img src={currentUser?.avatarUrl} className="w-8 h-8 rounded-full flex-shrink-0 mt-1 border-2 border-white dark:border-gray-600 shadow-sm" />}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start animate-fade-in">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                           <SparklesAiIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-white dark:bg-gray-700 rounded-bl-sm border border-gray-100 dark:border-gray-600 shadow-sm">
                             <div className="flex items-center space-x-1.5">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Suggested Prompts */}
            {chatHistory.length === 0 && (
                <div className="p-4 flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors shadow-sm"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-md">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        className="w-full p-3.5 pr-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm text-gray-900 dark:text-white transition-all"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AICoachView;
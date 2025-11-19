
import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Role, PaymentStatus } from '../../types';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '../icons/PlusIcon';
import { MinusIcon } from '../icons/MinusIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';

interface Product {
    id: string;
    name: string;
    price: number;
    category: 'Drink' | 'Snack' | 'Gear' | 'Supplement';
    image?: string;
}

const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', name: 'Water Bottle (500ml)', price: 3000, category: 'Drink' },
    { id: 'p2', name: 'Protein Shake (Choco)', price: 12000, category: 'Drink' },
    { id: 'p3', name: 'Energy Bar', price: 5000, category: 'Snack' },
    { id: 'p4', name: 'Pre-Workout Shot', price: 8000, category: 'Supplement' },
    { id: 'p5', name: 'Gym Towel', price: 25000, category: 'Gear' },
    { id: 'p6', name: 'Gatorade', price: 6000, category: 'Drink' },
];

const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export const PointOfSale: React.FC = () => {
    const { t } = useTranslation();
    const { users, addPayment } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const clients = useMemo(() => users.filter(u => u.role === Role.CLIENT), [users]);
    
    const filteredClients = useMemo(() => {
        if (!searchTerm) return [];
        return clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [clients, searchTerm]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.product.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const total = useMemo(() => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), [cart]);

    const handleCheckout = () => {
        if (!selectedUser) {
            alert(t('pos.selectUserAlert'));
            return;
        }
        if (cart.length === 0) return;

        const payment = {
            userId: selectedUser,
            amount: total,
            date: new Date().toISOString(),
            status: PaymentStatus.COMPLETED,
            tierId: 'POS_SALE' // Special marker for POS sales
        };

        addPayment(payment);
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setCart([]);
            setSelectedUser(null);
            setSearchTerm('');
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-green-50 dark:bg-green-900/20 rounded-2xl animate-scale-in">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-green-800 dark:text-green-200">{t('pos.saleSuccess')}</h2>
                <p className="text-green-600 dark:text-green-300 mt-2">{t('pos.totalCharged')}: {formatCOP(total)}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
            {/* Product Grid */}
            <div className="flex-1 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pos.products')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MOCK_PRODUCTS.map(product => (
                        <button 
                            key={product.id} 
                            onClick={() => addToCart(product)}
                            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-transparent hover:border-primary hover:shadow-md transition-all text-center group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                                <span className="font-bold text-lg">{product.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 line-clamp-2">{product.name}</h3>
                            <span className="text-primary font-bold">{formatCOP(product.price)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-full lg:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('pos.currentSale')}</h3>
                    
                    {/* User Selector */}
                    <div className="relative">
                        <div className="flex items-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary">
                            <UserGroupIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder={t('pos.searchClient')} 
                                value={selectedUser ? clients.find(c => c.id === selectedUser)?.name : searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setSelectedUser(null); // Reset selection on type
                                }}
                                className="w-full bg-transparent border-none focus:ring-0 text-sm"
                            />
                            {selectedUser && (
                                <button onClick={() => { setSelectedUser(null); setSearchTerm(''); }} className="text-gray-400 hover:text-red-500">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        
                        {searchTerm && !selectedUser && (
                            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-700 shadow-lg rounded-b-lg mt-1 z-10 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600">
                                {filteredClients.length > 0 ? filteredClients.map(client => (
                                    <button 
                                        key={client.id}
                                        onClick={() => { setSelectedUser(client.id); setSearchTerm(''); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <p className="font-bold">{client.name}</p>
                                        <p className="text-xs text-gray-500">{client.email}</p>
                                    </button>
                                )) : <p className="p-2 text-sm text-gray-500 text-center">{t('receptionist.noMembersFound')}</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 py-8">
                            <p>{t('pos.emptyCart')}</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.product.name}</p>
                                    <p className="text-xs text-primary font-bold">{formatCOP(item.product.price)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300">
                                        <MinusIcon className="w-3 h-3" />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300">
                                        <PlusIcon className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 ml-2">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{t('pos.total')}</span>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatCOP(total)}</span>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || !selectedUser}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center"
                    >
                        {t('pos.checkout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

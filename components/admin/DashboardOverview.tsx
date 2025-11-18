import React, { useMemo, useContext } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, TooltipProps } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { Role, MembershipStatus, User } from '../../types';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { DashboardFilter } from '../AdminDashboard';
import { PlusIcon } from '../icons/PlusIcon';
// FIX: Import ChartBarIcon and CogIcon to resolve 'Cannot find name' errors.
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { CogIcon } from '../icons/CogIcon';

type View = 'dashboard' | 'users' | 'reports' | 'app-settings' | 'settings';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl flex items-center space-x-4 w-full text-left ring-1 ring-black/5 dark:ring-white/10 h-full">
    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-md border border-gray-300 dark:border-gray-600">
          <p className="label text-sm font-semibold text-gray-800 dark:text-gray-200">{`${label}`}</p>
          <p className="intro text-xs text-primary">{`Nuevos Miembros : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};

interface DashboardOverviewProps {
    onNavigate: (view: View, filter?: DashboardFilter) => void;
    onUserClick: (user: User) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, onUserClick }) => {
    const { users } = useContext(AuthContext);

    const clients = useMemo(() => users.filter(u => u.role === Role.CLIENT), [users]);
    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);

    const stats = useMemo(() => {
        // FIX: Corrected enum members from Spanish to English (e.g., ACTIVO to ACTIVE).
        const active = clients.filter(u => u.membership.status === MembershipStatus.ACTIVE).length;
        const expired = clients.filter(u => u.membership.status === MembershipStatus.EXPIRED).length;
        const pending = clients.filter(u => u.membership.status === MembershipStatus.PENDING).length;
        const unassigned = clients.filter(u => !u.trainerIds || u.trainerIds.length === 0).length;
        return { totalClients: clients.length, active, expired, pending, totalTrainers: trainers.length, unassigned };
    }, [clients, trainers]);

    const recentlyJoined = useMemo(() => {
        return [...users]
            .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
            .slice(0, 5);
    }, [users]);
    
    const memberGrowthData = useMemo(() => {
        const monthMap: { [key: string]: number } = {};
        clients.forEach(client => {
            const joinDate = new Date(client.joinDate);
            const month = joinDate.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthMap[month]) {
                monthMap[month] = 0;
            }
            monthMap[month]++;
        });
        
        // Ensure chronological order
        return Object.entries(monthMap)
            .map(([month, count]) => {
                const [m, y] = month.split(' ');
                return { name: month, count, date: new Date(`1 ${m} 20${y}`) };
            })
            .sort((a,b) => a.date.getTime() - b.date.getTime())
            .map(({ name, count }) => ({ name, count }));

    }, [clients]);

    const membershipStatusData = useMemo(() => [
        // FIX: Corrected enum members from Spanish to English (e.g., ACTIVO to ACTIVE).
        { name: MembershipStatus.ACTIVE, value: stats.active },
        { name: MembershipStatus.EXPIRED, value: stats.expired },
        { name: MembershipStatus.PENDING, value: stats.pending },
    ], [stats]);

    const COLORS = ['#4ade80', '#f87171', '#facc15']; // green-400, red-400, yellow-400
    
    const handlePieClick = (data: any) => {
        const status = data.name as MembershipStatus;
        onNavigate('users', { type: 'status', value: status });
    };

    return (
         <div className="space-y-8 w-full">
            <section id="stats">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <button onClick={() => onNavigate('users', { type: 'role', value: Role.CLIENT })} className="text-left w-full transition-transform duration-200 hover:scale-105">
                        <StatCard title="Total de Miembros" value={stats.totalClients} icon={<UserGroupIcon className="w-6 h-6 text-primary" />} />
                    </button>
                    {/* FIX: Corrected `MembershipStatus.ACTIVO` to `MembershipStatus.ACTIVE`. */}
                    <button onClick={() => onNavigate('users', { type: 'status', value: MembershipStatus.ACTIVE })} className="text-left w-full transition-transform duration-200 hover:scale-105">
                        <StatCard title="Miembros Activos" value={stats.active} icon={<CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />} />
                    </button>
                    <button onClick={() => onNavigate('users', { type: 'role', value: Role.TRAINER })} className="text-left w-full transition-transform duration-200 hover:scale-105">
                        <StatCard title="Total de Entrenadores" value={stats.totalTrainers} icon={<UserGroupIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />} />
                    </button>
                    {/* FIX: Corrected `MembershipStatus.PENDIENTE` to `MembershipStatus.PENDING`. */}
                    <button onClick={() => onNavigate('users', { type: 'status', value: MembershipStatus.PENDING })} className="text-left w-full transition-transform duration-200 hover:scale-105">
                        <StatCard title="Pagos Pendientes" value={stats.pending} icon={<ClockIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />} />
                    </button>
                    <button onClick={() => onNavigate('users', { type: 'unassigned' })} className="text-left w-full transition-transform duration-200 hover:scale-105">
                         <StatCard title="Clientes sin Asignar" value={stats.unassigned} icon={<XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />} />
                    </button>
                </div>
            </section>
            <section id="charts" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Crecimiento de Nuevos Miembros</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={memberGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-white/10" />
                            <XAxis dataKey="name" stroke="currentColor" tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" fontSize={12}/>
                            <YAxis stroke="currentColor" tick={{ fill: 'currentColor' }} className="text-gray-500 dark:text-gray-400" fontSize={12} />
                            <Tooltip content={<CustomTooltip />}/>
                            <Legend wrapperStyle={{ color: 'var(--text-color)' }} />
                            <Line type="monotone" dataKey="count" name="Nuevos Miembros" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Estado de las membresías</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={membershipStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                onClick={handlePieClick}
                                className="cursor-pointer"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return (
                                    <text x={x} y={y} fill="currentColor" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} className="text-gray-700 dark:text-gray-200">
                                        {`${membershipStatusData[index].name} (${value})`}
                                    </text>
                                    );
                                }}
                            >
                                {membershipStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section id="activity" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {recentlyJoined.map(user => (
                            <button key={user.id} onClick={() => onUserClick(user)} className="w-full text-left flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">se unió como {user.role.toLowerCase()}.</span></p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl ring-1 ring-black/5 dark:ring-white/10">
                     <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Acciones Rápidas</h3>
                     <div className="space-y-3">
                        <button onClick={() => onNavigate('users')} className="w-full text-left p-3 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center space-x-3 transition-colors">
                            <PlusIcon className="w-5 h-5 text-primary"/>
                            <span className="font-semibold text-primary">Añadir Nuevo Usuario</span>
                        </button>
                         <button onClick={() => onNavigate('reports')} className="w-full text-left p-3 bg-purple-500/10 hover:bg-purple-500/20 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 rounded-lg flex items-center space-x-3 transition-colors">
                            <ChartBarIcon className="w-5 h-5 text-purple-600 dark:text-purple-300"/>
                            <span className="font-semibold text-purple-700 dark:text-purple-200">Ver Reportes</span>
                        </button>
                        <button onClick={() => onNavigate('app-settings')} className="w-full text-left p-3 bg-gray-500/10 hover:bg-gray-500/20 dark:bg-gray-600/20 dark:hover:bg-gray-600/30 rounded-lg flex items-center space-x-3 transition-colors">
                            <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Ajustes de la Aplicación</span>
                        </button>
                     </div>
                 </div>
            </section>
        </div>
    );
};

export default DashboardOverview;

import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GymClass, Role, User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';

const ClassSchedule: React.FC = () => {
    const { users, gymClasses, addGymClass, updateGymClass, deleteGymClass } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<GymClass | null>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
    const [selectedDateForNewClass, setSelectedDateForNewClass] = useState<string>('');

    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);
    const sortedClasses = useMemo(() => [...gymClasses].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()), [gymClasses]);

    const handleAddNew = (date?: string) => {
        setEditingClass(null);
        if (date) {
            setSelectedDateForNewClass(date);
        } else {
            setSelectedDateForNewClass('');
        }
        setIsModalOpen(true);
    };

    const handleEdit = (gymClass: GymClass) => {
        setEditingClass(gymClass);
        setSelectedDateForNewClass('');
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this class? This will remove it from all schedules.')) {
            deleteGymClass(id);
        }
    };

    const handleSave = (gymClass: Omit<GymClass, 'id'> & { id?: string }) => {
        if (gymClass.id) {
            updateGymClass(gymClass as GymClass);
        } else {
            addGymClass({ ...gymClass, bookedClientIds: [] });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="w-full max-w-6xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Class Schedule</h2>
                
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setViewMode('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <CalendarDaysIcon className="w-5 h-5" />
                        <span>Calendar</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        <ClipboardListIcon className="w-5 h-5" />
                        <span>List</span>
                    </button>
                </div>

                <button onClick={() => handleAddNew()} className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-primary-foreground shadow-lg hover:shadow-primary/30">
                    <PlusIcon className="h-5 w-5" />
                    <span>New Class</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl ring-1 ring-black/5 dark:ring-white/10 shadow-xl overflow-hidden min-h-[600px]">
                {viewMode === 'calendar' ? (
                    <CalendarView 
                        classes={gymClasses} 
                        onDateClick={handleAddNew} 
                        onClassClick={handleEdit}
                    />
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {sortedClasses.length > 0 ? sortedClasses.map(gymClass => {
                            const trainer = trainers.find(t => t.id === gymClass.trainerId);
                            return (
                                <div key={gymClass.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 dark:hover:bg-gray-800 gap-4 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-primary">{gymClass.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{gymClass.description}</p>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                            <span>Trainer: <span className="font-medium text-gray-700 dark:text-gray-200">{trainer?.name || 'Unassigned'}</span></span>
                                            <span>Time: <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(gymClass.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(gymClass.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                                            <span className="flex items-center">
                                                <UserGroupIcon className="w-4 h-4 mr-1" />
                                                <span className="font-medium text-gray-700 dark:text-gray-200">{gymClass.bookedClientIds.length} / {gymClass.capacity}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 flex-shrink-0 self-end sm:self-center">
                                        <button onClick={() => handleEdit(gymClass)} className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary bg-gray-100 dark:bg-gray-700 rounded-lg"><PencilIcon className="h-5 w-5" /></button>
                                        <button onClick={(e) => handleDelete(gymClass.id, e)} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 rounded-lg"><TrashIcon className="h-5 w-5" /></button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">No classes scheduled.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ClassModal
                    gymClass={editingClass}
                    trainers={trainers}
                    preSelectedDate={selectedDateForNewClass}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

const CalendarView: React.FC<{ 
    classes: GymClass[]; 
    onDateClick: (date: string) => void; 
    onClassClick: (gymClass: GymClass) => void;
}> = ({ classes, onDateClick, onClassClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday ...
        const day = new Date(year, month, 1).getDay();
        // Adjust to make Monday = 0
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Get previous month details for padding
    const prevMonthDate = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

    const days = useMemo(() => {
        const dayList = [];
        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            dayList.push({ 
                day: daysInPrevMonth - firstDay + 1 + i, 
                month: month - 1, 
                year: month === 0 ? year - 1 : year,
                isCurrentMonth: false 
            });
        }
        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            dayList.push({ day: i, month, year, isCurrentMonth: true });
        }
        // Padding for next month (fill up to 42 cells for 6 rows grid)
        const remainingCells = 42 - dayList.length;
        for (let i = 1; i <= remainingCells; i++) {
            dayList.push({ 
                day: i, 
                month: month + 1, 
                year: month === 11 ? year + 1 : year,
                isCurrentMonth: false 
            });
        }
        return dayList;
    }, [year, month, daysInMonth, firstDay, daysInPrevMonth]);

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <button onClick={goToToday} className="px-3 py-1 text-xs font-bold uppercase hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all">Today</button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-md shadow-sm transition-all"><ChevronRightIcon className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {weekDays.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-gray-200 dark:bg-gray-700 gap-px border-b border-gray-200 dark:border-gray-700">
                {days.map((d, index) => {
                    const cellDateStr = new Date(d.year, d.month, d.day).toDateString();
                    const isToday = cellDateStr === new Date().toDateString();
                    
                    // Filter classes for this day
                    const dayClasses = classes.filter(c => {
                        const cDate = new Date(c.startTime);
                        return cDate.getDate() === d.day && cDate.getMonth() === d.month && cDate.getFullYear() === d.year;
                    }).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                    return (
                        <div 
                            key={index} 
                            onClick={() => onDateClick(new Date(d.year, d.month, d.day).toISOString().split('T')[0])}
                            className={`min-h-[100px] bg-white dark:bg-gray-800 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer flex flex-col gap-1 ${!d.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50 text-gray-400' : ''}`}
                        >
                            <div className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {d.day}
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                {dayClasses.map((cls) => (
                                    <button
                                        key={cls.id}
                                        onClick={(e) => { e.stopPropagation(); onClassClick(cls); }}
                                        className="text-left px-2 py-1 rounded text-xs font-medium truncate bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border-l-2 border-blue-500 hover:opacity-80 transition-opacity w-full"
                                        title={`${cls.name} (${new Date(cls.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`}
                                    >
                                        <span className="mr-1 opacity-75">{new Date(cls.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        {cls.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ClassModal: React.FC<{
    gymClass: GymClass | null;
    trainers: User[];
    preSelectedDate?: string;
    onSave: (gymClass: Omit<GymClass, 'id'> & { id?: string }) => void;
    onClose: () => void;
}> = ({ gymClass, trainers, preSelectedDate, onSave, onClose }) => {
    // Initialize state with either existing class data OR defaults (possibly using preSelectedDate)
    const [formData, setFormData] = useState(gymClass || { name: '', description: '', trainerId: '', startTime: '', endTime: '', capacity: 10, bookedClientIds: [] });
    
    // Logic for date input initialization
    const initialDate = gymClass 
        ? new Date(gymClass.startTime).toISOString().split('T')[0] 
        : preSelectedDate || new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(initialDate);
    const [startTime, setStartTime] = useState(gymClass ? new Date(gymClass.startTime).toTimeString().substring(0,5) : '09:00');
    const [endTime, setEndTime] = useState(gymClass ? new Date(gymClass.endTime).toTimeString().substring(0,5) : '10:00');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        onSave({
            ...formData,
            startTime: startDateTime.toISOString(),
            endTime: endDateTime.toISOString(),
            capacity: Number(formData.capacity)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
                <h2 className="text-2xl font-bold p-6 border-b border-gray-200 dark:border-gray-700">{gymClass ? 'Edit' : 'New'} Class</h2>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Class Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Trainer</label>
                        <select name="trainerId" value={formData.trainerId} onChange={handleChange} className="mt-1 block w-full input-style" required>
                            <option value="">Select a trainer...</option>
                            {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full input-style" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium">Capacity</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="mt-1 block w-full input-style" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Start Time</label>
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full input-style" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">End Time</label>
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full input-style" required />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold text-primary-foreground">Save Class</button>
                </div>
                 <style>{`
                    .input-style {
                        background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #111827; padding: 0.5rem 0.75rem;
                    }
                    .dark .input-style {
                        background-color: #374151; border-color: #4b5563; color: #f9fafb;
                    }
                    .input-style:focus { --tw-ring-color: hsl(var(--primary)); border-color: hsl(var(--primary)); }
                `}</style>
            </form>
        </div>
    );
};

export default ClassSchedule;

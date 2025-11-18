import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { GymClass, Role, User } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { UserGroupIcon } from '../icons/UserGroupIcon';

const ClassSchedule: React.FC = () => {
    const { users, gymClasses, addGymClass, updateGymClass, deleteGymClass } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<GymClass | null>(null);

    const trainers = useMemo(() => users.filter(u => u.role === Role.TRAINER), [users]);
    const sortedClasses = useMemo(() => [...gymClasses].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()), [gymClasses]);

    const handleAddNew = () => {
        setEditingClass(null);
        setIsModalOpen(true);
    };

    const handleEdit = (gymClass: GymClass) => {
        setEditingClass(gymClass);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
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
        <div className="w-full max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Class Schedule</h2>
                <button onClick={handleAddNew} className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-primary-foreground">
                    <PlusIcon className="h-5 w-5" />
                    <span>New Class</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedClasses.map(gymClass => {
                        const trainer = trainers.find(t => t.id === gymClass.trainerId);
                        return (
                            <div key={gymClass.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 dark:hover:bg-gray-800 gap-4">
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
                                    <button onClick={() => handleEdit(gymClass)} className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDelete(gymClass.id)} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isModalOpen && (
                <ClassModal
                    gymClass={editingClass}
                    trainers={trainers}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

const ClassModal: React.FC<{
    gymClass: GymClass | null;
    trainers: User[];
    onSave: (gymClass: Omit<GymClass, 'id'> & { id?: string }) => void;
    onClose: () => void;
}> = ({ gymClass, trainers, onSave, onClose }) => {
    const [formData, setFormData] = useState(gymClass || { name: '', description: '', trainerId: '', startTime: '', endTime: '', capacity: 10, bookedClientIds: [] });
    
    const [date, setDate] = useState(gymClass ? new Date(gymClass.startTime).toISOString().split('T')[0] : '');
    const [startTime, setStartTime] = useState(gymClass ? new Date(gymClass.startTime).toTimeString().substring(0,5) : '');
    const [endTime, setEndTime] = useState(gymClass ? new Date(gymClass.endTime).toTimeString().substring(0,5) : '');

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
                 {/* FIX: Removed non-standard "jsx" prop from style tag. */}
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
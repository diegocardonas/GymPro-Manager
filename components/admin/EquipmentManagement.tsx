import React, { useState, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { EquipmentItem, EquipmentStatus, IncidentReport } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

const EquipmentManagement: React.FC = () => {
    const { equipment, incidents, addEquipment, updateEquipment, deleteEquipment, resolveIncident } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);

    const handleAddNew = () => {
        setEditingEquipment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: EquipmentItem) => {
        setEditingEquipment(item);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
            deleteEquipment(id);
        }
    };

    const handleSave = (item: Omit<EquipmentItem, 'id'> & { id?: string }) => {
        if (item.id) {
            updateEquipment(item as EquipmentItem);
        } else {
            addEquipment(item);
        }
        setIsModalOpen(false);
    };

    const unresolvedIncidents = useMemo(() => incidents.filter(i => !i.isResolved), [incidents]);
    
    return (
        <div className="w-full max-w-6xl space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Equipos e Incidencias</h2>
                <button onClick={handleAddNew} className="btn-primary">
                    <PlusIcon className="h-5 w-5" />
                    <span>Nuevo Equipo</span>
                </button>
            </div>
            
            {/* Incidents Section */}
            {unresolvedIncidents.length > 0 && (
                 <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-xl ring-1 ring-red-500/20">
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">Reportes de Incidencias Activos ({unresolvedIncidents.length})</h3>
                     <div className="space-y-3 max-h-60 overflow-y-auto">
                         {unresolvedIncidents.map(incident => {
                             const item = equipment.find(e => e.id === incident.equipmentId);
                             return (
                                <div key={incident.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item?.name || 'Equipo Desconocido'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{incident.description}</p>
                                    </div>
                                    <button onClick={() => resolveIncident(incident.id)} className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Marcar como Resuelto</button>
                                </div>
                             )
                         })}
                    </div>
                </div>
            )}

            {/* Equipment Table */}
            <div className="bg-white dark:bg-gray-800/50 rounded-xl ring-1 ring-black/5 dark:ring-white/10 shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Nombre</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Tipo</th>
                            <th className="p-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {equipment.map(item => <EquipmentRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />)}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && <EquipmentModal equipment={editingEquipment} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
            
            {/* FIX: Removed non-standard "jsx" prop from style tag. */}
            <style>{`
                .btn-primary { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; }
                .btn-primary:hover { background-color: hsl(var(--primary) / 0.9); }
            `}</style>
        </div>
    );
};

const EquipmentRow: React.FC<{ item: EquipmentItem, onEdit: (i: EquipmentItem) => void, onDelete: (id: string) => void }> = ({ item, onEdit, onDelete }) => {
    const statusColors: Record<EquipmentStatus, string> = {
        [EquipmentStatus.OPERATIONAL]: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
        [EquipmentStatus.IN_REPAIR]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
        [EquipmentStatus.OUT_OF_SERVICE]: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
    };
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="p-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
            <td className="p-4 text-gray-600 dark:text-gray-400">{item.type}</td>
            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[item.status]}`}>{item.status}</span></td>
            <td className="p-4 text-right">
                 <div className="flex justify-end space-x-2">
                    <button onClick={() => onEdit(item)} className="p-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"><TrashIcon className="h-5 w-5" /></button>
                </div>
            </td>
        </tr>
    );
};

const EquipmentModal: React.FC<{
    equipment: EquipmentItem | null;
    onSave: (item: Omit<EquipmentItem, 'id'> & { id?: string }) => void;
    onClose: () => void;
}> = ({ equipment, onSave, onClose }) => {
    const [formData, setFormData] = useState(equipment || { name: '', type: '', location: '', status: EquipmentStatus.OPERATIONAL });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
                <h2 className="text-2xl font-bold p-6 border-b">{equipment ? 'Editar' : 'Nuevo'} Equipo</h2>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tipo</label>
                         <input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="p. ej., Cardio, Fuerza" className="mt-1 block w-full input-style" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Ubicación</label>
                         <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="p. ej., Zona Cardio" className="mt-1 block w-full input-style" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Estado</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full input-style" required>
                            {Object.values(EquipmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-t">
                    <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
                    <button type="submit" className="btn-primary">Guardar</button>
                </div>
                {/* FIX: Removed non-standard "jsx" prop from style tag. */}
                <style>{`
                    .input-style { background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #111827; padding: 0.5rem 0.75rem; }
                    .dark .input-style { background-color: #374151; border-color: #4b5563; color: #f9fafb; }
                    .input-style:focus { --tw-ring-color: hsl(var(--primary)); border-color: hsl(var(--primary)); }
                    .btn-primary { padding: 0.5rem 1rem; background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; }
                    .btn-primary:hover { background-color: hsl(var(--primary) / 0.9); }
                    .btn-secondary { padding: 0.5rem 1rem; background-color: #e5e7eb; color: #1f2937; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s; }
                    .dark .btn-secondary { background-color: #4b5563; color: #f9fafb; }
                `}</style>
            </form>
        </div>
    );
}

export default EquipmentManagement;
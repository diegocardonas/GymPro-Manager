import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { EquipmentItem } from '../../types';

interface ReportIncidentModalProps {
    reportedById: string;
    onClose: () => void;
}

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ reportedById, onClose }) => {
    const { equipment, reportIncident } = useContext(AuthContext);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEquipmentId || !description) {
            alert('Por favor, selecciona un equipo y describe el problema.');
            return;
        }
        reportIncident({
            equipmentId: selectedEquipmentId,
            reportedById: reportedById,
            description: description,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg animate-scale-in">
                <h2 className="text-2xl font-bold p-6 border-b border-gray-200 dark:border-gray-700">Reportar Problema de Equipo</h2>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="equipmentId" className="block text-sm font-medium">Equipo</label>
                        <select
                            id="equipmentId"
                            value={selectedEquipmentId}
                            onChange={(e) => setSelectedEquipmentId(e.target.value)}
                            className="mt-1 block w-full input-style"
                            required
                        >
                            <option value="" disabled>Selecciona un artículo...</option>
                            {equipment.map(item => (
                                <option key={item.id} value={item.id}>{item.name} - {item.location}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">Describe el Problema</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full input-style"
                            placeholder="p. ej., La pantalla no enciende, o hay un ruido fuerte del motor."
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-semibold">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white">Enviar Reporte</button>
                </div>
                {/* FIX: Removed non-standard "jsx" prop from style tag. */}
                <style>{`
                    .input-style { background-color: #f3f4f6; border: 1px solid #d1d5db; border-radius: 0.375rem; color: #111827; padding: 0.5rem 0.75rem; }
                    .dark .input-style { background-color: #374151; border-color: #4b5563; color: #f9fafb; }
                    .input-style:focus { --tw-ring-color: hsl(var(--primary)); border-color: hsl(var(--primary)); }
                `}</style>
            </form>
        </div>
    );
};

export default ReportIncidentModal;
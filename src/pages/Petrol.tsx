import React from 'react';
import { useEffect, useState } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2, Fuel } from 'lucide-react';
import type { VehicleLog } from '../store/vehicleStore';

const PetrolModal = ({ onClose, entry }: { onClose: () => void, entry?: VehicleLog }) => {
    const addLog = useVehicleStore(s => s.addLog);
    const updateLog = useVehicleStore(s => s.updateLog);
    const isLoading = useVehicleStore(s => s.isLoading);
    const activeBusiness = useBusinessStore(s => s.activeBusiness);

    const [form, setForm] = useState({
        date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        vehicleName: entry?.vehicleName || '',
        agentName: entry?.agentName || '',
        pumpName: entry?.pumpName || '',
        liter: entry?.liter?.toString() || '',
        rate: entry?.rate?.toString() || '',
        remark: entry?.remark || '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data: Partial<VehicleLog> = {
                businessId: activeBusiness?._id,
                type: 'petrol',
                date: form.date,
                vehicleName: form.vehicleName.trim(),
                agentName: form.agentName.trim(),
                pumpName: form.pumpName.trim(),
                liter: parseFloat(form.liter) || 0,
                rate: parseFloat(form.rate) || 0,
                remark: form.remark.trim(),
            } as any;

            if (entry) {
                await updateLog(entry._id, data);
            } else {
                await addLog(data);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${entry ? 'update' : 'add'} petrol entry`);
        }
    };

    const calculatedAmount = (parseFloat(form.liter) || 0) * (parseFloat(form.rate) || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark sticky top-0 bg-white dark:bg-bg-dark-secondary z-10">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                        <Fuel className="text-amber-500" />
                        {entry ? 'Edit Petrol Entry' : 'New Petrol Entry'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field w-full" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Name *</label>
                            <input value={form.vehicleName} onChange={e => setForm({ ...form, vehicleName: e.target.value })} className="input-field w-full" placeholder="e.g. MH 12 AB 1234" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agent / Driver Name *</label>
                            <input value={form.agentName} onChange={e => setForm({ ...form, agentName: e.target.value })} className="input-field w-full" placeholder="Ramesh" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pump Name *</label>
                            <input value={form.pumpName} onChange={e => setForm({ ...form, pumpName: e.target.value })} className="input-field w-full" placeholder="HP Petrol Pump" required />
                        </div>

                        <div className="col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-4">Fuel Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Liters *</label>
                            <input value={form.liter} onChange={e => setForm({ ...form, liter: e.target.value })} className="input-field w-full" type="number" step="0.01" min="0" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rate (₹) *</label>
                            <input value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} className="input-field w-full" type="number" step="0.01" min="0" placeholder="0.00" required />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                            <input value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="input-field w-full" placeholder="Optional remark..." />
                        </div>

                        <div className="sm:col-span-2 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-between border border-amber-100 dark:border-amber-900/50 mt-2">
                            <span className="text-amber-700 dark:text-amber-400 font-medium">Auto-Calculated Amount:</span>
                            <span className="text-xl font-bold font-heading text-amber-700 dark:text-amber-400">
                                ₹{calculatedAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-border-dark">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (entry ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {entry ? 'Save Changes' : 'Record Petrol Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Petrol = () => {
    const { logs, isLoading, fetchLogs, deleteLog } = useVehicleStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingLog, setEditingLog] = useState<VehicleLog | null>(null);

    // Filter to show only petrol logs
    const petrolLogs = logs.filter(l => l.type === 'petrol');

    useEffect(() => {
        if (currentBusiness) fetchLogs('petrol');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, date: string, liter: number) => {
        if (window.confirm(`Delete petrol entry of ${liter}L on ${new Date(date).toLocaleDateString()}?`)) {
            await deleteLog(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <>
            {(showAdd || editingLog) && (
                <PetrolModal
                    entry={editingLog || undefined}
                    onClose={() => { setShowAdd(false); setEditingLog(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
                            <Fuel className="text-amber-500" />
                            Petrol Logs
                        </h1>
                        <p className="text-slate-500 mt-1">Track petrol expenses for bikes and support vehicles.</p>
                    </div>
                    <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={18} /> Add Petrol Log
                    </button>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && petrolLogs.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : petrolLogs.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No petrol records found.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Vehicle</th>
                                        <th className="px-4 py-3 font-semibold">Agent & Pump</th>
                                        <th className="px-4 py-3 font-semibold text-right">Liters</th>
                                        <th className="px-4 py-3 font-semibold text-right">Rate</th>
                                        <th className="px-4 py-3 font-semibold text-right text-amber-600 bg-amber-50/50 dark:bg-amber-900/10">Amount</th>
                                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {petrolLogs.map(log => (
                                        <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 group">
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-indigo-600 dark:text-indigo-400">
                                                {log.vehicleName}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{log.agentName}</div>
                                                <div className="text-xs text-slate-500">{log.pumpName}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-300">
                                                {log.liter} L
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-500">
                                                ₹{log.rate.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10">
                                                {formatCurrency(log.amount)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingLog(log)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(log._id, log.date, log.liter)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

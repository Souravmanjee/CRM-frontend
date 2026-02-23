import { useEffect, useState } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2, Fuel } from 'lucide-react';
import type { VehicleLog } from '../store/vehicleStore';
import { ExportButton } from '../components/common/ExportButton';
import type { ColumnDef } from '../components/common/ExportButton';

const DieselModal = ({ onClose, entry }: { onClose: () => void, entry?: VehicleLog }) => {
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
                type: 'diesel',
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
            setError(err.message || `Failed to ${entry ? 'update' : 'add'} diesel entry`);
        }
    };

    const calculatedAmount = (parseFloat(form.liter) || 0) * (parseFloat(form.rate) || 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark sticky top-0 bg-white dark:bg-bg-dark-secondary z-10">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                        <Fuel className="text-rose-500" />
                        {entry ? 'Edit Diesel Entry' : 'New Diesel Entry'}
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

                        <div className="sm:col-span-2 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-between border border-rose-100 dark:border-rose-900/50 mt-2">
                            <span className="text-rose-700 dark:text-rose-400 font-medium">Auto-Calculated Amount:</span>
                            <span className="text-xl font-bold font-heading text-rose-700 dark:text-rose-400">
                                ₹{calculatedAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-border-dark">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (entry ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {entry ? 'Save Changes' : 'Record Diesel Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Diesel = () => {
    const { logs, isLoading, fetchLogs, deleteLog } = useVehicleStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingLog, setEditingLog] = useState<VehicleLog | null>(null);

    // Filter to show only diesel logs if the store happens to fetch all (though we ask specifically for diesel in the UI)
    const dieselLogs = logs.filter(l => l.type === 'diesel');

    useEffect(() => {
        if (currentBusiness) fetchLogs('diesel');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, date: string, liter: number) => {
        if (window.confirm(`Delete diesel entry of ${liter}L on ${new Date(date).toLocaleDateString()}?`)) {
            await deleteLog(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const exportColumns: ColumnDef<VehicleLog>[] = [
        { header: 'Date', key: (r) => new Date(r.date).toLocaleDateString('en-IN') },
        { header: 'Vehicle', key: 'vehicleName' },
        { header: 'Agent', key: 'agentName' },
        { header: 'Pump Name', key: 'pumpName' },
        { header: 'Liters', key: 'liter' },
        { header: 'Rate', key: 'rate' },
        { header: 'Amount', key: 'amount' },
        { header: 'Remarks', key: 'remark' }
    ];

    return (
        <>
            {(showAdd || editingLog) && (
                <DieselModal
                    entry={editingLog || undefined}
                    onClose={() => { setShowAdd(false); setEditingLog(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
                            <Fuel className="text-rose-500" />
                            Diesel Logs
                        </h1>
                        <p className="text-slate-500 mt-1">Track diesel expenses for all your rig vehicles.</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton data={dieselLogs} columns={exportColumns} filename="Diesel_Logs" />
                        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Add Diesel Log
                        </button>
                    </div>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && dieselLogs.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : dieselLogs.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No diesel records found.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Vehicle</th>
                                        <th className="px-4 py-3 font-semibold">Agent & Pump</th>
                                        <th className="px-4 py-3 font-semibold text-right">Liters</th>
                                        <th className="px-4 py-3 font-semibold text-right">Rate</th>
                                        <th className="px-4 py-3 font-semibold text-right text-rose-600 bg-rose-50/50 dark:bg-rose-900/10">Amount</th>
                                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {dieselLogs.map(log => (
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
                                            <td className="px-4 py-3 text-right font-bold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10">
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

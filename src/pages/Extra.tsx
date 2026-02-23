import React from 'react';
import { useEffect, useState } from 'react';
import { useExtraStore } from '../store/extraStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2, PlusCircle } from 'lucide-react';
import type { ExtraEntry } from '../store/extraStore';
import { ExportButton } from '../components/common/ExportButton';
import type { ColumnDef } from '../components/common/ExportButton';

const ExtraModal = ({ onClose, entry }: { onClose: () => void, entry?: ExtraEntry }) => {
    const addLog = useExtraStore(s => s.addLog);
    const updateLog = useExtraStore(s => s.updateLog);
    const isLoading = useExtraStore(s => s.isLoading);
    const activeBusiness = useBusinessStore(s => s.activeBusiness);

    const [form, setForm] = useState({
        date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expenseName: entry?.expenseName || '',
        amount: entry?.amount?.toString() || '',
        remark: entry?.remark || '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data: Partial<ExtraEntry> = {
                businessId: activeBusiness?._id,
                date: form.date,
                expenseName: form.expenseName.trim(),
                amount: parseFloat(form.amount) || 0,
                remark: form.remark.trim(),
            } as any;

            if (entry) {
                await updateLog(entry._id, data);
            } else {
                await addLog(data);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${entry ? 'update' : 'add'} extra expense entry`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark sticky top-0 bg-white dark:bg-bg-dark-secondary z-10">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                        <PlusCircle className="text-indigo-500" />
                        {entry ? 'Edit Extra Expense' : 'New Extra Expense'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field w-full" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expense Name / Reason *</label>
                            <input value={form.expenseName} onChange={e => setForm({ ...form, expenseName: e.target.value })} className="input-field w-full" placeholder="e.g. Generator Repair" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹) *</label>
                            <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-field w-full" type="number" step="0.01" min="0" placeholder="0.00" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                            <input value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="input-field w-full" placeholder="Optional remark..." />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-border-dark">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (entry ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {entry ? 'Save Changes' : 'Record Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Extra = () => {
    const { logs, isLoading, fetchLogs, deleteLog } = useExtraStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingLog, setEditingLog] = useState<ExtraEntry | null>(null);

    useEffect(() => {
        if (currentBusiness) fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, name: string, date: string) => {
        if (window.confirm(`Delete extra expense record for "${name}" on ${new Date(date).toLocaleDateString()}?`)) {
            await deleteLog(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const exportColumns: ColumnDef<ExtraEntry>[] = [
        { header: 'Date', key: (r) => new Date(r.date).toLocaleDateString('en-IN') },
        { header: 'Expense Reason', key: 'expenseName' },
        { header: 'Remarks', key: 'remark' },
        { header: 'Amount', key: 'amount' }
    ];

    return (
        <>
            {(showAdd || editingLog) && (
                <ExtraModal
                    entry={editingLog || undefined}
                    onClose={() => { setShowAdd(false); setEditingLog(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
                            <PlusCircle className="text-indigo-500" />
                            Extra Expenses
                        </h1>
                        <p className="text-slate-500 mt-1">Track miscellaneous and extra expenses for operations.</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton data={logs} columns={exportColumns} filename="Extra_Expenses" />
                        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Add Expense
                        </button>
                    </div>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && logs.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : logs.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No extra expense records found.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Expense Reason</th>
                                        <th className="px-6 py-4 font-semibold">Remarks</th>
                                        <th className="px-6 py-4 font-semibold text-right text-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10">Amount</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {logs.map(log => (
                                        <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 group">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                                {log.expenseName}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {log.remark || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10">
                                                {formatCurrency(log.amount)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingLog(log)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(log._id, log.expenseName, log.date)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
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

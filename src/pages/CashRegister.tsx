import React from 'react';
import { useEffect, useState } from 'react';
import { useCashRegisterStore } from '../store/cashRegisterStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2, Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { CashRegisterEntry } from '../store/cashRegisterStore';
import { ExportButton } from '../components/common/ExportButton';
import type { ColumnDef } from '../components/common/ExportButton';

const CashRegisterModal = ({ onClose, entry }: { onClose: () => void, entry?: CashRegisterEntry }) => {
    const addLog = useCashRegisterStore(s => s.addEntry);
    const updateLog = useCashRegisterStore(s => s.updateEntry);
    const isLoading = useCashRegisterStore(s => s.isLoading);
    const activeBusiness = useBusinessStore(s => s.activeBusiness);

    const [form, setForm] = useState({
        date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        particulars: entry?.particulars || '',
        transactionType: entry?.transactionType || 'Cash Out',
        amount: entry?.amount?.toString() || '',
        remark: entry?.remark || '',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data: Partial<CashRegisterEntry> = {
                businessId: activeBusiness?._id,
                date: form.date,
                particulars: form.particulars.trim(),
                transactionType: form.transactionType as 'Cash In' | 'Cash Out',
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
            setError(err.message || `Failed to ${entry ? 'update' : 'add'} transaction`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark sticky top-0 bg-white dark:bg-bg-dark-secondary z-10">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2">
                        <Banknote className="text-emerald-500" />
                        {entry ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, transactionType: 'Cash In' })}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${form.transactionType === 'Cash In'
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <ArrowUpRight size={24} className={form.transactionType === 'Cash In' ? 'text-emerald-500' : ''} />
                                <span className="font-semibold text-sm">Cash In</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, transactionType: 'Cash Out' })}
                                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${form.transactionType === 'Cash Out'
                                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <ArrowDownRight size={24} className={form.transactionType === 'Cash Out' ? 'text-rose-500' : ''} />
                                <span className="font-semibold text-sm">Cash Out</span>
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field w-full" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Particulars / Details *</label>
                            <input value={form.particulars} onChange={e => setForm({ ...form, particulars: e.target.value })} className="input-field w-full" placeholder="e.g. Work Advance from Customer" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                            <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="input-field w-full" type="number" step="0.01" min="0" placeholder="0.00" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks</label>
                            <input value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="input-field w-full" placeholder="Optional remark..." />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-border-dark">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className={`btn-primary flex-1 flex items-center justify-center gap-2 ${form.transactionType === 'Cash In' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                            }`}>
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (entry ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {entry ? 'Save Changes' : `Record ${form.transactionType}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const CashRegister = () => {
    const { entries, isLoading, fetchEntries, deleteEntry } = useCashRegisterStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingLog, setEditingLog] = useState<CashRegisterEntry | null>(null);

    useEffect(() => {
        if (currentBusiness) fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, particulars: string, date: string) => {
        if (window.confirm(`Delete transaction "${particulars}" on ${new Date(date).toLocaleDateString()}? WARNING: Subsequent running balances will not be auto-recalculated.`)) {
            await deleteEntry(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const exportColumns: ColumnDef<CashRegisterEntry>[] = [
        { header: 'Date', key: (r) => new Date(r.date).toLocaleDateString('en-IN') },
        { header: 'Particulars', key: 'particulars' },
        { header: 'Transaction Type', key: 'transactionType' },
        { header: 'Remarks', key: 'remark' },
        { header: 'Amount', key: 'amount' },
        { header: 'Running Balance', key: 'runningBalance' }
    ];

    return (
        <>
            {(showAdd || editingLog) && (
                <CashRegisterModal
                    entry={editingLog || undefined}
                    onClose={() => { setShowAdd(false); setEditingLog(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white flex items-center gap-2">
                            <Banknote className="text-emerald-500" />
                            Cash Register
                        </h1>
                        <p className="text-slate-500 mt-1">Manage cash flow, monitor cash in/out, and track the running balance.</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton data={entries} columns={exportColumns} filename="Cash_Register" />
                        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> New Transaction
                        </button>
                    </div>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && entries.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : entries.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No transactions recorded yet.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Particulars</th>
                                        <th className="px-6 py-4 font-semibold">Remarks</th>
                                        <th className="px-6 py-4 font-semibold text-right text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/10">Cash In</th>
                                        <th className="px-6 py-4 font-semibold text-right text-rose-600 bg-rose-50/50 dark:bg-rose-900/10">Cash Out</th>
                                        <th className="px-6 py-4 font-semibold text-right text-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10 border-l border-slate-200 dark:border-slate-800">Running Balance</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {entries.map(log => (
                                        <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 group">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                                {log.particulars}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {log.remark || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/5">
                                                {log.transactionType === 'Cash In' ? formatCurrency(log.amount) : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-rose-600 dark:text-rose-400 bg-rose-50/30 dark:bg-rose-900/5">
                                                {log.transactionType === 'Cash Out' ? formatCurrency(log.amount) : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/5 border-l border-slate-100 dark:border-slate-800/50">
                                                {typeof log.runningBalance === 'number' ? formatCurrency(log.runningBalance) : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingLog(log)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(log._id, log.particulars, log.date)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
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

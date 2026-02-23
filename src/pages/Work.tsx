import { useEffect, useState } from 'react';
import { useWorkStore } from '../store/workStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2, FileText } from 'lucide-react';
import type { WorkEntry } from '../store/workStore';
import { ExportButton } from '../components/common/ExportButton';
import type { ColumnDef } from '../components/common/ExportButton';

const WorkModal = ({ onClose, entry }: { onClose: () => void, entry?: WorkEntry }) => {
    const addWork = useWorkStore(s => s.addWork);
    const updateWork = useWorkStore(s => s.updateWork);
    const isLoading = useWorkStore(s => s.isLoading);
    const activeBusiness = useBusinessStore(s => s.activeBusiness);

    const [form, setForm] = useState({
        date: entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        agent: entry?.agent || '',
        location: entry?.location || '',
        diesel: entry?.diesel?.toString() || '',
        depth: entry?.depth?.toString() || '',
        fiveCasing: entry?.fiveCasing?.toString() || '',
        sevenCasing: entry?.sevenCasing?.toString() || '',
        srpm: entry?.srpm?.toString() || '',
        erpm: entry?.erpm?.toString() || '',
        rate: entry?.rate?.toString() || '',
        loringRate: entry?.loringRate?.toString() || '',
        stepRate: entry?.stepRate?.toString() || '',
        fiveCasingRate: entry?.fiveCasingRate?.toString() || '',
        sevenRate: entry?.sevenRate?.toString() || '',
        extra: entry?.extra?.toString() || '',
        payment: entry?.payment?.toString() || '',
        casingPaid: entry?.casingPaid?.toString() || '',
        remark: entry?.remark || '',
        notes: entry?.notes || '',
    });
    const [error, setError] = useState('');

    // Real-time derivations
    const srpmNum = parseFloat(form.srpm) || 0;
    const erpmNum = parseFloat(form.erpm) || 0;
    const hourCalc = erpmNum > 0 ? Math.max(0, erpmNum - srpmNum) : 0;

    const depthNum = parseFloat(form.depth) || 0;
    const avgCalc = hourCalc > 0 ? depthNum / hourCalc : 0;

    const rateNum = parseFloat(form.rate) || 0;
    const stepRateNum = parseFloat(form.stepRate) || 0;
    const extraNum = parseFloat(form.extra) || 0;
    const loringRateNum = parseFloat(form.loringRate) || 0;

    const fiveCasingNum = parseFloat(form.fiveCasing) || 0;
    const sevenCasingNum = parseFloat(form.sevenCasing) || 0;

    // DepthAmount = (Depth * Rate) + (5 casing * LoringRate) + (7 casing * LoringRate)
    const depthAmountCalc = (depthNum * rateNum) + (fiveCasingNum * loringRateNum) + (sevenCasingNum * loringRateNum);

    const fiveRateNum = parseFloat(form.fiveCasingRate) || 0;
    const sevenRateNum = parseFloat(form.sevenRate) || 0;
    const casingAmountCalc = (fiveCasingNum * fiveRateNum) + (sevenCasingNum * sevenRateNum);

    // TotalBill = DepthAmount + CasingAmount + StepRate + Extra
    const totalBillCalc = depthAmountCalc + casingAmountCalc + stepRateNum + extraNum;

    const paymentNum = parseFloat(form.payment) || 0;
    const dueCalc = totalBillCalc - paymentNum;

    const casingPaidNum = parseFloat(form.casingPaid) || 0;
    const casingDueCalc = casingAmountCalc - casingPaidNum;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.erpm && form.srpm && parseFloat(form.erpm) > 0 && parseFloat(form.erpm) < parseFloat(form.srpm)) {
            setError('ERPM must be greater than or equal to SRPM.');
            return;
        }

        try {
            const data: Partial<WorkEntry> = {
                businessId: activeBusiness?._id,
                date: form.date,
                agent: form.agent.trim(),
                location: form.location.trim(),
                diesel: parseFloat(form.diesel) || 0,
                depth: parseFloat(form.depth) || 0,
                fiveCasing: parseFloat(form.fiveCasing) || 0,
                sevenCasing: parseFloat(form.sevenCasing) || 0,
                srpm: parseFloat(form.srpm) || 0,
                erpm: parseFloat(form.erpm) || 0,
                rate: parseFloat(form.rate) || 0,
                loringRate: parseFloat(form.loringRate) || 0,
                stepRate: parseFloat(form.stepRate) || 0,
                fiveCasingRate: parseFloat(form.fiveCasingRate) || 0,
                sevenRate: parseFloat(form.sevenRate) || 0,
                extra: parseFloat(form.extra) || 0,
                payment: parseFloat(form.payment) || 0,
                casingPaid: parseFloat(form.casingPaid) || 0,
                remark: form.remark.trim(),
                notes: form.notes.trim(),
            } as any;

            if (entry) {
                await updateWork(entry._id, data);
            } else {
                await addWork(data);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${entry ? 'update' : 'add'} work entry`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark sticky top-0 bg-white dark:bg-bg-dark-secondary z-10">
                    <h2 className="text-xl font-heading font-bold">{entry ? 'Edit Work Entry' : 'New Work Entry'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                    {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field w-full" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agent Name *</label>
                                <input value={form.agent} onChange={e => setForm({ ...form, agent: e.target.value })} className="input-field w-full" placeholder="Ravi Kumar" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field w-full" placeholder="Site Location" />
                            </div>
                        </div>

                        {/* User Inputs Left Column */}
                        <div className="space-y-4 lg:col-span-2">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Manual Inputs</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diesel (Liters)</label>
                                    <input value={form.diesel} onChange={e => setForm({ ...form, diesel: e.target.value })} className="input-field w-full" type="number" min="0" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Depth (Feet)</label>
                                    <input value={form.depth} onChange={e => setForm({ ...form, depth: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">5" Casing</label>
                                    <input value={form.fiveCasing} onChange={e => setForm({ ...form, fiveCasing: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">7" Casing</label>
                                    <input value={form.sevenCasing} onChange={e => setForm({ ...form, sevenCasing: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SRPM</label>
                                    <input value={form.srpm} onChange={e => setForm({ ...form, srpm: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ERPM</label>
                                    <input value={form.erpm} onChange={e => setForm({ ...form, erpm: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rate</label>
                                    <input value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loring Rate</label>
                                    <input value={form.loringRate} onChange={e => setForm({ ...form, loringRate: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Step Rate</label>
                                    <input value={form.stepRate} onChange={e => setForm({ ...form, stepRate: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">5" Casing Rate</label>
                                    <input value={form.fiveCasingRate} onChange={e => setForm({ ...form, fiveCasingRate: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">7" Rate</label>
                                    <input value={form.sevenRate} onChange={e => setForm({ ...form, sevenRate: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Extra</label>
                                    <input value={form.extra} onChange={e => setForm({ ...form, extra: e.target.value })} className="input-field w-full" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Payment</label>
                                    <input value={form.payment} onChange={e => setForm({ ...form, payment: e.target.value })} className="input-field w-full border-emerald-200 focus:border-emerald-500" type="number" step="0.01" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Casing Paid</label>
                                    <input value={form.casingPaid} onChange={e => setForm({ ...form, casingPaid: e.target.value })} className="input-field w-full border-emerald-200 focus:border-emerald-500" type="number" step="0.01" placeholder="0" />
                                </div>
                            </div>
                        </div>

                        {/* Auto-Calculated Grey Fields Right Column */}
                        <div className="space-y-4 lg:col-span-1 border-l-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6 pt-6 lg:pt-0">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={16} /> Auto-Calculated
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Hour (ERPM - SRPM)</label>
                                    <input value={hourCalc.toFixed(2)} disabled className="input-field w-full bg-slate-100 text-slate-600 dark:bg-slate-800/50 cursor-not-allowed border-slate-200" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Avg (Depth / Hour)</label>
                                    <input value={avgCalc.toFixed(2)} disabled className="input-field w-full bg-slate-100 text-slate-600 dark:bg-slate-800/50 cursor-not-allowed border-slate-200" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Depth Amount</label>
                                    <input value={depthAmountCalc.toFixed(2)} disabled className="input-field w-full bg-slate-100 text-slate-600 dark:bg-slate-800/50 cursor-not-allowed border-slate-200" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Casing Amount</label>
                                    <input value={casingAmountCalc.toFixed(2)} disabled className="input-field w-full bg-slate-100 text-slate-600 dark:bg-slate-800/50 cursor-not-allowed border-slate-200" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Total Bill</label>
                                    <input value={totalBillCalc.toFixed(2)} disabled className="input-field w-full bg-slate-200 text-slate-800 dark:bg-slate-700/50 cursor-not-allowed font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-rose-500 mb-1">Due</label>
                                    <input value={dueCalc.toFixed(2)} disabled className="input-field w-full bg-rose-50 text-rose-700 dark:bg-rose-900/10 cursor-not-allowed font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-rose-500 mb-1">Casing Due</label>
                                    <input value={casingDueCalc.toFixed(2)} disabled className="input-field w-full bg-rose-50 text-rose-700 dark:bg-rose-900/10 cursor-not-allowed font-bold" />
                                </div>
                            </div>
                        </div>

                        {/* Section: Text Info */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remark</label>
                                <textarea value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} className="input-field w-full min-h-[80px]" placeholder="Optional remark..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field w-full min-h-[80px]" placeholder="Additional context..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-border-dark">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (entry ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {entry ? 'Save Changes' : 'Record Work Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Work = () => {
    const { works, isLoading, fetchWorks, deleteWork } = useWorkStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingWork, setEditingWork] = useState<WorkEntry | null>(null);

    useEffect(() => {
        if (currentBusiness) fetchWorks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, date: string, location: string) => {
        if (window.confirm(`Delete work entry for ${location || 'unknown location'} on ${new Date(date).toLocaleDateString()}?`)) {
            await deleteWork(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const exportColumns: ColumnDef<WorkEntry>[] = [
        { header: 'Date', key: (r) => new Date(r.date).toLocaleDateString('en-IN') },
        { header: 'Agent', key: 'agent' },
        { header: 'Location', key: 'location' },
        { header: 'SRPM', key: 'srpm' },
        { header: 'ERPM', key: 'erpm' },
        { header: 'Depth', key: 'depth' },
        { header: 'Hour', key: 'hour' },
        { header: 'Avg', key: 'avg' },
        { header: 'Diesel', key: 'diesel' },
        { header: 'Depth Amount', key: 'depthAmount' },
        { header: 'Casing Amount', key: 'casingAmount' },
        { header: 'Total Bill', key: 'totalBill' },
        { header: 'Payment', key: 'payment' },
        { header: 'Due', key: 'due' },
        { header: 'Casing Due', key: 'casingDue' }
    ];

    return (
        <>
            {(showAdd || editingWork) && (
                <WorkModal
                    entry={editingWork || undefined}
                    onClose={() => { setShowAdd(false); setEditingWork(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Borewell Work Logs</h1>
                        <p className="text-slate-500 mt-1">Manage field operations, rig metrics, and billing</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton data={works} columns={exportColumns} filename="Work_Logs" />
                        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Add Work Log
                        </button>
                    </div>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && works.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : works.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No work records found.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-4 py-3 font-semibold">Date</th>
                                        <th className="px-4 py-3 font-semibold">Agent</th>
                                        <th className="px-4 py-3 font-semibold text-right text-indigo-600">Depth</th>
                                        <th className="px-4 py-3 font-semibold text-right">RPM (S-E) = Hr</th>
                                        <th className="px-4 py-3 font-semibold text-right">Avg</th>
                                        <th className="px-4 py-3 font-semibold text-right bg-emerald-50/50 dark:bg-emerald-900/10">Total Bill</th>
                                        <th className="px-4 py-3 font-semibold text-right text-rose-600 bg-rose-50/50 dark:bg-rose-900/10">Due</th>
                                        <th className="px-4 py-3 font-semibold text-right">Payment</th>
                                        <th className="px-4 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {works.map(w => (
                                        <tr key={w._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 group">
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                {new Date(w.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-800 dark:text-slate-200">{w.agent}</div>
                                                {w.location && <div className="text-xs text-slate-500">{w.location}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10">
                                                {w.depth} ft
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-500 flex justify-end items-center gap-1">
                                                <span>{w.srpm} - {w.erpm}</span>
                                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded">={w.hour}h</span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-primary-600 dark:text-primary-400">
                                                {w.avg?.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10">
                                                {formatCurrency(w.totalBill)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-900/10">
                                                {formatCurrency(w.due)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-slate-600 dark:text-slate-300">
                                                {formatCurrency(w.payment)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingWork(w)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(w._id, w.date, w.location || w.agent)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
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

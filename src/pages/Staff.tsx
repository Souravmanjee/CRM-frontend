import { useEffect, useState } from 'react';
import { useStaffStore } from '../store/staffStore';
import { useBusinessStore } from '../store/businessStore';
import { Plus, Loader2, X, Edit2, Trash2 } from 'lucide-react';
import type { Employee } from '../store/staffStore';
import { ExportButton } from '../components/common/ExportButton';
import type { ColumnDef } from '../components/common/ExportButton';

const EmployeeModal = ({ onClose, employee }: { onClose: () => void, employee?: Employee }) => {
    const addEmployee = useStaffStore(s => s.addEmployee);
    const updateEmployee = useStaffStore(s => s.updateEmployee);
    const isLoading = useStaffStore(s => s.isLoading);
    const activeBusiness = useBusinessStore(s => s.activeBusiness);

    const [form, setForm] = useState({
        employeeName: employee?.employeeName || '',
        designation: employee?.designation || '',
        joiningDate: employee?.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        mobileNumber: employee?.mobileNumber || '',
        address: employee?.address || '',
        workingDays: employee?.workingDays?.toString() || '0',
        holidays: employee?.holidays?.toString() || '0',
        totalDaysWorked: employee?.totalDaysWorked?.toString() || '0',
        monthlySalary: employee?.monthlySalary?.toString() || '0',
        advancePaid: employee?.advancePaid?.toString() || '0',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.employeeName.trim() || !form.designation.trim() || !form.mobileNumber.trim() || !form.address.trim()) {
            setError('Please fill all required fields');
            return;
        }
        setError('');
        try {
            const data: Partial<Employee> = {
                businessId: activeBusiness?._id,
                employeeName: form.employeeName.trim(),
                designation: form.designation.trim(),
                joiningDate: form.joiningDate,
                mobileNumber: form.mobileNumber.trim(),
                address: form.address.trim(),
                workingDays: parseInt(form.workingDays) || 0,
                holidays: parseInt(form.holidays) || 0,
                totalDaysWorked: parseInt(form.totalDaysWorked) || 0,
                monthlySalary: parseFloat(form.monthlySalary) || 0,
                advancePaid: parseFloat(form.advancePaid) || 0,
            } as any;

            if (employee) {
                await updateEmployee(employee._id, data);
            } else {
                await addEmployee(data);
            }
            onClose();
        } catch (err: any) {
            setError(err.message || `Failed to ${employee ? 'update' : 'add'} employee`);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-bg-dark-secondary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-border-dark">
                    <h2 className="text-xl font-heading font-bold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name *</label>
                            <input value={form.employeeName} onChange={e => setForm(f => ({ ...f, employeeName: e.target.value }))} className="input-field w-full" placeholder="Ramesh Kumar" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation *</label>
                            <input value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} className="input-field w-full" placeholder="Driller" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Number *</label>
                            <input value={form.mobileNumber} onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} className="input-field w-full" placeholder="+91..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date *</label>
                            <input type="date" value={form.joiningDate} onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))} className="input-field w-full" required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address *</label>
                            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-field w-full" placeholder="123 Main St..." required />
                        </div>

                        <div className="col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider mb-4">Salary & Attendance</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (₹) *</label>
                            <input value={form.monthlySalary} onChange={e => setForm(f => ({ ...f, monthlySalary: e.target.value }))} className="input-field w-full" type="number" min="0" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Advance Paid (₹)</label>
                            <input value={form.advancePaid} onChange={e => setForm(f => ({ ...f, advancePaid: e.target.value }))} className="input-field w-full" type="number" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Days</label>
                            <input value={form.workingDays} onChange={e => setForm(f => ({ ...f, workingDays: e.target.value }))} className="input-field w-full" type="number" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Holidays</label>
                            <input value={form.holidays} onChange={e => setForm(f => ({ ...f, holidays: e.target.value }))} className="input-field w-full" type="number" min="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Days Worked</label>
                            <input value={form.totalDaysWorked} onChange={e => setForm(f => ({ ...f, totalDaysWorked: e.target.value }))} className="input-field w-full" type="number" min="0" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-border-dark mt-6">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (employee ? <Edit2 size={18} /> : <Plus size={18} />)}
                            {employee ? 'Save Changes' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Staff = () => {
    const { employees, isLoading, fetchEmployees, deleteEmployee } = useStaffStore();
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [showAdd, setShowAdd] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        if (currentBusiness) fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentBusiness?._id]);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Delete staff member ${name}?`)) {
            await deleteEmployee(id);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    const exportColumns: ColumnDef<Employee>[] = [
        { header: 'Employee Name', key: 'employeeName' },
        { header: 'Designation', key: 'designation' },
        { header: 'Mobile', key: 'mobileNumber' },
        { header: 'Joining Date', key: (r) => r.joiningDate ? new Date(r.joiningDate).toLocaleDateString('en-IN') : '' },
        { header: 'Address', key: 'address' },
        { header: 'Days Worked', key: 'totalDaysWorked' },
        { header: 'Salary/Day', key: 'perDaySalary' },
        { header: 'Total Salary', key: 'totalSalary' },
        { header: 'Advance Paid', key: 'advancePaid' },
        { header: 'Due Amount', key: 'dueAmount' }
    ];

    return (
        <>
            {(showAdd || editingEmployee) && (
                <EmployeeModal
                    employee={editingEmployee || undefined}
                    onClose={() => { setShowAdd(false); setEditingEmployee(null); }}
                />
            )}

            <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Staff Management</h1>
                        <p className="text-slate-500 mt-1">Manage employees, attendance, and salary</p>
                    </div>
                    <div className="flex gap-2">
                        <ExportButton data={employees} columns={exportColumns} filename="Staff_Records" />
                        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
                            <Plus size={18} /> Add Staff
                        </button>
                    </div>
                </div>

                <div className="card flex flex-col flex-1 overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading && employees.length === 0 ? (
                            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary-500 w-8 h-8" /></div>
                        ) : employees.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">No staff records found.</div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-border-dark text-xs uppercase tracking-wider text-slate-500 bg-slate-50 dark:bg-slate-800/20">
                                        <th className="px-6 py-4 font-semibold">Name</th>
                                        <th className="px-6 py-4 font-semibold">Designation</th>
                                        <th className="px-6 py-4 font-semibold">Mobile</th>
                                        <th className="px-6 py-4 font-semibold text-right">Days Worked</th>
                                        <th className="px-6 py-4 font-semibold text-right">Salary/Day</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total Salary</th>
                                        <th className="px-6 py-4 font-semibold text-right">Advance Paid</th>
                                        <th className="px-6 py-4 font-semibold text-right text-rose-600">Due Amount</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {employees.map(emp => (
                                        <tr key={emp._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{emp.employeeName}</td>
                                            <td className="px-6 py-4 text-slate-500">{emp.designation}</td>
                                            <td className="px-6 py-4 text-slate-500">{emp.mobileNumber}</td>
                                            <td className="px-6 py-4 text-right">{emp.totalDaysWorked}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(emp.perDaySalary)}</td>
                                            <td className="px-6 py-4 text-right font-medium">{formatCurrency(emp.totalSalary)}</td>
                                            <td className="px-6 py-4 text-right text-emerald-600">{formatCurrency(emp.advancePaid)}</td>
                                            <td className="px-6 py-4 text-right font-bold text-rose-600">{formatCurrency(emp.dueAmount)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setEditingEmployee(emp)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(emp._id, emp.employeeName)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg">
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

import { useState, useEffect } from 'react';
import { useWorkStore } from '../store/workStore';
import { useCashRegisterStore } from '../store/cashRegisterStore';
import { useStaffStore } from '../store/staffStore';
import { useVehicleStore } from '../store/vehicleStore';
import { useLabourStore } from '../store/labourStore';
import { useRationStore } from '../store/rationStore';
import { useExtraStore } from '../store/extraStore';
import { useBusinessStore } from '../store/businessStore';
import { FileSpreadsheet, FileText, Calendar, CheckSquare, Layers } from 'lucide-react';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const REPORT_MODULES = [
    {
        id: 'work',
        name: 'Work Logs',
        fetcher: () => useWorkStore.getState().fetchWorks(),
        storeSelector: () => useWorkStore((s: any) => s.works),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'agent', label: 'Agent', fn: (r: any) => r.agent },
            { id: 'location', label: 'Location', fn: (r: any) => r.location || '-' },
            { id: 'srpm', label: 'SRPM', fn: (r: any) => r.srpm },
            { id: 'erpm', label: 'ERPM', fn: (r: any) => r.erpm },
            { id: 'depth', label: 'Depth (ft)', fn: (r: any) => r.depth },
            { id: 'diesel', label: 'Diesel (L)', fn: (r: any) => r.diesel },
            { id: 'fiveCasing', label: '5" Casing', fn: (r: any) => r.fiveCasing },
            { id: 'sevenCasing', label: '7" Casing', fn: (r: any) => r.sevenCasing },
            { id: 'hour', label: 'Hour', fn: (r: any) => r.hour },
            { id: 'avg', label: 'Avg', fn: (r: any) => r.avg?.toFixed(2) },
            { id: 'rate', label: 'Rate', fn: (r: any) => r.rate },
            { id: 'loringRate', label: 'Loring Rate', fn: (r: any) => r.loringRate },
            { id: 'stepRate', label: 'Step Rate', fn: (r: any) => r.stepRate },
            { id: 'depthAmount', label: 'Depth Amount', fn: (r: any) => r.depthAmount },
            { id: 'casingAmount', label: 'Casing Amount', fn: (r: any) => r.casingAmount },
            { id: 'totalBill', label: 'Total Bill', fn: (r: any) => r.totalBill },
            { id: 'payment', label: 'Payment', fn: (r: any) => r.payment },
            { id: 'due', label: 'Due', fn: (r: any) => r.due },
            { id: 'casingPaid', label: 'Casing Paid', fn: (r: any) => r.casingPaid },
            { id: 'casingDue', label: 'Casing Due', fn: (r: any) => r.casingDue },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'cash-register',
        name: 'Cash Register',
        fetcher: () => useCashRegisterStore.getState().fetchEntries(),
        storeSelector: () => useCashRegisterStore((s: any) => s.entries),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'particulars', label: 'Particulars', fn: (r: any) => r.particulars },
            { id: 'transactionType', label: 'Type', fn: (r: any) => r.transactionType },
            { id: 'amount', label: 'Amount (₹)', fn: (r: any) => r.amount },
            { id: 'runningBalance', label: 'Balance', fn: (r: any) => r.runningBalance },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'staff',
        name: 'Staff List',
        fetcher: () => useStaffStore.getState().fetchEmployees(),
        storeSelector: () => useStaffStore((s: any) => s.employees),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'name', label: 'Employee Name', fn: (r: any) => r.employeeName },
            { id: 'designation', label: 'Designation', fn: (r: any) => r.designation },
            { id: 'present', label: 'Status', fn: (r: any) => r.present ? 'Present' : 'Absent' },
            { id: 'mobileNumber', label: 'Mobile', fn: (r: any) => r.mobileNumber },
            { id: 'monthlySalary', label: 'Monthly Salary', fn: (r: any) => r.monthlySalary },
            { id: 'workingDays', label: 'Working Days', fn: (r: any) => r.workingDays },
            { id: 'holidays', label: 'Holidays', fn: (r: any) => r.holidays },
            { id: 'totalDaysWorked', label: 'Total Days Worked', fn: (r: any) => r.totalDaysWorked },
            { id: 'totalSalary', label: 'Total Salary', fn: (r: any) => r.totalSalary },
            { id: 'advancePaid', label: 'Advance Paid', fn: (r: any) => r.advancePaid },
            { id: 'dueAmount', label: 'Due Amount', fn: (r: any) => r.dueAmount },
        ]
    },
    {
        id: 'diesel',
        name: 'Diesel Logs',
        fetcher: () => useVehicleStore.getState().fetchLogs('diesel'),
        storeSelector: () => useVehicleStore((s: any) => s.logs),
        filterData: (data: any[]) => data.filter(d => d.type === 'diesel'),
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'vehicleName', label: 'Vehicle', fn: (r: any) => r.vehicleName },
            { id: 'agentName', label: 'Agent', fn: (r: any) => r.agentName },
            { id: 'pumpName', label: 'Pump', fn: (r: any) => r.pumpName },
            { id: 'liter', label: 'Liters', fn: (r: any) => r.liter },
            { id: 'rate', label: 'Rate (₹)', fn: (r: any) => r.rate },
            { id: 'amount', label: 'Total Amount', fn: (r: any) => r.amount },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'petrol',
        name: 'Petrol Logs',
        fetcher: () => useVehicleStore.getState().fetchLogs('petrol'),
        storeSelector: () => useVehicleStore((s: any) => s.logs),
        filterData: (data: any[]) => data.filter(d => d.type === 'petrol'),
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'vehicleName', label: 'Vehicle', fn: (r: any) => r.vehicleName },
            { id: 'agentName', label: 'Agent', fn: (r: any) => r.agentName },
            { id: 'pumpName', label: 'Pump', fn: (r: any) => r.pumpName },
            { id: 'liter', label: 'Liters', fn: (r: any) => r.liter },
            { id: 'rate', label: 'Rate (₹)', fn: (r: any) => r.rate },
            { id: 'amount', label: 'Total Amount', fn: (r: any) => r.amount },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'labour',
        name: 'Labour Expenses',
        fetcher: () => useLabourStore.getState().fetchLabours(),
        storeSelector: () => useLabourStore((s: any) => s.labours),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'staffName', label: 'Staff Name', fn: (r: any) => r.staffName },
            { id: 'amount', label: 'Amount (₹)', fn: (r: any) => r.amount },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'ration',
        name: 'Ration Expenses',
        fetcher: () => useRationStore.getState().fetchRations(),
        storeSelector: () => useRationStore((s: any) => s.rations),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'name', label: 'Item Name', fn: (r: any) => r.name },
            { id: 'amount', label: 'Amount (₹)', fn: (r: any) => r.amount },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    },
    {
        id: 'extra',
        name: 'Extra Expenses',
        fetcher: () => useExtraStore.getState().fetchLogs(),
        storeSelector: () => useExtraStore((s: any) => s.logs),
        filterData: (data: any[]) => data,
        columns: [
            { id: 'date', label: 'Date', fn: (r: any) => new Date(r.date).toLocaleDateString('en-IN') },
            { id: 'expenseName', label: 'Expense Name', fn: (r: any) => r.expenseName },
            { id: 'amount', label: 'Amount (₹)', fn: (r: any) => r.amount },
            { id: 'remark', label: 'Remarks', fn: (r: any) => r.remark },
        ]
    }
];


export const Reports = () => {
    const currentBusiness = useBusinessStore(s => s.activeBusiness);
    const [selectedModuleId, setSelectedModuleId] = useState(REPORT_MODULES[0].id);
    const selectedModule = REPORT_MODULES.find(m => m.id === selectedModuleId)!;

    // Fetch data only for selected module
    useEffect(() => {
        if (currentBusiness) {
            selectedModule.fetcher();
        }
    }, [currentBusiness?._id, selectedModuleId]);

    const storeData = selectedModule.storeSelector();
    // Safety check just in case store doesn't exist or is undefined initially
    const safeData = Array.isArray(storeData) ? storeData : [];
    const specializedData = selectedModule.filterData ? selectedModule.filterData(safeData) : safeData;

    const [dateRange, setDateRange] = useState({
        from: '',
        to: ''
    });

    const [selectedCols, setSelectedCols] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initialMap: Record<string, boolean> = {};
        selectedModule.columns.forEach(col => {
            initialMap[col.id] = true;
        });
        setSelectedCols(initialMap);
    }, [selectedModuleId]);

    const handleToggleCol = (colId: string) => {
        setSelectedCols(prev => ({ ...prev, [colId]: !prev[colId] }));
    };

    const handleToggleAll = (val: boolean) => {
        const nextMap: Record<string, boolean> = {};
        selectedModule.columns.forEach(col => {
            nextMap[col.id] = val;
        });
        setSelectedCols(nextMap);
    };

    const filteredData = specializedData.filter((row: any) => {
        if (!row.date) return true;

        const rDate = new Date(row.date).getTime();
        const fromT = dateRange.from ? new Date(dateRange.from).getTime() : 0;
        const toT = dateRange.to ? new Date(dateRange.to).getTime() : Infinity;

        return rDate >= fromT && rDate <= (toT + 86400000); // include the "to" day
    });

    const activeColumns = selectedModule.columns.filter(c => selectedCols[c.id]);

    const exportExcel = () => {
        if (!activeColumns.length || !filteredData.length) return;

        const header = activeColumns.map(c => c.label.replace('₹', 'Rs.'));
        const rows = filteredData.map(row => activeColumns.map(c => {
            const val = c.fn(row);
            return typeof val === 'string' ? val.replace('₹', 'Rs.') : val;
        }));
        const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
        const wb = XLSX.utils.book_new();

        // Excel sheet names cannot exceed 31 characters
        const safeSheetName = selectedModule.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, safeSheetName);

        const safeName = selectedModule.name.replace(/ /g, '_');
        XLSX.writeFile(wb, `${safeName}_Export.xlsx`);
    };

    const exportPDF = () => {
        if (!activeColumns.length || !filteredData.length) return;
        const doc = new jsPDF('landscape');
        const header = [activeColumns.map(c => c.label.replace('₹', 'Rs.'))];
        const rows = filteredData.map(row => activeColumns.map(c => {
            const val = c.fn(row);
            return val !== null && val !== undefined ? String(val).replace('₹', 'Rs.') : '';
        }));

        doc.text(`Suman's CRM - ${selectedModule.name}`, 14, 15);
        if (dateRange.from || dateRange.to) {
            doc.setFontSize(10);
            doc.text(`Date Range: ${dateRange.from || 'Any'} to ${dateRange.to || 'Any'}`, 14, 22);
        }

        autoTable(doc, {
            head: header,
            body: rows,
            startY: dateRange.from || dateRange.to ? 28 : 22,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [67, 56, 202] },
        });

        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        // Open PDF in new tab
        window.open(url, '_blank');

        // Also trigger the native browser download UI
        const link = document.createElement('a');
        link.href = url;
        const safeName = selectedModule.name.replace(/ /g, '_');
        link.download = `${safeName}_Export.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-white">Reports & Exports</h1>
                    <p className="text-slate-500 mt-1">Generate dynamic excel sheets and PDFs for any module</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={exportExcel} disabled={!activeColumns.length || !filteredData.length} className="btn-secondary flex items-center gap-2">
                        <FileSpreadsheet size={18} className="text-emerald-600" /> Export Excel
                    </button>
                    <button onClick={exportPDF} disabled={!activeColumns.length || !filteredData.length} className="btn-primary flex items-center gap-2">
                        <FileText size={18} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Configuration Sidebar */}
                <div className="card p-5 h-fit lg:col-span-1 space-y-6">
                    {/* Module Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Layers size={16} /> Select Module
                        </label>
                        <select
                            value={selectedModuleId}
                            onChange={e => setSelectedModuleId(e.target.value)}
                            className="input-field w-full cursor-pointer"
                        >
                            {REPORT_MODULES.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Formatting */}
                    {selectedModule.id !== 'staff' && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <Calendar size={16} /> Date Range
                            </label>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-slate-500 mb-1 block">From</span>
                                    <input type="date" value={dateRange.from} onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))} className="input-field w-full text-sm" />
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 mb-1 block">To</span>
                                    <input type="date" value={dateRange.to} onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))} className="input-field w-full text-sm" />
                                </div>
                                {(dateRange.from || dateRange.to) && (
                                    <button onClick={() => setDateRange({ from: '', to: '' })} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Clear Filter</button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Column Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <CheckSquare size={16} /> Select Columns
                            </label>
                            <div className="flex gap-2">
                                <button onClick={() => handleToggleAll(true)} className="text-xs text-primary-600 hover:text-primary-700">All</button>
                                <span className="text-slate-300">|</span>
                                <button onClick={() => handleToggleAll(false)} className="text-xs text-slate-500 hover:text-slate-700">None</button>
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-slate-50 dark:bg-slate-900/30">
                            {selectedModule.columns.map(col => (
                                <label key={col.id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-md checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                                            checked={!!selectedCols[col.id]}
                                            onChange={() => handleToggleCol(col.id)}
                                        />
                                        <svg className="absolute w-3 h-3 text-white peer-checked:opacity-100 opacity-0 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300 select-none group-hover:text-primary-600 transition-colors">{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Preview */}
                <div className="card lg:col-span-3 flex flex-col h-[70vh]">
                    <div className="p-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between bg-white dark:bg-bg-dark-secondary sticky top-0">
                        <h3 className="font-semibold text-slate-800 dark:text-white">Preview</h3>
                        <span className="text-xs font-medium px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            {filteredData.length} records matching your criteria
                        </span>
                    </div>

                    <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/10">
                        {!activeColumns.length ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Please select at least one column.
                            </div>
                        ) : !filteredData.length ? (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                No records found for the selected module & date range.
                            </div>
                        ) : (
                            <table className="w-full text-left whitespace-nowrap text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 sticky top-0 z-10 shadow-sm">
                                        {activeColumns.map(c => (
                                            <th key={c.id} className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 tracking-wider text-xs uppercase">{c.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredData.map((row: any, i: number) => (
                                        <tr key={row._id || i} className="hover:bg-white dark:hover:bg-slate-800/40">
                                            {activeColumns.map(c => (
                                                <td key={c.id} className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                                    {c.fn(row)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

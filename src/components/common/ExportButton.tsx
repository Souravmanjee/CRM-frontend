import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ColumnDef<T> {
    header: string;
    key: keyof T | ((row: T) => string | number | undefined | null);
}

interface ExportButtonProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    filename: string;
}

export function ExportButton<T>({ data, columns, filename }: ExportButtonProps<T>) {
    const [Open, setOpen] = useState(false);

    const getFormattedData = () => {
        return data.map(item => {
            const row: Record<string, any> = {};
            columns.forEach(col => {
                if (typeof col.key === 'function') {
                    row[col.header] = col.key(item);
                } else {
                    row[col.header] = item[col.key];
                }
            });
            return row;
        });
    };

    const handleExportExcel = () => {
        const formattedData = getFormattedData();
        const safeData = formattedData.map(row => {
            const newRow: any = {};
            for (const key in row) {
                newRow[key.replace('₹', 'Rs.')] = row[key];
            }
            return newRow;
        });

        const ws = XLSX.utils.json_to_sheet(safeData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
        setOpen(false);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('landscape');
        const formattedData = getFormattedData();
        const tableColumn = columns.map(c => c.header.replace('₹', 'Rs.'));
        const tableRows = formattedData.map(row => columns.map(c => {
            const val = row[c.header];
            return val !== null && val !== undefined ? String(val).replace('₹', 'Rs.') : '';
        }));

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [99, 102, 241] } // Indigo-500
        });

        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);

        // Open PDF in new tab for reliable browser native viewing
        window.open(url, '_blank');

        // Also trigger the safe native download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}_${new Date().toISOString().split('T')[0]}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!Open)}
                className="btn-secondary flex items-center gap-2"
            >
                <Download size={18} />
                Export
            </button>

            {Open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                        <button
                            onClick={handleExportExcel}
                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                            <FileSpreadsheet size={18} className="text-emerald-500" />
                            Export to Excel
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                            <FileText size={18} className="text-rose-500" />
                            Export to PDF
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

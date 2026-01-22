import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [reportType, setReportType] = useState('monthly');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Fetch report data conditionally based on type
    const { data: report, isLoading, refetch } = useQuery({
        queryKey: ['report', reportType, date],
        queryFn: () => {
            if (reportType === 'monthly') {
                return reportService.getMonthlyReport(new Date(date));
            }
            return null; // Handle other types
        },
        enabled: false // Only fetch on button click
    });

    const handleGenerate = () => {
        refetch();
        toast.promise(refetch(), {
            loading: 'Generating report...',
            success: 'Report generated successfully',
            error: 'Failed to generate report'
        });
    };

    const handleExportCSV = () => {
        if (!report) return;

        // Convert report data to CSV string
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Category,Amount\n";

        report.byCategory.forEach((row: any) => {
            csvContent += `${row.name},${row.amount}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `report_${reportType}_${date}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-[#1e293b] dark:text-white">Financial Reports</h1>

            {/* Controls */}
            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary font-bold"
                    >
                        <option value="monthly">Monthly Statement</option>
                        <option value="spending">Spending Report</option>
                        <option value="tax">Tax Summary</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">Period</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Generating...
                            </>
                        ) : 'Generate Report'}
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            {report && (
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-[#1e293b] dark:text-white">Report Preview</h2>
                            <p className="text-sm text-gray-500">{format(new Date(date), 'MMMM yyyy')}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleExportCSV} className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2">
                                <span className="material-symbols-outlined">description</span>
                                Export CSV
                            </button>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark flex items-center gap-2">
                                <span className="material-symbols-outlined">picture_as_pdf</span>
                                Download PDF
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-1">Income</p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                    ${report.summary.income.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                                <p className="text-sm text-rose-600 dark:text-rose-400 font-bold mb-1">Expenses</p>
                                <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
                                    ${report.summary.expenses.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <p className="text-sm text-gray-500 font-bold mb-1">Net Flow</p>
                                <p className={`text-2xl font-bold ${report.summary.netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    ${report.summary.netFlow.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Breakdown Table */}
                        <h3 className="text-lg font-bold mb-4">Category Breakdown</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 rounded-l-lg">Category</th>
                                        <th className="px-6 py-3 rounded-r-lg text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {report.byCategory.map((row: any, i: number) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4 font-medium">{row.name}</td>
                                            <td className="px-6 py-4 text-right">${row.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

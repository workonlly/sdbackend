'use client';
import { useEffect, useState } from "react";

const APIURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ContactQueriesPage() {
    const [queries, setQueries] = useState<any[]>([]);
    const [openQuery, setOpenQuery] = useState<any>(null);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const res = await fetch(APIURL + "/handle/getcontact");
            const responseData = await res.json();
            setQueries(responseData.data || []);
        } catch (err) {
            console.error("Failed to fetch contact queries:", err);
        }
    };

    const markAsChecked = async (id: any) => {
        try {
            const res = await fetch(APIURL + "/handle/contactput", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setQueries(queries.map(q => q.id === id ? { ...q, checked: true } : q));
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-white">
                    <h1 className="text-2xl font-bold text-gray-900">Contact Queries</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage and respond to user messages</p>
                </div>
                
                <div className="overflow-x-auto">
                    {queries.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No contact queries found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name / Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {queries.map((query) => (
                                    <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(query.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{query.name}</div>
                                            <div className="text-sm text-gray-500">{query.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {query.title}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                            <button 
                                                onClick={() => setOpenQuery(query.message)}
                                                className="text-left w-full truncate hover:text-indigo-600 transition-colors focus:outline-none"
                                            >
                                                {query.message}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${query.checked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {query.checked ? 'Checked' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!query.checked ? (
                                                <button
                                                    onClick={() => markAsChecked(query.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors font-semibold"
                                                >
                                                    Mark as Checked
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 cursor-not-allowed">Done</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {openQuery && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-900">Message Details</h3>
                            <button 
                                onClick={() => setOpenQuery(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                            {openQuery}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setOpenQuery(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
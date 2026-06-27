'use client';
import { useEffect, useState } from "react";

const APIURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Gedcom() {
    const [gedcomData, setGedcomData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

    useEffect(() => {
        fetchGedcomData();
    }, []);

    const fetchGedcomData = async () => {
        try {
            const res = await fetch(`${APIURL}/gedcom/geting`);
            const responseData = await res.json();
            setGedcomData(responseData.data || []);
        } catch (err) {
            console.error("Failed to fetch gedcom data:", err);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${APIURL}/gedcom/puting`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) {
                console.error("Failed to sync gedcom data");
                setMessage({ text: "Failed to sync GEDCOM data.", type: "error" });
            } else {
                setMessage({ text: "Successfully synced GEDCOM data!", type: "success" });
            }
        } catch (err) {
            console.error("Error syncing gedcom data:", err);
            setMessage({ text: "Error connecting to server.", type: "error" });
        }
        // Refresh data
        await fetchGedcomData();
        setLoading(false);
        setTimeout(() => setMessage(null), 5000);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gedcom Data</h1>
                        <p className="text-gray-500 mt-1 text-sm">View and manage GEDCOM records</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {message && (
                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </span>
                        )}
                        <button 
                            onClick={handleUpdate}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    {gedcomData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No GEDCOM data found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Object.keys(gedcomData[0]).map((key) => (
                                        <th key={key} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {gedcomData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        {Object.values(row).map((val: any, idx) => (
                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
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
    );
}
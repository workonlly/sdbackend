'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

const APIURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function Gedcom() {
    const [gedcomData, setGedcomData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [activeTab, setActiveTab] = useState<'individuals' | 'historical'>('individuals');

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
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${APIURL}/gedcom/puting`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) {
                setMessage({ text: "Failed to sync GEDCOM data.", type: "error" });
            } else {
                setMessage({ text: "Successfully synced GEDCOM data!", type: "success" });
            }
        } catch (err) {
            setMessage({ text: "Error connecting to server.", type: "error" });
        }
        await fetchGedcomData();
        setLoading(false);
        setTimeout(() => setMessage(null), 5000);
    };

    const handleSyncMedia = async () => {
        setMediaLoading(true);
        setMessage(null);
        try {
            const res = await fetch(`${APIURL}/gedcom/sync-media`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) {
                setMessage({ text: "Failed to sync Media from Google Drive.", type: "error" });
            } else {
                setMessage({ text: "Successfully synced Media!", type: "success" });
            }
        } catch (err) {
            setMessage({ text: "Error connecting to server.", type: "error" });
        }
        await fetchGedcomData();
        setMediaLoading(false);
        setTimeout(() => setMessage(null), 5000);
    };

    const renderDriveImage = (id: string, alt: string) => (
        <a href={`https://drive.google.com/uc?id=${id}`} target="_blank" rel="noreferrer" className="block w-16 h-16 relative rounded-md overflow-hidden border border-gray-200 shrink-0 shadow-sm hover:opacity-80 transition-opacity" title={alt}>
            <Image src={`https://drive.google.com/thumbnail?id=${id}&sz=w800-h800`} alt={alt} fill className="object-cover" sizes="64px" unoptimized />
        </a>
    );

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gedcom & Media Sync</h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage GEDCOM data and Google Drive assets</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {message && (
                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </span>
                        )}
                        <button 
                            onClick={handleUpdate}
                            disabled={loading || mediaLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            {loading ? "Syncing GEDCOM..." : "Update GEDCOM"}
                        </button>
                        <button 
                            onClick={handleSyncMedia}
                            disabled={loading || mediaLoading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            {mediaLoading ? "Syncing Media..." : "Sync Media"}
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-gray-200 bg-gray-50 px-8">
                    <button 
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'individuals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('individuals')}
                    >
                        Individuals & Photos
                    </button>
                    <button 
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'historical' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('historical')}
                    >
                        Historical Documents
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading data...</div>
                    ) : gedcomData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No data found. Sync GEDCOM first.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                        {activeTab === 'individuals' ? 'Profile Photo' : 'Historical Documents'}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Raw Metadata</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {gedcomData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.given_names} {row.surname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activeTab === 'individuals' ? (
                                                row.googleurl ? (
                                                    renderDriveImage(row.googleurl.includes('id=') ? new URL(row.googleurl).searchParams.get('id') || row.googleurl.split('d/')[1]?.split('/')[0] : row.googleurl.split('d/')[1]?.split('/')[0], `Profile ${row.id}`)
                                                ) : (
                                                    <span className="text-gray-400 italic">No Photo</span>
                                                )
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {Array.isArray(row.relativelinks) && row.relativelinks.length > 0 ? (
                                                        row.relativelinks.map((url: string, i: number) => {
                                                            const id = url.includes('id=') ? new URL(url).searchParams.get('id') : url.split('d/')[1]?.split('/')[0];
                                                            return id ? <div key={i}>{renderDriveImage(id, `Doc ${i+1}`)}</div> : null;
                                                        })
                                                    ) : (
                                                        <span className="text-gray-400 italic">No Docs</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <details className="cursor-pointer mb-2">
                                                <summary className="hover:text-gray-700">Raw Metadata</summary>
                                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
                                                    {JSON.stringify(row.raw_metadata, null, 2)}
                                                </pre>
                                            </details>
                                            <details className="cursor-pointer mb-2">
                                                <summary className="hover:text-gray-700">Google URL</summary>
                                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
                                                    {row.googleurl || 'null'}
                                                </pre>
                                            </details>
                                            <details className="cursor-pointer">
                                                <summary className="hover:text-gray-700">Relative Links</summary>
                                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded max-w-xs overflow-auto">
                                                    {JSON.stringify(row.relativelinks, null, 2)}
                                                </pre>
                                            </details>
                                        </td>
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
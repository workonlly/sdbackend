'use client';
import { useEffect,useState } from "react";
const APIURL=process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000";
export default function page() {
    const [data,setData]=useState([])
    useEffect(() => {
        const put=async()=>{
            try {
                const res=await fetch(APIURL+"/update")
                const responseData=await res.json()
                setData(responseData.data || [])
            } catch (err) {
                console.error("Failed to fetch data:", err)
            }
        }

       
        put()
    }, []);
    const acceptUser = async (user: any) => {
        try {
            const res = await fetch(APIURL + "/update/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                setData(data.filter((d: any) => d.id !== user.id));
            } else {
                const errData = await res.json();
                alert("Error accepting user: " + errData.message);
            }
        } catch (err) {
            console.error("Failed to accept user:", err);
        }
    };

    const rejectUser = async (id: any) => {
        if (!confirm("Are you sure you want to reject this user?")) return;
        try {
            const res = await fetch(APIURL + "/update/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setData(data.filter((d: any) => d.id !== id));
            } else {
                alert("Error rejecting user");
            }
        } catch (err) {
            console.error("Failed to reject user:", err);
        }
    };
    return (
        <div className="w-full min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard - Users</h1>
                </div>
                <div className="p-0">
                    {data.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No data found or loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">allow or not</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.map((user: any, index: number) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">{user.id || index + 1}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile}</td>
                                            <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                                <button onClick={() => acceptUser(user)} className="bg-gray-600 hover:bg-green-600 text-white px-3 py-1 rounded-sm transition-colors">Accept</button>
                                                <button onClick={() => rejectUser(user.id)} className="bg-gray-600 hover:bg-red-600 text-white px-3 py-1 rounded-sm transition-colors">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
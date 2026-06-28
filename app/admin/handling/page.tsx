'use client';
import { useEffect, useState } from "react";

const APIURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function HandlingPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(APIURL + "/handle/logged");
            const responseData = await res.json();
            setUsers(responseData.data || []);
        } catch (err) {
            console.error("Failed to fetch logged in users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateRole = async (id: string, newRole: string) => {
        try {
            const res = await fetch(APIURL + "/handle/access", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, role: newRole })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
            } else {
                alert("Failed to update role");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const removeUser = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this user from the system?")) return;
        try {
            const res = await fetch(APIURL + "/handle/removeuser", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                alert("Failed to delete user");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200 bg-white">
                    <h1 className="text-2xl font-bold text-gray-900">User Handling</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage roles and access for active users in the system</p>
                </div>
                
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-gray-500">Loading data...</div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No active users found.</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mobile</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.mobile || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={user.role || 'user'}
                                                onChange={(e) => updateRole(user.id, e.target.value)}
                                                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => removeUser(user.id)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
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
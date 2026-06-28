'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const authDataStr = localStorage.getItem('admin_auth');
            if (!authDataStr) {
                router.push('/');
                return;
            }

            try {
                const authData = JSON.parse(authDataStr);
                if (authData.authenticated !== "yes" || new Date().getTime() > authData.expiry) {
                    localStorage.removeItem('admin_auth');
                    router.push('/');
                } else {
                    setIsChecking(false);
                }
            } catch (e) {
                localStorage.removeItem('admin_auth');
                router.push('/');
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (isChecking) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Checking authentication...</div>;
    }

    const navItems = [
        { name: 'Access', path: '/admin' },
        { name: 'Handling', path: '/admin/handling' },
        { name: 'Gedcom_update', path: '/admin/gedcom' },
        {name:'Contact query',path:'/admin/contact'}
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo / Title */}
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-gray-900 tracking-tight">Admin Control</span>
                            </div>
                            {/* Navigation Links */}
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.path;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                                isActive
                                                    ? 'border-indigo-600 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Navigation (Visible only on small screens) */}
                <div className="sm:hidden flex overflow-x-auto border-t border-gray-100">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                                    isActive
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    );
}
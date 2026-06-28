"use client";

import { useState } from "react";
const emaile=process.env.NEXT_PUBLIC_EMAIL;
const password=process.env.NEXT_PUBLIC_PASSWORD;
export default function Home() {
  // State management for the form
  const [credentials, setCredentials] = useState({
    email: emaile || '',
    password: password || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (credentials.email === emaile && credentials.password === password) {
      const expiry = new Date().getTime() + 15 * 60 * 1000; // 15 minutes
      localStorage.setItem('admin_auth', JSON.stringify({ authenticated: "yes", expiry }));
      window.location.href = "/admin";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Main Panel Container */}
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          {/* Optional: Use your Image import here for a logo */}
          {/* <Image src="/logo.png" alt="Logo" width={48} height={48} className="mx-auto mb-4" /> */}
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            System Access
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Authenticate to continue to your dashboard
          </p>
        </div>

        {/* Auth Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 mt-1.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all duration-200"
                placeholder="admin@local.host"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 mt-1.5 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-slate-800 transition-all duration-200"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 text-sm font-bold text-white bg-slate-900 rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-200"
          >
            Authenticate
          </button>
        </form>
      </div>
    </main>
  );
}
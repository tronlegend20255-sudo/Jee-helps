import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Home, Play, FileText, Menu, X, Timer } from 'lucide-react';
import { useState } from 'react';

import Dashboard from './lib/pages/Dashboard';
import Study from './lib/pages/Study';
import Practice from './lib/pages/Practice';
import MockTest from './lib/pages/MockTest';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Channels', path: '/', icon: Home },
    { label: 'Learn', path: '/study', icon: Play },
    { label: 'Practice PYQs', path: '/practice', icon: FileText },
    { label: 'Mock Test', path: '/mocktest', icon: Timer },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="font-bold text-xl tracking-tight">JEE Nexus</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex
        flex-col w-64 bg-white border-r border-gray-200 absolute md:relative z-20 h-full min-h-screen inset-y-0 left-0
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="font-bold text-2xl tracking-tight">JEE Nexus</h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">AI Preparation</p>
        </div>
        <div className="flex-1 py-4 md:py-0">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/mocktest" element={<MockTest />} />
        </Routes>
      </main>
    </div>
  );
}

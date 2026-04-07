import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, ShieldCheck, User as UserIcon, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex justify-between items-center w-full">
            <div className="flex items-center gap-3 text-white">
                <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">SmartCity<span className="text-blue-400">Control</span></h1>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-semibold text-slate-200">{user?.name}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        {user?.role === 'SUPER_ADMIN' && <ShieldCheck className="w-3 h-3 text-red-400" />}
                        {user?.role === 'CONTROL' && <ShieldCheck className="w-3 h-3 text-yellow-400" />}
                        {user?.role === 'PUBLIC' && <UserIcon className="w-3 h-3 text-emerald-400" />}
                        {user?.role?.replace('_', ' ')}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Admin Panel Link */}
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'CONTROL') && (
                        <Link
                            to={location.pathname === '/admin' ? '/dashboard' : '/admin'}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all border border-blue-500/30"
                        >
                            {location.pathname === '/admin' ? <LayoutDashboard className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                            <span className="hidden sm:inline text-sm font-medium">
                                {location.pathname === '/admin' ? 'Dashboard' : 'Admin'}
                            </span>
                        </Link>
                    )}

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/50"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

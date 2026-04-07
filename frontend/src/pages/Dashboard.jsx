import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ZoneCard from '../components/ZoneCard';
import WeatherCard from '../components/WeatherCard';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { AlertCircle, Activity, Clock, BellRing } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    const [zones, setZones] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [globalAlert, setGlobalAlert] = useState(null);

    // Fetch Initial Data
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/zones');
                setZones(res.data);
                if (res.data.length > 0) setSelectedZone(res.data[0]);
            } catch (error) {
                console.error("Error fetching zones", error);
            }
        };

        const fetchAlerts = async () => {
            if (user.role === 'SUPER_ADMIN' || user.role === 'CONTROL') {
                try {
                    const res = await axios.get('http://localhost:5000/api/alerts');
                    setAlerts(res.data.slice(0, 5)); // Keep last 5
                } catch (error) {
                    console.error("Error fetching alerts", error);
                }
            }
        };

        fetchZones();
        fetchAlerts();
    }, [user.role]);

    // Socket Listeners
    useEffect(() => {
        if (!socket) return;

        socket.on('zoneUpdate', (updatedZone) => {
            setZones(prevZones =>
                prevZones.map(z => z._id === updatedZone._id ? updatedZone : z)
            );

            // Update selected zone if it changes
            if (selectedZone && selectedZone._id === updatedZone._id) {
                setSelectedZone(updatedZone);
            }
        });

        socket.on('newAlert', (alert) => {
            if (alert.notified_roles.includes(user.role)) {
                setGlobalAlert(alert.message);
                // Clear after 10s
                setTimeout(() => setGlobalAlert(null), 10000);
            }

            if (user.role === 'SUPER_ADMIN' || user.role === 'CONTROL') {
                setAlerts(prev => [alert, ...prev].slice(0, 10));
            }
        });

        return () => {
            socket.off('zoneUpdate');
            socket.off('newAlert');
        };
    }, [socket, selectedZone, user.role]);

    // Format Alert Date
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Mock Chart Data for visualization
    const mockChartData = [
        { time: '10:00', density: 20, predicted: 25 },
        { time: '10:10', density: 35, predicted: 30 },
        { time: '10:20', density: 45, predicted: 40 },
        { time: '10:30', density: 50, predicted: 48 },
        { time: '10:40', density: 80, predicted: 65 },
        { time: '10:50', density: 110, predicted: 100 },
        { time: '11:00', density: selectedZone?.current_density || 120, predicted: 130 },
        { time: '11:10', density: null, predicted: 145 },
        { time: '11:20', density: null, predicted: 160 },
    ];

    return (
        <div className="min-h-screen bg-slate-900 pb-12">
            <Navbar />

            {/* Global Alert Banner */}
            {globalAlert && (
                <div className="bg-red-500 text-white px-6 py-3 flex items-center justify-center gap-3 animate-pulse shadow-lg shadow-red-500/20 z-50 sticky top-20">
                    <BellRing className="w-5 h-5" />
                    <span className="font-bold tracking-wide">{globalAlert}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 mt-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">
                            {user.role === 'SUPER_ADMIN' ? 'Command Center' :
                                user.role === 'CONTROL' ? 'Control Room' : 'City Hub'}
                        </h2>
                        <p className="text-slate-400 mt-1">
                            {user.role === 'SUPER_ADMIN' ? 'Complete system overview & predictive analytics' :
                                user.role === 'CONTROL' ? 'Zone monitoring & alert management' : 'Real-time zone status & weather updates'}
                        </p>
                    </div>
                </div>

                {user.role === 'PUBLIC' ? (
                    /* PUBLIC VIEW: Simplified layout */
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <WeatherCard locationName="City Center Zone" />
                            </div>

                            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-400" /> Real-Time City Zones
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {zones.map(zone => (
                                        <ZoneCard
                                            key={zone._id}
                                            zone={zone}
                                            onClick={null} // Disable clicking if not showing chart
                                        />
                                    ))}
                                    {zones.length === 0 && <p className="text-sm text-slate-500 text-center py-4 col-span-full">No zones available.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ADMIN & CONTROL VIEW: Full Analytics Dashboard */
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left Column: Zones & Weather */}
                        <div className="lg:col-span-1 space-y-6">
                            <WeatherCard locationName="City Center Zone" />

                            <div className="glass-panel rounded-2xl p-5 border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-400" /> Active Zones
                                </h3>
                                <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {zones.map(zone => (
                                        <ZoneCard
                                            key={zone._id}
                                            zone={zone}
                                            onClick={setSelectedZone}
                                        />
                                    ))}
                                    {zones.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No zones available.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Middle & Right Column: Analytics & Alerts */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* Main Heatmap/Chart Area */}
                            {selectedZone ? (
                                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

                                    <div className="flex justify-between items-end mb-6 relative z-10">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">{selectedZone.name}</h3>
                                            <p className="text-slate-400">Crowd Density Trends & Predictions</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-400 mb-1">Current Density</div>
                                            <div className="text-4xl font-black text-white">{selectedZone.current_density} <span className="text-xl text-slate-500 font-normal">/ {selectedZone.threshold_limit}</span></div>
                                        </div>
                                    </div>

                                    <div className="h-80 w-full mt-8 relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                                                    itemStyle={{ color: '#e2e8f0' }}
                                                />
                                                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" activeDot={{ r: 8 }} name="Actual Density" />
                                                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted (Next 1hr)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-slate-500 border border-slate-700/50 h-96">
                                    <Activity className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Select a zone to view detailed analytics</p>
                                </div>
                            )}

                            {/* Recent Alerts (Only for Admin/Control) */}
                            <div className="glass-panel rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-400" /> Recent System Alerts
                                </h3>

                                {alerts.length === 0 ? (
                                    <div className="text-center py-6 text-slate-500">No active alerts recorded.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {alerts.map((alert, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:bg-slate-800/80 ${alert.alert_level === 'Red' ? 'bg-red-500/5 border-red-500/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
                                                <div className={`mt-0.5 p-2 rounded-lg ${alert.alert_level === 'Red' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-semibold text-white">{alert.message}</p>
                                                        <span className="text-xs text-slate-500 whitespace-nowrap">{formatTime(alert.createdAt || new Date())}</span>
                                                    </div>
                                                    <p className={`text-xs mt-1 ${alert.alert_level === 'Red' ? 'text-red-300' : 'text-yellow-300'}`}>
                                                        Alert Level: {alert.alert_level.toUpperCase()} | Notified: {alert.notified_roles.join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

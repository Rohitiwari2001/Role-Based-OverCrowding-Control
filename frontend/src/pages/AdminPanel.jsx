import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ShieldAlert, Plus, ToggleLeft, ToggleRight, ListOrdered, CalendarClock, History, Cpu } from 'lucide-react';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [sensors, setSensors] = useState([]);
    const [zones, setZones] = useState([]);
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('sensors'); // 'sensors' or 'logs'
    const [newSensorName, setNewSensorName] = useState('');
    const [selectedZoneId, setSelectedZoneId] = useState('');

    useEffect(() => {
        if (user.role !== 'SUPER_ADMIN' && user.role !== 'CONTROL') return;

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Sensors
                const resSensors = await axios.get('http://localhost:5000/api/sensors', config);
                setSensors(resSensors.data);

                // Fetch Zones
                const resZones = await axios.get('http://localhost:5000/api/zones', config);
                setZones(resZones.data);
                if (resZones.data.length > 0) setSelectedZoneId(resZones.data[0]._id);

                // Fetch Logs
                const resLogs = await axios.get('http://localhost:5000/api/auth/logs', config);
                setLogs(resLogs.data);

            } catch (error) {
                console.error("Error fetching admin data", error);
            }
        };
        fetchData();
    }, [user.role]);

    const handleAddSensor = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/sensors', {
                name: newSensorName,
                zone_id: selectedZoneId
            }, { headers: { Authorization: `Bearer ${token}` } });

            setSensors([...sensors, res.data]);
            setNewSensorName('');
        } catch (error) {
            console.error("Error adding sensor", error);
        }
    };

    const handleToggleSensor = async (sensorId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/sensors/${sensorId}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });

            setSensors(sensors.map(s => s._id === sensorId ? res.data : s));
        } catch (error) {
            console.error("Error toggling sensor", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    if (user.role !== 'SUPER_ADMIN' && user.role !== 'CONTROL') {
        return (
            <div className="min-h-screen bg-slate-900 pb-12">
                <Navbar />
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="text-center p-8 glass-panel rounded-2xl border border-red-500/30">
                        <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                        <p className="text-slate-400">You do not have administrative privileges to view this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pb-12">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Settings</h2>
                        <p className="text-slate-400 mt-1">Manage physical hardware and track user activity</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-slate-700/50 pb-4">
                    <button
                        onClick={() => setActiveTab('sensors')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all ${activeTab === 'sensors' ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-500 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Cpu className="w-5 h-5" /> Hardware Sensors
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all ${activeTab === 'logs' ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500 font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <History className="w-5 h-5" /> Access Logs
                    </button>
                </div>

                {/* Content */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
                    {activeTab === 'sensors' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-blue-400" /> Sensor Nodes Registry
                                </h3>
                            </div>

                            <form onSubmit={handleAddSensor} className="mb-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Sensor Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newSensorName}
                                        onChange={(e) => setNewSensorName(e.target.value)}
                                        placeholder="e.g. SN-Central-01"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Assign to Zone</label>
                                    <select
                                        value={selectedZoneId}
                                        onChange={(e) => setSelectedZoneId(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 custom-scrollbar"
                                    >
                                        {zones.map(z => (
                                            <option key={z._id} value={z._id}>{z.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Node
                                </button>
                            </form>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                            <th className="pb-3 px-4">Node Name</th>
                                            <th className="pb-3 px-4">Assigned Zone</th>
                                            <th className="pb-3 px-4">Status</th>
                                            <th className="pb-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sensors.length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">No sensors registered.</td></tr>
                                        )}
                                        {sensors.map((sensor) => (
                                            <tr key={sensor._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                <td className="py-4 px-4 font-medium text-slate-200">{sensor.name}</td>
                                                <td className="py-4 px-4 text-slate-400">{sensor.zone_id?.name || 'Unknown'}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${sensor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                        {sensor.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => handleToggleSensor(sensor._id)}
                                                        className={`p-2 rounded-lg transition-colors border ${sensor.status === 'Active' ? 'text-red-400 bg-red-500/5 hover:bg-red-500/20 border-red-500/20' : 'text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/20 border-emerald-500/20'}`}
                                                        title={sensor.status === 'Active' ? "Disable Sensor" : "Enable Sensor"}
                                                    >
                                                        {sensor.status === 'Active' ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <History className="w-5 h-5 text-emerald-400" /> Platform Access History
                                </h3>
                            </div>

                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-700 text-slate-400 text-sm">
                                            <th className="pb-3 px-4">User</th>
                                            <th className="pb-3 px-4">Email Address</th>
                                            <th className="pb-3 px-4">Role Privileges</th>
                                            <th className="pb-3 px-4">Log Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length === 0 && (
                                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">No access logs found.</td></tr>
                                        )}
                                        {logs.map((log) => (
                                            <tr key={log._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                <td className="py-4 px-4 font-medium text-slate-200">{log.user_id?.name || 'Deleted User'}</td>
                                                <td className="py-4 px-4 text-slate-400">{log.user_id?.email || 'N/A'}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`text-xs px-2 py-1 rounded inline-block font-semibold 
                                                        ${log.user_id?.role === 'SUPER_ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                            log.user_id?.role === 'CONTROL' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                        {log.user_id?.role?.replace('_', ' ') || 'UNKNOWN'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-slate-300 flex items-center gap-2">
                                                    <CalendarClock className="w-4 h-4 text-slate-500" />
                                                    {formatDate(log.login_time)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

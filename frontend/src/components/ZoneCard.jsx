import React from 'react';
import { Users, AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';

const ZoneCard = ({ zone, onClick }) => {

    // Status styles
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Red':
                return {
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/50',
                    text: 'text-red-400',
                    icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
                    bar: 'bg-red-500'
                };
            case 'Yellow':
                return {
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/50',
                    text: 'text-yellow-400',
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-400" />,
                    bar: 'bg-yellow-500'
                };
            default:
                return {
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/50',
                    text: 'text-emerald-400',
                    icon: <Users className="w-6 h-6 text-emerald-400" />,
                    bar: 'bg-emerald-500'
                };
        }
    };

    const styles = getStatusStyles(zone.status);
    const densityRatio = Math.min((zone.current_density / zone.threshold_limit) * 100, 100);

    return (
        <div
            onClick={() => onClick && onClick(zone)}
            className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl rounded-xl p-5 border ${styles.bg} ${styles.border} relative overflow-hidden`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white truncate pr-2">{zone.name}</h3>
                    <div className={`mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${styles.bg} ${styles.text} border ${styles.border}`}>
                        {zone.status.toUpperCase()}
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${styles.bg} border ${styles.border}`}>
                    {styles.icon}
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-medium text-slate-300">Live Density</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">{zone.current_density}</span>
                        <span className="text-sm text-slate-500">/ {zone.threshold_limit}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden border border-slate-700">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${styles.bar}`}
                        style={{ width: `${densityRatio}%` }}
                    ></div>
                </div>
            </div>

            {/* Micro-interaction highlight on hover via CSS (implemented in Tailwind group hover normally, simplified here) */}
        </div>
    );
};

export default ZoneCard;

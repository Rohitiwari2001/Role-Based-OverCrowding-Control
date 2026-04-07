import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin } from 'lucide-react';

const WeatherCard = ({ locationName = "Current Location" }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchWeather = async (lat, lon) => {
            try {
                const res = await axios.get(`http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`);
                if (isMounted) {
                    setWeather(res.data);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to fetch weather data");
                    setLoading(false);
                }
            }
        };

        // Try getting real location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.warn("Geolocation blocked or failed. Using defaults.");
                    // Default to New York coords or similar if blocked
                    fetchWeather(40.7128, -74.0060);
                }
            );
        } else {
            fetchWeather(40.7128, -74.0060);
        }

        // Auto refresh every 10 mins
        const interval = setInterval(() => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => { fetchWeather(position.coords.latitude, position.coords.longitude); },
                    () => { fetchWeather(40.7128, -74.0060); }
                );
            }
        }, 600000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const getWeatherIcon = (condition) => {
        const c = condition?.toLowerCase() || '';
        if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="w-12 h-12 text-blue-400" />;
        if (c.includes('cloud')) return <Cloud className="w-12 h-12 text-gray-400" />;
        return <Sun className="w-12 h-12 text-yellow-400" />;
    };

    if (loading) return <div className="glass-panel p-6 rounded-2xl animate-pulse h-48 w-full border border-slate-700/50"></div>;
    if (error) return <div className="glass-panel p-6 rounded-2xl text-red-400 h-48 w-full border border-red-900/50 flex items-center justify-center">{error}</div>;

    const rainImpact = weather?.rain_probability > 50 ? "High rain probability may reduce expected crowds." : "Optimal weather for outdoor activities.";

    return (
        <div className="glass-panel p-6 rounded-2xl shadow-lg relative overflow-hidden transition-all hover:border-slate-600">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" /> {locationName}
                    </h3>
                    <p className="text-sm text-slate-400 capitalize">{weather?.condition}</p>
                </div>
                {getWeatherIcon(weather?.condition)}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                <div>
                    <div className="text-4xl font-bold text-white mb-1">{Math.round(weather?.temperature)}°C</div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-300" /> {weather?.humidity}%</span>
                        <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-emerald-300" /> {weather?.wind_speed} m/s</span>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex flex-col justify-center">
                    <span className="text-xs text-slate-400 font-medium mb-1">Impact Analysis</span>
                    <span className="text-xs text-blue-200 leading-tight">
                        {rainImpact}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;

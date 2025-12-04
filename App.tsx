import React, { useState, useEffect } from 'react';
import { fetchBelfastWeather } from './services/weatherService';
import { calculateUTCI } from './services/utciUtils';
import { generateSmartRoutes, getBelfastDensityInsights } from './services/geminiService';
import { WeatherData, UTCIResult, WalkRoute, ZoneDensity } from './types';
import UTCIIndicator from './components/UTCIIndicator';
import RouteCard from './components/RouteCard';
import DensityChart from './components/DensityChart';
import { WindIcon, DropletIcon, MapPinIcon, NavigationIcon } from './components/Icons';

const App = () => {
  // State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [utci, setUtci] = useState<UTCIResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'walk' | 'density'>('walk');
  
  // Route State
  const [startPoint, setStartPoint] = useState("Belfast City Hall");
  const [endPoint, setEndPoint] = useState("Titanic Belfast");
  const [routes, setRoutes] = useState<WalkRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState<number | null>(null);

  // Density State
  const [densityData, setDensityData] = useState<ZoneDensity[]>([]);

  // Initial Load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // 1. Get Weather
      const wData = await fetchBelfastWeather();
      setWeather(wData);
      
      // 2. Calc UTCI
      const uData = calculateUTCI(wData.temperature, wData.windSpeed, wData.humidity, wData.cloudCover, wData.isDay);
      setUtci(uData);

      // 3. Get Density Snapshot
      const dData = await getBelfastDensityInsights();
      setDensityData(dData);

      setLoading(false);
    };
    init();
  }, []);

  const handlePlanRoutes = async () => {
    if (!weather) return;
    setRoutesLoading(true);
    setRoutes([]);
    setSelectedRouteIdx(null);
    const generatedRoutes = await generateSmartRoutes(startPoint, endPoint, weather);
    setRoutes(generatedRoutes);
    setRoutesLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-slate-50 relative overflow-hidden shadow-2xl">
      
      {/* Header Background */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-teal-600 to-slate-800 rounded-b-[40px] z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-8">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center text-white mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Belfast Stride</h1>
            <p className="text-teal-100 text-sm opacity-90">Walkability & Comfort</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
            <NavigationIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Weather & UTCI Card */}
        {loading ? (
          <div className="w-full h-48 bg-white/20 animate-pulse rounded-2xl"></div>
        ) : weather && utci && (
          <div className="glass-panel p-6 rounded-3xl shadow-lg mb-6">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <span className="text-6xl font-light text-slate-800">{Math.round(weather.temperature)}°</span>
                  <div className="text-slate-500 font-medium ml-1">Current Temp</div>
               </div>
               <div className="space-y-2 text-right">
                  <div className="flex items-center justify-end gap-2 text-slate-600">
                    <span className="text-sm font-semibold">{weather.windSpeed} m/s</span>
                    <WindIcon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-slate-600">
                    <span className="text-sm font-semibold">{weather.humidity}%</span>
                    <DropletIcon className="w-4 h-4" />
                  </div>
               </div>
            </div>
            
            <UTCIIndicator data={utci} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
            <button 
                onClick={() => setActiveTab('walk')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'walk' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}
            >
                Route Planner
            </button>
            <button 
                onClick={() => setActiveTab('density')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'density' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'}`}
            >
                Crowd Density
            </button>
        </div>

        {/* Walk Planner Tab */}
        {activeTab === 'walk' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MapPinIcon className="w-5 h-5 text-teal-600" />
                        Plan Your Walk
                    </h2>
                    
                    <div className="space-y-3">
                        <div className="relative">
                            <div className="absolute left-3 top-3 w-2 h-2 rounded-full bg-teal-500"></div>
                            <input 
                                type="text"
                                value={startPoint}
                                onChange={(e) => setStartPoint(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                placeholder="Start Location"
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-3 w-2 h-2 rounded-full bg-orange-500"></div>
                            <input 
                                type="text"
                                value={endPoint}
                                onChange={(e) => setEndPoint(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                placeholder="Destination"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handlePlanRoutes}
                        disabled={routesLoading}
                        className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {routesLoading ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                Generating Routes...
                            </>
                        ) : (
                            "Find Routes"
                        )}
                    </button>
                </div>

                <div className="space-y-4">
                    {routes.map((route, idx) => (
                        <RouteCard 
                            key={idx} 
                            route={route} 
                            selected={selectedRouteIdx === idx}
                            onSelect={() => setSelectedRouteIdx(selectedRouteIdx === idx ? null : idx)}
                        />
                    ))}
                    {routes.length === 0 && !routesLoading && (
                        <div className="text-center text-slate-400 py-10 text-sm">
                            Enter locations to see optimized walking paths.
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Density Tab */}
        {activeTab === 'density' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Live Zone Density</h2>
                    <p className="text-xs text-slate-500 mb-4">Estimated footfall based on time, weather & trends.</p>
                    
                    {densityData.length > 0 ? (
                        <DensityChart data={densityData} />
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading density data...</div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="text-orange-800 text-xs font-bold uppercase mb-1">High Traffic</div>
                            <div className="text-orange-900 font-medium text-sm">Cathedral Quarter</div>
                            <div className="text-orange-600 text-xs mt-1">Avoid for quiet walks</div>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                            <div className="text-emerald-800 text-xs font-bold uppercase mb-1">Quiet Zone</div>
                            <div className="text-emerald-900 font-medium text-sm">Titanic Walkway</div>
                            <div className="text-emerald-600 text-xs mt-1">Recommended now</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;
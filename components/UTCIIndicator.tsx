import React from 'react';
import { UTCIResult } from '../types';

interface Props {
  data: UTCIResult;
}

const UTCIIndicator: React.FC<Props> = ({ data }) => {
  // Normalize value for a simple bar (-20 to 40 range)
  const percent = Math.min(100, Math.max(0, ((data.value + 20) / 60) * 100));

  return (
    <div className="w-full mt-4 p-4 bg-white/50 rounded-xl border border-white/40 shadow-sm">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Outdoor Comfort (UTCI)</h3>
          <p className={`text-xl font-bold ${data.color}`}>{data.stressCategory}</p>
        </div>
        <div className="text-right">
            <span className="text-3xl font-black text-slate-800">{data.value}°C</span>
        </div>
      </div>
      
      {/* Bar Gauge */}
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full opacity-30" 
             style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 25%, #10b981 50%, #f97316 75%, #ef4444 100%)' }}>
        </div>
        <div 
          className="absolute h-full w-2 bg-slate-800 rounded-full shadow-lg transition-all duration-1000 border-2 border-white"
          style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
        ></div>
      </div>
      
      <p className="mt-3 text-sm text-slate-600 italic">
        "{data.description}"
      </p>
    </div>
  );
};

export default UTCIIndicator;
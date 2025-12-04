import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ZoneDensity } from '../types';

interface Props {
  data: ZoneDensity[];
}

const DensityChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={100} 
            tick={{fontSize: 11, fill: '#64748b'}} 
            interval={0}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="densityScore" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.densityScore > 75 ? '#ef4444' : entry.densityScore > 50 ? '#f59e0b' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-between px-4 text-xs text-slate-400 mt-2">
        <span>Quiet</span>
        <span>Busy</span>
        <span>Crowded</span>
      </div>
    </div>
  );
};

export default DensityChart;
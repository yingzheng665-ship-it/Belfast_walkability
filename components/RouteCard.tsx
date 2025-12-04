import React from 'react';
import { WalkRoute, RouteType } from '../types';
import { LeafIcon, ZapIcon, BusIcon, UsersIcon } from './Icons';

interface Props {
  route: WalkRoute;
  selected: boolean;
  onSelect: () => void;
}

const RouteCard: React.FC<Props> = ({ route, selected, onSelect }) => {
  const getIcon = () => {
    switch (route.type) {
      case RouteType.LEISURE: return <LeafIcon className="w-5 h-5 text-emerald-600" />;
      case RouteType.FAST: return <ZapIcon className="w-5 h-5 text-amber-500" />;
      case RouteType.TRANSPORT: return <BusIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (route.type) {
        case RouteType.LEISURE: return 'border-emerald-200 bg-emerald-50/50';
        case RouteType.FAST: return 'border-amber-200 bg-amber-50/50';
        case RouteType.TRANSPORT: return 'border-blue-200 bg-blue-50/50';
    }
  }

  return (
    <div 
      onClick={onSelect}
      className={`cursor-pointer transition-all duration-300 relative overflow-hidden rounded-xl border-2 p-4 mb-3 
        ${selected ? `${getBorderColor()} shadow-md scale-[1.02]` : 'border-slate-100 bg-white hover:border-slate-300'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-white shadow-sm`}>
                {getIcon()}
            </div>
            <div>
                <h4 className="font-bold text-slate-800">{route.title}</h4>
                <div className="flex gap-2 text-xs font-medium text-slate-500">
                    <span>{route.duration}</span>
                    <span>•</span>
                    <span>{route.distance}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
        {route.type === RouteType.LEISURE && (
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100">
                <span className="text-emerald-600 font-bold">Nature</span>
                <span>{route.scenicScore}/10</span>
            </div>
        )}
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-100">
            <UsersIcon className="w-3 h-3 text-slate-400" />
            <span className={route.crowdLevel === 'High' ? 'text-red-500' : 'text-slate-600'}>
                {route.crowdLevel} Traffic
            </span>
        </div>
      </div>
      
      {selected && (
        <div className="mt-4 pt-3 border-t border-slate-200/50 animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-slate-700 mb-3">{route.description}</p>
            <div className="space-y-2">
                {route.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-sm">
                        <div className="min-w-[20px] text-slate-400 font-mono text-xs pt-1">{idx+1}</div>
                        <div className="text-slate-800">{step.instruction}</div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default RouteCard;
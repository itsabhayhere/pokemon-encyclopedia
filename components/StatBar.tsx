import React from 'react';
import { Shield, Zap, Heart, Sword, Crosshair, Gauge } from 'lucide-react';

interface StatBarProps {
  name: string;
  value: number;
  maxValue?: number;
}

const STAT_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; barColor: string }
> = {
  hp: {
    label: 'HP',
    icon: Heart,
    color: 'text-rose-400',
    barColor: 'from-rose-500 to-pink-500',
  },
  attack: {
    label: 'Attack',
    icon: Sword,
    color: 'text-orange-400',
    barColor: 'from-orange-500 to-amber-500',
  },
  defense: {
    label: 'Defense',
    icon: Shield,
    color: 'text-blue-400',
    barColor: 'from-blue-500 to-cyan-500',
  },
  'special-attack': {
    label: 'Sp. Atk',
    icon: Zap,
    color: 'text-purple-400',
    barColor: 'from-purple-500 to-violet-500',
  },
  'special-defense': {
    label: 'Sp. Def',
    icon: Crosshair,
    color: 'text-indigo-400',
    barColor: 'from-indigo-500 to-blue-500',
  },
  speed: {
    label: 'Speed',
    icon: Gauge,
    color: 'text-emerald-400',
    barColor: 'from-emerald-400 to-teal-500',
  },
};

export default function StatBar({ name, value, maxValue = 255 }: StatBarProps) {
  const config = STAT_CONFIG[name.toLowerCase()] || {
    label: name,
    icon: Zap,
    color: 'text-slate-300',
    barColor: 'from-slate-400 to-slate-500',
  };

  const Icon = config.icon;
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);

  const getTier = (val: number) => {
    if (val >= 130) return { label: 'S+', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    if (val >= 100) return { label: 'S', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    if (val >= 80) return { label: 'A', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    if (val >= 60) return { label: 'B', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    return { label: 'C', badge: 'bg-slate-700/40 text-slate-400 border-slate-600/30' };
  };

  const tier = getTier(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Icon className={`w-3.5 h-3.5 ${config.color}`} />
          <span>{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wider">{value}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tier.badge}`}>
            {tier.label}
          </span>
        </div>
      </div>
      <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${Math.max(percentage, 5)}%` }}
        />
      </div>
    </div>
  );
}

import React from 'react';
import { Wrench } from 'lucide-react';

interface MetricGaugeProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  thresholds: {
    warning: number;
    critical: number;
    reverse?: boolean;
  };
  healing?: boolean;
}

const MetricGauge: React.FC<MetricGaugeProps> = ({
  icon,
  label,
  value,
  unit,
  min,
  max,
  thresholds,
  healing,
}) => {
  // Calculate percentage for gauge (clamped between 0-100%)
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  // Determine color based on thresholds and value
  const getColor = () => {
    if (thresholds.reverse) {
      // For metrics where lower is worse (like oxygen levels)
      if (value <= thresholds.critical) return 'bg-red-500';
      if (value <= thresholds.warning) return 'bg-amber-500';
      return 'bg-emerald-500';
    } else {
      // For metrics where higher is worse (like temperature)
      if (value >= thresholds.critical) return 'bg-red-500';
      if (value >= thresholds.warning) return 'bg-amber-500';
      return 'bg-emerald-500';
    }
  };

  const getTextColor = () => {
    if (thresholds.reverse) {
      if (value <= thresholds.critical) return 'text-red-700';
      if (value <= thresholds.warning) return 'text-amber-700';
      return 'text-emerald-700';
    } else {
      if (value >= thresholds.critical) return 'text-red-700';
      if (value >= thresholds.warning) return 'text-amber-700';
      return 'text-emerald-700';
    }
  };

  return (
    <div className="bg-slate-50 p-3 rounded-lg relative">
      {healing && (
        <div className="absolute -top-1 -right-1 bg-amber-100 p-1 rounded-full z-10">
          <Wrench className="h-4 w-4 text-amber-500 repair-icon" />
        </div>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-600 flex items-center">
          {icon}
          <span className="ml-1">{label}</span>
        </span>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {value.toFixed(1)} {unit}
        </span>
      </div>
      
      <div className="h-2 bg-slate-200 rounded-full">
        <div
          className={`h-2 rounded-full transition-all duration-1000 metric-gauge ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default MetricGauge;